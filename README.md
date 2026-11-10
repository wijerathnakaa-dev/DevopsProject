# Sri Lankan Tea and Herbal Drink E-Commerce Platform (ChaCeylon)

**DevOps Engineering Project — Group No:** 87  
**Students:** WIJERATHNA K.A.A.M. (EG/2023/5971) & Team  
**Stack:** React 19 + Vite (Frontend), Express.js + Node.js (Backend), MySQL 8.0 (Database), Docker & Docker Compose  

---

## 🏭 About the Company

**ChaCeylon Manufactures** — *Nature's Blend for Modern Living*

ChaCeylon Manufactures is a Sri Lankan food and beverage manufacturing company focused on producing natural, wellness-oriented and export-quality products for local and international markets. Its range covers herbal teas, moringa products, herbal and fruit powders, flours, spices, snacks, beverages, bulk ingredient supply and OEM / private-label manufacturing.

| | |
|---|---|
| **Address** | No 269, Walawwegama, Vijithapura, Sri Lanka (Anuradhapura) |
| **Email** | ChaceylonManufactures@gmail.com |
| **Business hours** | Mon – Fri 9:00 AM – 6:00 PM · Sat 9:00 AM – 2:00 PM (Sri Lanka time) |

All company details used on the website live in one file: `frontend/src/config/company.js`.

---

## 📁 Project Structure (Strictly Separated)

The project is organized into three clean, dedicated modules:

```text
DEVOPS PROJECT/
├── frontend/             # React 19 + Vite Customer & Admin UI
│   ├── src/              # Components, pages, context, styles, api service, config/company.js
│   ├── public/           # Authentic Ceylon tea imagery & brand assets
│   ├── Dockerfile        # Production multi-stage Docker build with Nginx
│   ├── nginx.conf        # Nginx SPA reverse proxy configuration
│   ├── package.json      # Frontend dependencies & scripts
│   └── .env.example      # Copy to .env (VITE_API_URL=/api)
│
├── backend/              # Node.js + Express REST API Server
│   ├── src/
│   │   ├── config/       # MySQL connection pool (db.js)
│   │   ├── controllers/  # auth, product, order, admin controllers
│   │   ├── middleware/   # JWT authentication & admin authorization
│   │   ├── routes/       # auth, products, orders, admin routes
│   │   └── app.js        # Express app, CORS, routes & health checks
│   ├── scripts/
│   │   ├── initDb.js     # Automated MySQL schema & seed script
│   │   └── testApi.js    # Comprehensive automated API integration tests
│   ├── Dockerfile        # Containerized backend build
│   ├── server.js         # Backend server entry point (Port 5000)
│   └── .env.example      # Copy to .env and set DB & JWT values
│
├── database/             # MySQL 8.0 Database Scripts
│   ├── schema.sql        # DDL: categories, users, products, orders, order_items
│   ├── seed.sql          # DML: initial collections, tea items & default accounts
│   └── README.md         # Database documentation & manual import steps
│
├── .github/workflows/ci.yml  # CI: API tests, lint, build, Docker smoke test
├── .env.example          # Copy to .env for Docker Compose secrets
└── docker-compose.yml    # Complete fullstack container orchestration
```

---

## 🔐 Default Credentials & Accounts

- **Database:** `tea_herbal_db` on `localhost:3306` (credentials come from your `.env` file, never from the repo)
- **Default Customer:** `customer@chaceylon.lk` / `customer123`
- **Default Administrator:** `admin@chaceylon.lk` / `admin123`

> New sign-ups are always customers. Admin accounts can only be created in the database. Change the default passwords before any real deployment.

---

## 🚀 Running Locally

### 1. Environment Files
```bash
cp backend/.env.example backend/.env     # set DB_PASSWORD and JWT_SECRET
cp frontend/.env.example frontend/.env
```
The backend refuses to start without `JWT_SECRET`.

### 2. Database Setup
Ensure your local MySQL service (`MySQL80`) is running, then run:
```bash
cd backend
npm run init-db
```

### 3. Backend Server
```bash
cd backend
npm start
```
- API Base URL: `http://localhost:5000/api`
- Health Check: `http://localhost:5000/api/health`

### 4. Frontend Application
```bash
cd frontend
npm run dev
```
- Web Application: `http://localhost:5173/` (Vite forwards `/api` to the backend on port 5000)
- Offline UI demo without a backend: set `VITE_ENABLE_MOCK=true` in `frontend/.env`

### 5. Running Backend Automated Tests
```bash
cd backend
npm test
```

---

## 🐳 Running with Docker Compose (DevOps Demonstration)

To run the entire fullstack microservices infrastructure in containers:
```bash
cp .env.example .env        # then change every password/secret in .env
docker compose up --build -d
```
MySQL is checked with a healthcheck before the backend starts, and the backend's `/health` endpoint must pass before the frontend starts.
- **Frontend Web UI:** `http://localhost:80`
- **Backend API:** `http://localhost:5000/api` (also proxied at `http://localhost/api`)
- **MySQL Container:** `127.0.0.1:3306` (this machine only)

---

## ⚙️ Continuous Integration

Every push and pull request to `main` runs `.github/workflows/ci.yml`:
1. **Backend:** starts MySQL, seeds it, starts the API and runs `npm test` (fails the build on any failed test).
2. **Frontend:** `npm ci`, `npm run lint`, `npm run build`.
3. **Docker:** builds all images with Docker Compose, waits for healthchecks and smoke-tests the API through Nginx.
