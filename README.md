# Altametrics Full Stack Assignment – Invoices Dashboard

This is a full-stack demo application built for the Altametrics coding assessment. It showcases a simple yet robust invoices dashboard with authentication, pagination, sorting, and light/dark UI, all using modern tooling.

---

## 🛠️ Tech Stack

### Frontend
- ⚡ [Vite](https://vitejs.dev/) + React + TypeScript
- 🎨 [Tailwind CSS](https://tailwindcss.com/)
- 🔍 [React Query](https://tanstack.com/query) for data fetching and caching
- ✅ [Zod](https://zod.dev/) + [React Hook Form](https://react-hook-form.com/) for validation
- 🧠 [Redux Toolkit](https://redux-toolkit.js.org/) for auth state
- 🔐 Protected routing via `react-router-dom`

### Backend
- 🚀 [NestJS](https://docs.nestjs.com/)
- 📦 [Prisma](https://www.prisma.io/) ORM + PostgreSQL
- 🔐 JWT Auth with Passport
- 🐳 Docker + `docker-compose` setup

---

🚀 Getting Started
1. Clone the repo

git clone https://github.com/orangebit-tech/altametrics.git
cd altametrics

2. Start the database and server
cp server/.env.example server/.env

docker-compose --env-file server/.env up --build
This will spin up PostgreSQL and run seed data via Prisma.

Start server
cd server
npm install
npm run start:dev

3. Start the frontend
cd ./client
npm install
npm run dev
Open http://localhost:5173

✨ Features
✅ Login with JWT

✅ Redux-managed auth with persistent token

✅ Responsive dashboard layout

✅ Sortable invoice table (server-side)

✅ Invoice detail modal

✅ Pagination with accurate page count

✅ Dark/light theme toggle

✅ Loading/error handling throughout

🔐 Protected routes using Redux token

🧪 Optional Features (Completed)
 Pagination

 Error handling

 Modal invoice viewer


📦 Docker Setup Summary
PostgreSQL container

Prisma DB push + seed

Server and client run independently

📍 Project Notes
Designed for simplicity, clarity, and correctness.

Not pixel-perfect, but mobile-friendly and accessible.

Can be extended easily with new features like filtering, editing, etc.

📧 Contact
If you have any questions or feedback, feel free to reach out!

---

Let me know if you'd like a **Playwright test example**, or for me to include `.env.example` or CLI snippets for seeding and container startup.






