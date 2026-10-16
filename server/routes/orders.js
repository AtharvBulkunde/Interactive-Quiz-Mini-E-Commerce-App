import { Router } from "express";
import { z } from "zod";
import { pool } from "../db.js";

const router = Router();

const orderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().min(1).max(80),
    quantity: z.number().int().min(1).max(20)
  })).min(1).max(30),
  customer: z.object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email().max(254)
  })
});

router.post("/", async (req, res, next) => {
  const parsed = orderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid order data", details: parsed.error.issues });
  }

  const merged = new Map();
  for (const item of parsed.data.items) {
    merged.set(item.productId, (merged.get(item.productId) ?? 0) + item.quantity);
  }
  if ([...merged.values()].some((quantity) => quantity > 20)) {
    return res.status(400).json({ error: "Maximum quantity is 20 per product" });
  }

  let client;
  try {
    client = await pool.connect();
    await client.query("BEGIN");
    const ids = [...merged.keys()];
    const productsResult = await client.query(
      `SELECT id, name, price::float8 AS price FROM products
       WHERE active = TRUE AND id = ANY($1::text[]) FOR SHARE`,
      [ids]
    );
    if (productsResult.rows.length !== ids.length) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "One or more products are unavailable" });
    }

    const productsById = new Map(productsResult.rows.map((product) => [product.id, product]));
    const items = [...merged.entries()].map(([productId, quantity]) => {
      const product = productsById.get(productId);
      return { productId, quantity, unitPrice: product.price, name: product.name };
    });
    // Work in integer cents to avoid floating-point currency rounding errors.
    const subtotalCents = items.reduce(
      (sum, item) => sum + Math.round(item.unitPrice * 100) * item.quantity,
      0
    );
    const shippingCents = subtotalCents === 0 || subtotalCents >= 10_000 ? 0 : 699;
    const subtotal = subtotalCents / 100;
    const shipping = shippingCents / 100;
    const total = (subtotalCents + shippingCents) / 100;

    const orderResult = await client.query(
      `INSERT INTO orders (customer_name, customer_email, subtotal, shipping, total, status)
       VALUES ($1, $2, $3, $4, $5, 'pending') RETURNING id, status, subtotal, shipping, total, created_at`,
      [parsed.data.customer.name, parsed.data.customer.email, subtotal, shipping, total]
    );
    const order = orderResult.rows[0];

    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price)
         VALUES ($1, $2, $3, $4, $5)`,
        [order.id, item.productId, item.name, item.quantity, item.unitPrice]
      );
    }

    await client.query("COMMIT");
    res.status(201).json({
      order: { ...order, subtotal: Number(order.subtotal), shipping: Number(order.shipping), total: Number(order.total) },
      message: "Demo order saved as pending. No payment has been processed."
    });
  } catch (error) {
    if (client) {
      try {
        await client.query("ROLLBACK");
      } catch {
        // Preserve the original query error if rollback also fails.
      }
    }
    next(error);
  } finally {
    if (client) client.release();
  }
});

export default router;
