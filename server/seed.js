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
  const quizId = "11111111-1111-4111-8111-111111111111";
  const quizQuestions = [
    ["11111111-1111-4111-8111-111111111101", "Which detail should a checkout page show before an order is placed?", ["Only the product image", "The order total", "A hidden fee", "A random product"], 1, 1],
    ["11111111-1111-4111-8111-111111111102", "Where should an e-commerce app verify the final product price?", ["Only in the browser", "In a URL fragment", "On the server using trusted data", "In a button label"], 2, 1],
    ["11111111-1111-4111-8111-111111111103", "What is a good way to protect database credentials?", ["Put them in HTML", "Commit them to GitHub", "Use server environment variables", "Share them in the page title"], 2, 1],
    ["11111111-1111-4111-8111-111111111104", "What should a demo checkout clearly communicate?", ["Payment succeeded", "It is a demo and no payment was processed", "The order is shipped", "No price is needed"], 1, 1]
  ];

  await pool.query(
    `INSERT INTO quizzes (id, title, description, question_count, published)
     VALUES ($1, $2, $3, $4, TRUE)
     ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, description=EXCLUDED.description,
       question_count=EXCLUDED.question_count, published=TRUE`,
    [quizId, "Everyday Tech & Shopping", "A short quiz about checkout and secure web apps.", quizQuestions.length]
  );
  await pool.query("DELETE FROM quiz_questions WHERE quiz_id = $1", [quizId]);
  for (let index = 0; index < quizQuestions.length; index++) {
    const [id, prompt, options, answerIndex, points] = quizQuestions[index];
    await pool.query(
      `INSERT INTO quiz_questions (id, quiz_id, prompt, options, answer_index, points, sort_order)
       VALUES ($1, $2, $3, $4::jsonb, $5, $6, $7)`,
      [id, quizId, prompt, JSON.stringify(options), answerIndex, points, index + 1]
    );
  }

  console.log(`Seeded ${products.length} demo products and ${quizQuestions.length} quiz questions.`);
} finally {
  await pool.end();
}
