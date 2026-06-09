# Talk2Nebiah — Agent Guide

## Quick start
```bash
npm install              # install dependencies
cp .env.example .env     # configure DATABASE_URL, WhatsApp, Paystack, AI keys
npx prisma migrate dev   # apply schema to local PostgreSQL
npm run dev              # http://localhost:3000
npx prisma db seed       # create initial admin (requires ADMIN_EMAIL + ADMIN_PASSWORD in .env)
```

## Available scripts (only these)
| Command | What it does |
|---|---|
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Production server |
| `npm run lint` | ESLint (no typecheck, no tests exist) |

There is **no `typecheck` or `test` command**. Do not add one.

## Architecture
- **Next.js 16** App Router, **React 19**, **TypeScript**, **Tailwind CSS v4**, **Prisma 7** + PostgreSQL
- Path alias `@/*` → `./src/*`
- Landing page: `src/app/page.tsx` assembles components from `src/components/`
- Admin dashboard: `src/app/dashboard/` (Conversations, Payments, Behavior, Insights, Settings)
- API routes: `src/app/api/` (WhatsApp webhook, Paystack webhook, dashboard CRUD)

## Tailwind v4 specifics
- Uses `@import "tailwindcss"` (NOT `@tailwind` directives)
- Custom theme via `@theme {}` block in `src/app/globals.css`
- Mint palette: `mint` (#3EB489), `mint-dark`, `mint-light`, `mint-medium`
- `cn()` utility in `src/lib/utils.ts` (clsx + tailwind-merge) for conditional classes

## Key integrations & data flow
1. **Paystack** — User pays on the public Pricing page → Paystack calls `POST /api/payments/webhook` → Prisma creates Payment + generates 32-char hex auth token (128-bit) → token sent to user via email
2. **WhatsApp** — User sends token via WhatsApp → `POST /api/whatsapp/webhook` verifies token → user linked to WhatsApp number → subsequent messages handled by AI (`src/lib/ai.ts`, OpenAI-compatible, configurable endpoint)
3. **Admin dashboard** — Fetches data from `/api/dashboard/*` endpoints. Dashboard wiring in `src/context/DashboardContext.tsx`. All pages require admin login (JWT cookie).

## Prisma
- Schema: `prisma/schema.prisma`, config: `prisma/prisma.config.ts` (v7 `defineConfig`), seed: `prisma/seed.ts`
- `NEXT_PUBLIC_*` pricing env vars are build-time fallbacks; active values come from the database `GlobalSettings` table

## Environment
All required vars documented in `REQUIRED_ENV_VARS.md`. Key groups:
- `DATABASE_URL` (PostgreSQL)
- `WHATSAPP_*` (Phone ID, Access Token, Verify Token)
- `PAYSTACK_*` / `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`
- `AI_API_KEY`, `AI_MODEL`, `AI_ENDPOINT` (OpenAI-compatible)
- `NEXT_PUBLIC_SINGLE_*`, `NEXT_PUBLIC_MONTHLY_*` (pricing)
- `.env` is gitignored — never commit secrets
