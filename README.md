BROKE AF — Your money. Your rules.

Production-ready Next.js + TypeScript personal finance app scaffold for college students.

Stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- NextAuth (Email + Google)
- OpenAI (server-side AI coach)
- Recharts, Framer Motion, lucide-react
- PDF/CSV/XLSX parsing + OCR pipeline (modular, lazy-loaded)

Quick start (development)
1. Copy .env.example to .env and fill values (DATABASE_URL, NEXTAUTH_URL, NEXTAUTH_SECRET, OPENAI_API_KEY, etc.)
2. Install dependencies: npm install
3. Create the database and run prisma migrations:
   - npx prisma migrate dev --name init
4. Start dev server: npm run dev

Deployment
- Target: Vercel (recommended). Set environment variables in Vercel dashboard.
- Use a managed Postgres instance (e.g., Vercel Postgres, Neon, Supabase).

Important
- Do NOT commit secrets. Keep OpenAI keys and DB URLs in environment variables.
- This repo scaffold includes the core schema and basic app layout. The full feature set (import pipeline, advanced AI integration, OCR, PWA, tests) will be implemented iteratively.

Directory structure (root)
- app/            # Next.js app routes and UI
- components/     # Reusable UI components
- lib/            # server utilities, parsers, ai wrappers
- prisma/         # Prisma schema and migrations
- public/         # static assets and manifest
- styles/         # global styles
- api/            # API routes (if used)
- tests/          # test fixtures & unit/integration tests

Environment
See .env.example

License & Security
This scaffold is for demonstration. Before production, add monitoring, error reporting, strong rate-limiting, and audit logging as described in the security notes.

