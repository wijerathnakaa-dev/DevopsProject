# Sri Lankan Tea and Herbal Drink E-Commerce Platform (ChaCeylon)

**DevOps Engineering Project — Group No:** 87  
**Students:** WIJERATHNA K.A.A.M. (EG/2023/5971) & Team  
**Stack:** React 19 + Vite (Frontend), Express.js + Node.js (Backend), MySQL 8.0 (Database), Docker & Docker Compose  

---

## 📁 Project Structure (Strictly Separated)

The project is organized into three clean, dedicated modules:

```text
DEVOPS PROJECT/
├── frontend/             # React 19 + Vite Customer & Admin UI
│   ├── src/              # Components, pages, context, styles, api service
│   ├── public/           # Authentic Ceylon tea imagery & brand assets
│   ├── Dockerfile        # Production multi-stage Docker build with Nginx
│   ├── nginx.conf        # Nginx SPA reverse proxy configuration
│   ├── package.json      # Frontend dependencies & scripts
│   └── .env              # VITE_API_URL=http://localhost:5000/api
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
│   └── .env              # DB & JWT configurations
│
├── database/             # MySQL 8.0 Database Scripts
│   ├── schema.sql        # DDL: categories, users, products, orders, order_items
│   ├── seed.sql          # DML: initial collections, tea items & default accounts
│   └── README.md         # Database documentation & manual import steps
│
└── docker-compose.yml    # Complete fullstack container orchestration
```

---

## 🔐 Default Credentials & Accounts

- **Database:** `tea_herbal_db` on `localhost:3306` (User: `root`, Password: `[CONFIGURED_IN_ENV]`)
- **Default Customer:** `customer@chaceylon.lk` / `customer123`
- **Default Administrator:** `admin@chaceylon.lk` / `admin123`

---

## 🚀 Running Locally

### 1. Database Setup
Ensure your local MySQL service (`MySQL80`) is running, then run:
```bash
cd backend
npm run init-db
```

### 2. Backend Server
```bash
cd backend
npm start
```
- API Base URL: `http://localhost:5000/api`
- Health Check: `http://localhost:5000/api/health`

### 3. Frontend Application
```bash
cd frontend
npm run dev
```
- Web Application: `http://localhost:5173/`

### 4. Running Backend Automated Tests
```bash
cd backend
npm test
```

---

## 🐳 Running with Docker Compose (DevOps Demonstration)

To run the entire fullstack microservices infrastructure in containers:
```bash
docker-compose up --build -d
```
- **Frontend Web UI:** `http://localhost:80`
- **Backend API:** `http://localhost:5000/api`
- **MySQL Container:** `localhost:3306`
