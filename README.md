# Mini CRM Dashboard

A simple Customer Relationship Management (CRM) dashboard with full CRUD and CSV import capabilities, built with React (Vite), Express, PostgreSQL, and Shadcn UI.

---

## 1. How to Setup the Project

### Frontend (Vite + React)

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Create a `.env` based on `.env.example`:
#    VITE_API_URL=http://localhost:4000

# 4. Run the development server
npm run dev
```

### Backend (Node + Express)

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Create a `.env` file:
#    DB_NAME=crm
#    DB_USER=<your_db_user>
#    DB_PASS=<your_db_password>
#    DB_HOST=localhost
#    JWT_SECRET=<a_secret_key>
#    PORT=4000

# 4. Run the server
npm run dev
```

### PostgreSQL Setup

1. Initialize or start your Postgres service (e.g. via Homebrew on macOS):
   ```bash
   brew services start postgresql
   ```
2. Create the database and user (if not existing):
   ```sql
   CREATE DATABASE crm;
   CREATE USER <your_db_user> WITH ENCRYPTED PASSWORD '<your_db_password>';
   GRANT ALL PRIVILEGES ON DATABASE crm TO <your_db_user>;
   ```

---

## 2. Project Folder Structure

```
mini-crm-dashboard/
├── backend/                # Express server and Sequelize models
│   ├── src/
│   │   ├── config/         # Database setup
│   │   ├── middleware/     # Auth middleware
│   │   ├── models/         # User & Customer Sequelize models
│   │   ├── routes/         # Auth & Customers API routes
│   │   └── database.js     # Sequelize initialization
│   ├── .env                # Environment variables
│   ├── package.json        # Backend dependencies & scripts
│   └── index.js            # Entry point
├── frontend/               # Vite + React client
│   ├── src/
│   │   ├── api/            # Axios services
│   │   ├── components/     # Shared UI (Shadcn, sidebar, table)
│   │   ├── context/        # AuthContext + ProtectedRoute
│   │   ├── pages/          # App pages: Login, Dashboard, Customers, Upload
│   │   ├── App.jsx         # Route definitions
│   │   └── main.jsx        # ReactDOM + AuthProvider
│   ├── index.css           # Global styles + CSS vars
│   ├── tailwind.config.js  # Tailwind configuration
│   ├── .env                # Vite environment variables
│   └── package.json        # Frontend dependencies & scripts
└── README.md               # This file
```

---

## 3. Tech Stack Rationale

* **React (via Vite)** : Fast HMR, modern DX, and component-driven architecture for the UI.
* **Express** : Minimal, unopinionated backend for REST APIs and middleware.
* **PostgreSQL** : Robust, scalable relational database, with native array support for tags.
* **Sequelize** : Promise-based ORM to map models to PostgreSQL tables.
* **Axios** : Simple HTTP client for API calls with built‑in interceptors.
* **Shadcn/UI** : Ready-made, accessible React components (tables, forms, dialogs) styled with Tailwind CSS for rapid UI buildout.

---

## 4. CSV Upload Instructions

1. In the **Upload** page, select a CSV file and click  **Upload** .
2. **Format** requirements:
   * Columns: `name`, `email`, `phone`, `company` (optional), `tags` (semicolon-separated, e.g. `Lead;Client`).
   * First row must be headers; no ordering constraints.
3. The server will stream-parse and batch-insert up to 1M rows.
4. After upload, a toast summary shows  **Total** ,  **Processed** ,  **Skipped** , **Failed** records, then auto‑navigates back to  **Customers** .

 **Sample CSV** :

```csv
name,email,phone,company,tags
John Doe,john@example.com,555-1234,Acme Inc,Lead;VIP
Jane Smith,jane@domain.com,555-5678,,Prospect
```

---

## 5. Known Limitations & Potential Improvements

* **Dockerization** : No Docker setup yet; containerization would simplify dev/staging.
* **Unit & Integration Tests** : Lacking test coverage—adding Jest/React Testing Library and supertest for APIs.
* **Live Deploy** : No automated CI/CD or hosting; could integrate Vercel/Heroku.
* **Performance** : CSV streaming uses in‑process memory; large-scale ingestion could move to a queue (e.g. Bull) or serverless functions.
* **Security** : Rate‑limiting, input sanitization, and HTTPS are not fully configured.

---

*Happy coding!*
