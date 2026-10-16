import "dotenv/config";
import { pool } from "./db.js";

const products = [
  ["p1", "AeroPress", "Lifestyle", 39.99, 4.9, "BESTSELLER", "Smooth coffee, anywhere.", "https://images.unsplash.com/photo-1610889556528-9a770e32642f?auto=format&fit=crop&w=700&q=85", 1],
  ["p2", "Cloud Lamp", "Home", 64, 4.8, "NEW", "Soft light for slow evenings.", "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=85", 2],
  ["p3", "Studio Headphones", "Tech", 129, 4.9, "FAVORITE", "Immersive sound, clean design.", "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=85", 3],
  ["p4", "Ceramic Set", "Home", 52.5, 4.7, "HANDMADE", "Made for everyday rituals.", "https://images.unsplash.com/photo-1572119865084-43c285814d63?auto=format&fit=crop&w=700&q=85", 4],
  ["p5", "Everyday Tote", "Lifestyle", 42, 4.8, "ESSENTIAL", "Carry more. Keep it simple.", "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=700&q=85", 5],
  ["p6", "Desk Speaker", "Tech", 89, 4.6, "STUDIO", "Small speaker, rich atmosphere.", "https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&w=700&q=85", 6],
  ["p7", "Linen Throw", "Home", 58, 4.9, "SOFT", "Natural texture for quiet spaces.", "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=700&q=85", 7],
  ["p8", "Pocket Camera", "Tech", 179, 4.8, "LIMITED", "Keep everyday moments close.", "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=700&q=85", 8]
];

try {
  for (const product of products) {
    await pool.query(
      `INSERT INTO products (id, name, category, price, rating, tag, description, image, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, category=EXCLUDED.category,
       price=EXCLUDED.price, rating=EXCLUDED.rating, tag=EXCLUDED.tag,
       description=EXCLUDED.description, image=EXCLUDED.image, sort_order=EXCLUDED.sort_order`,
      product
    );
  }
  console.log(`Seeded ${products.length} demo products.`);
} finally {
  await pool.end();
}
