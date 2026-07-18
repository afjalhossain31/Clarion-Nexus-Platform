# Clarion Nexus Platform

## An Agentic AI-Powered Workspace developed for the daily operations and client management of Clarion Nexus Limited.

## Your all-in-one hub for digital solutions.

Clarion Nexus is a production-ready platform for a digital agency offering:
- Software Development
- AI Development
- Web Development
- UI/UX design
- Digital Marketing
- SEO

Clients can explore services, submit project requests, track them through a dashboard, and use two AI-powered features — a context-aware AI assistant and an AI proposal builder.

Built as a full stack agentic AI application end to end with modern technologies and best practices.

 --- 
## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Framer Motion,next-themes Tailwind CSS
- **Backend**: Node.js, Express.js, TypeScript, MongoDB (Mongoose), JWT (jsonwebtoken), Bcrypt (bcrypt) 
- **AI**: Gemini API
- **Deployment**: Vercel, Render
---

## Project structure

```
clarion-nexus/              # frontend
  src/app/                  # pages (home, login, register, dashboard, explore,
                             # services/[id], items/add, items/manage, generate, about, contact)
  src/components/           # Navbar, Footer, Hero, Services, ChatWidget, ServiceCard, etc.
  src/lib/                  # api.ts fetch wrapper, AuthContext.tsx

clarion-nexus-backend/      # backend
  src/models/                # User, Service, Request, Review, ChatHistory
  src/routes/                 # authRoutes, serviceRoutes, requestRoutes, aiRoutes
  src/controllers/             # authController, serviceController, requestController, aiController
  src/middleware/               # auth.ts, error.ts, validate.ts
  src/config/                    # db.ts, ai.ts
  src/scripts/seed.ts            # seeds demo user, admin user, and sample services
  src/server.ts                  # Express entry point
```

## Architecture

- **Project Structure**: Monorepo architecture with separate `frontend` and `backend` directories.
- **API Design**: RESTful API with proper routing and request validation.
- **Data Models**: Mongoose schemas for `User`, `Service`, `Request`, `ChatHistory`, etc.
- **Security**: JWT-based authentication with secure password hashing and CSRF protection.

## Features

- **Landing page** — animated hero, dynamic services grid (pulled from MongoDB), stats counter,
  testimonials, FAQ accordion, process timeline, final call-to-action
- **Explore page** — search, category and price filters, sorting, pagination, skeleton loaders
- **Service details page** — public, with overview, specs, and related services
- **Authentication** — email/password, Google sign-in, and a one-click demo login
- **Protected client dashboard** — `/items/add` to submit requests, `/items/manage` to track
  and delete them
- **AI Chat Assistant** — floating widget, remembers conversation history per user, typing
  indicator, suggested follow-up prompts
- **AI Content Generator** — drafts service proposals with adjustable tone and length
- **Dark / light mode** with an animated toggle
- **Fully responsive**, animated throughout with Framer Motion
---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
---
## Running the Application

### Start backend
```bash
cd backend
npm install
npm start
```

### Start frontend
```bash
cd ..
npm install
npm run dev
```

### API endpoints (after starting)
- **Authentication**: `/api/auth/login`, `/api/auth/register`, `/api/auth/me`
- **Services**: `/api/services`, `/api/services/:id`
- **Requests**: `/api/requests` (CRUD for authenticated users)
- **AI**: `/api/ai/chat`, `/api/ai/propose`

### Demo user
Run `npx ts-node backend/src/scripts/seed.ts` once to create:
- demo user: [EMAIL_ADDRESS]` / demo123`
- admin user: [EMAIL_ADDRESS]` / admin123`

### Backend (`clarion-nexus-backend/.env`)
```env
PORT=5000
MONGODB_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:3000
```

### Frontend (`clarion-nexus/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```
---
## Environment Variables   

Backend (.env) 

```env
PORT=5000 
MONGODB_URI="mongodb://localhost:27017/clarion_nexus" 
JWT_SECRET=your_secret 
CORS_OR IGIN=http://localhost:3000 
GEMINI_API_KEY=your_key
```

Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## License

This project is licensed under the MIT License.




