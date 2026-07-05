# Premium AI Personal Portfolio Monorepo

An award-winning, cinematic personal portfolio website designed for a Computer Engineering student specializing in **Artificial Intelligence, Machine Learning, Python Development, and Full Stack Engineering**. 

Developed using **Next.js 15, React 19, FastAPI, PostgreSQL, Tailwind CSS v4, Framer Motion, and GSAP**.

---

## 📂 Repository Structure

```
portfolio/
├── frontend/             # Next.js 15 App
│   ├── app/              # App Router (Home Page, Blog routes, Custom 404)
│   ├── components/       # Custom particles, Custom cursor, Floating AI assistant, Orbits
│   └── services/         # Axios API service queries (TanStack Query integration)
│
├── backend/              # FastAPI Application
│   ├── app/
│   │   ├── api/v1/       # Versioned API routes (Auth, Portfolio, Blog, Contact, CRUD Admin)
│   │   ├── models/       # SQLAlchemy ORM schemas
│   │   └── seed.py       # DB auto-populator
│   └── requirements.txt  # Python requirements (Python 3.13 ready)
│
└── README.md
```

---

## 🛠️ Tech Stack & Dependencies

### Frontend (Client-side)
* **Framework**: Next.js 15 (App Router) / React 19 / TypeScript
* **Design & Animations**: Tailwind CSS v4, Framer Motion, GSAP, Lucide React
* **Data Fetching**: TanStack React Query, Axios
* **Form & Validation**: React Hook Form, Zod

### Backend (Server-side)
* **Framework**: FastAPI (Python 3.13)
* **ORM & Database**: SQLAlchemy / SQLite (Local) / PostgreSQL (Neon ready)
* **Security & Tokens**: direct `bcrypt` password hashing, PyJWT tokens

---

## 🚀 Local Quickstart Guide

### Prerequisite Checklist
* Node.js (v18+) and npm
* Python (v3.10+)

### 1. Initialize and Seed the Database
Navigate to the backend directory, install requirements, and run the seeder:
```bash
cd backend
pip install -r requirements.txt
python app/seed.py
```
This creates a local database file `portfolio.db` populated with Archi Parmar's real-world details (GATE qualified, RPA survey publication, ML project models, etc.).

### 2. Start the Backend API
Start the FastAPI server:
```bash
uvicorn app.main:app --reload --port 8000
```
* **API Documentation**: Open [http://localhost:8000/api/v1/docs](http://localhost:8000/api/v1/docs) in your browser to view the generated Swagger UI interface.

### 3. Start the Next.js Frontend
In a new terminal window, navigate to the frontend directory and start the dev server:
```bash
cd frontend
npm run dev
```
* **Main OS Interface**: Open [http://localhost:3000](http://localhost:3000) to view the premium portfolio.

---

## 📡 Dynamic Extensions & Future Scaling

The monorepo is pre-configured to easily add:
1. **AI RAG Resume Chatbot**: Simply plug in a FAISS index loader in the FastAPI `contact` or `assistant` router.
2. **Cloudinary Integration**: Update `CLOUDINARY_*` env variables in `backend/app/core/config.py` to support dynamic image uploads.
3. **Blog CMS Dashboard**: Admin routes (`/api/v1/admin`) are already guarded by JWT auth to enable full CRUD on blog entries.
