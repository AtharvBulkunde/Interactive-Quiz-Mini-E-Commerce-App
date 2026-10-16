import { Router } from "express";
import { query } from "../db.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT id, name, category, price::float8 AS price, rating::float8 AS rating,
              tag, description, image
       FROM products WHERE active = TRUE ORDER BY sort_order, name`
    );
    res.json({ products: rows });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT id, name, category, price::float8 AS price, rating::float8 AS rating,
              tag, description, image
       FROM products WHERE id = $1 AND active = TRUE`,
      [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: "Product not found" });
    res.json({ product: rows[0] });
  } catch (error) {
    next(error);
  }
});

export default router;
