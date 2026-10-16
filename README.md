# LUMINA — Interactive Quiz + Mini E-Commerce App

Responsive storefront with product filtering, a persistent cart, an interactive quiz, a Node.js API, and PostgreSQL storage.

> **Demo checkout only:** orders are saved as `pending`. No payment is processed. Integrate a payment provider and verify signed webhooks before accepting real payments. Never collect or store raw card details.

## Features

- Responsive, accessible store UI with category filters and a cart drawer
- Cart quantity controls, subtotal, shipping rules, and checkout customer details
- Product API; order API validates product IDs and quantities and calculates prices server-side
- Interactive quiz UI with a local fallback and optional API-backed quizzes and scoring
- PostgreSQL tables for catalog, orders, order items, quizzes, questions, and quiz attempts
- Helmet headers, API rate limiting, request validation, CORS allowlist, and environment-based configuration

## Stack and structure

- Frontend: HTML, CSS, vanilla JavaScript
- Backend: Node.js 20+, Express
- Database: PostgreSQL 14+

```text
.
├── index.html
├── style.css
├── script.js
├── package.json
├── .env.example
├── .gitignore
└── server/
    ├── app.js
    ├── db.js
    ├── schema.sql
    ├── seed.js
    └── routes/
        ├── products.js
        ├── orders.js
        └── quizzes.js
```

## Run locally

1. Install Node.js 20+ and PostgreSQL 14+.
2. Install the packages:

   ```bash
   npm install
   ```

3. Create a PostgreSQL database named `lumina`. Copy `.env.example` to `.env`, then set `DATABASE_URL` to your database connection string.
4. Create the schema and seed demo products and a quiz:

   ```bash
   psql "$DATABASE_URL" -f server/schema.sql
   npm run seed
   ```

5. Start the web app and API:

   ```bash
   npm run dev
   ```

6. Open `http://localhost:3000`. Check `http://localhost:3000/api/health`.

## API

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Service and database status |
| GET | `/api/products` | List active products |
| GET | `/api/products/:id` | Get one product |
| POST | `/api/orders` | Save a validated pending demo order |
| GET | `/api/quizzes` | List published quizzes |
| GET | `/api/quizzes/:id` | Get questions (answers are not exposed) |
| POST | `/api/quizzes/:id/attempts` | Score a quiz attempt on the server |

Example order body:

```json
{
  "items": [
    { "productId": "p1", "quantity": 2 },
    { "productId": "p3", "quantity": 1 }
  ],
  "customer": {
    "name": "Demo Customer",
    "email": "customer@example.com"
  }
}
```

The backend fetches product prices from PostgreSQL. It never trusts prices or totals sent by the browser. Order creation is not payment confirmation.

## Frontend and deployment

- **Local:** Express serves the existing frontend and API from one origin.
- **Frontend:** Vercel can serve the static files.
- **Backend:** deploy the Node server to a Node-capable host (for example, Render or Railway) and configure `DATABASE_URL`, `PORT`, and `CORS_ORIGIN`.
- **Separate frontend/API domains:** set `window.LUMINA_API_BASE_URL = "https://YOUR-BACKEND-DOMAIN"` before `script.js` in `index.html`. Set `CORS_ORIGIN` on the API to the exact deployed frontend origin. Replace the example with your real API domain.
- **Database:** use managed PostgreSQL and run `server/schema.sql` before `npm run seed`.

A static Vercel deployment by itself does not run this Express server. The quiz and product UI has local fallback data, but orders are not persisted unless the API and database are configured.

## Production checklist

- Use HTTPS and an exact CORS origin allowlist.
- Store secrets only in hosting environment variables; never commit `.env`.
- Add authentication and authorization before exposing customer order history or admin features.
- Add automated tests, migrations, logging, backups, and privacy/retention policies.
- Integrate a payment provider and verify signed payment webhooks before marking orders paid.
- Review image licenses and use product imagery you own or are allowed to use.

This is a learning/portfolio project, not a production-ready store until those steps are complete.
