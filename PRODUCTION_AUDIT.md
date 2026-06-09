# Talk2Nebiah — Production-Readiness Audit

**Audit date:** 2026-06-08  
**Scope:** Full-stack Next.js 16 application — authentication, API, dashboard, landing page, integrations, database, environment, security

> 5 blocking, 6 critical, 12 high, 18 medium issues identified.

---

## 🔴 BLOCKERS — Must fix before any deployment

| # | Issue | Where | Why it blocks |
|---|-------|-------|---------------|
| 1 | **No authentication on any page or API** | All `/dashboard/*` pages + all `/api/dashboard/*` endpoints | Anyone who knows the URL can read ALL patient conversations, payment records, modify AI prompts, and change WhatsApp credentials. There is no login page, no middleware, no JWT, no session. The `Admin` model + seed credentials exist but are completely unused. |
| 2 | **No Prisma migrations exist** | `prisma/migrations/` is missing — never created | `npx prisma migrate dev` has never been run. You cannot connect to any database. |
| 3 | **Prisma client not generated** | `node_modules/.prisma/client/` missing | `npm run dev` / `npm run build` will fail immediately — TypeScript can't find `@prisma/client`. |
| 4 | **Auth tokens never delivered to users** | `src/app/api/payments/webhook/route.ts:76` — `// TODO: Send email or SMS with token` | After paying, users get a 6-char auth token logged to console but **never actually sent to them**. The core business flow (pay → receive token → use WhatsApp) is broken. |
| 5 | **No CSP / security headers** | `next.config.ts` is empty, no `middleware.ts` | Zero HTTP security headers. Vulnerable to clickjacking, XSS exfiltration, MIME sniffing. |

---

## 🟠 CRITICAL — Severe security & data risks

| # | Issue | Where | Detail |
|---|-------|-------|--------|
| 6 | **Hardcoded passcode `admin123`** with hint in placeholder | `src/app/dashboard/behavior/page.tsx:45,137` | Client-side-only gate, bypassable via browser console. The placeholder text literally tells users the passcode. |
| 7 | **WhatsApp webhook has hardcoded fallback verify token** | `src/app/api/whatsapp/webhook/route.ts:14` | If `WHATSAPP_WEBHOOK_VERIFY_TOKEN` env var is unset, the app accepts `'talk2nebiah_webhook_verify_token_12345'` — same string in `.env.example`. |
| 8 | **Dashboard API returns WhatsApp credentials** | `GET /api/dashboard/config` returns `whatsappConfig.accessToken` | Full WhatsApp API access token exposed over an unauthenticated endpoint. |
| 9 | **No pagination on conversations/payments** | `src/app/api/dashboard/conversations/route.ts`, `payments/route.ts` | Fetches ALL records. Will crash or timeout with real data volume. Also a DoS vector. |
| 10 | **WhatsApp + AI credentials stored in plaintext DB** | `GlobalSettings` model in `prisma/schema.prisma` | WhatsApp access tokens and phone IDs are stored and transmitted as plaintext. |
| 11 | **Payment type mismatch** | DB returns `'SUCCESSFUL'`, frontend type expects `'RECEIVED'` | `DashboardContext.tsx:45` declares `'RECEIVED'` but Prisma schema uses `'SUCCESSFUL'`. The type lies. |

---

## 🟡 HIGH — Must fix for functional production

| # | Issue | Where | Detail |
|---|-------|-------|--------|
| 12 | **`sendMessage` does nothing — only `console.log`** | `src/context/DashboardContext.tsx:233-237` | The "send reply as operator" flow in Conversations is completely stubbed. Operators cannot reply. |
| 13 | **Contact form does nothing** | `src/components/Contact.tsx:72` | `onSubmit={(e) => e.preventDefault()}` — no fetch, no API, no mailto, no server action. Dead form. |
| 14 | **Dashboard data mutations don't persist** | `togglePatientStatus`, `toggleSessionStatus`, `updatePatientNotes` | All three only update local React state. Changes are lost on page refresh. No API calls. |
| 15 | **Dashboard Overview uses entirely hardcoded/fake data** | `src/app/dashboard/page.tsx:49-57,62-67` | Chart data, activity log, admin name, revenue conversion rate (hardcoded 1500 NGN/USD) are all static/fake. PostgreSQL integration health is labelled **"SIMULATED"**. |
| 16 | **AI Behavior sandbox is fake** | `src/app/dashboard/behavior/page.tsx:78-113` | Sandbox uses `if/else` keyword matching with pre-written strings. Does not call the real AI API. The tone/safety settings only affect the sandbox, not the real AI pipeline. |
| 17 | **Insights star ratings are admitted mock data** | `src/app/dashboard/insights/page.tsx:213` | Text says: "Resolving a session automatically assigns a random mockup star rating from the patient to simulate feedback loops." |
| 18 | **`loading` state defined but never used** | `DashboardContext.tsx:108` vs all consumers | No page shows a loading indicator. Users see empty tables or fallback values while data fetches. |
| 19 | **No error states in any dashboard page** | All dashboard pages | Every API `catch` block only calls `console.error`. Users are never shown an error banner or retry option. |
| 20 | **9 dead placeholder links** | `Contact.tsx` (3 social), `Footer.tsx` (3 social + 3 legal) | All use `href="#"`. Social handles exist in `contact.md` but are not wired in. |
| 21 | **Accessibility: icon-only links missing `aria-label`** | `Header.tsx`, `Contact.tsx`, `Footer.tsx` | Hamburger button, social media icons — inaccessible to screen readers. |
| 22 | **Accessibility: Contact form + Pricing modal have no `id`/`htmlFor`** | `Contact.tsx:78-111`, `Pricing.tsx:123-147` | Form inputs and labels are not programmatically associated. |

---

## 🟢 MEDIUM — Important but not blocking

| # | Issue | Detail |
|---|--------|--------|
| 23 | `.env.example` lists only 4 vars; code needs 13+ | Missing: `PAYSTACK_SECRET_KEY`, `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`, `AI_API_KEY`, `AI_MODEL`, `AI_ENDPOINT`, `NEXT_PUBLIC_WHATSAPP_WEBHOOK_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` |
| 24 | `REQUIRED_ENV_VARS.md` lists 5 vars that are never read in code | `NEXT_PUBLIC_AI_SYSTEM_PROMPT`, `NEXT_PUBLIC_SINGLE_*`, `NEXT_PUBLIC_MONTHLY_*` — pricing comes from DB, system prompt is hardcoded. Dead docs. |
| 25 | `AGENTS.md` incorrectly says `NEXT_PUBLIC_*` pricing vars are "read by `Pricing.tsx`" | Pricing.tsx reads from React context, which fetches from the API/DB. |
| 26 | Auth token entropy is only 24 bits (6 hex chars) | `src/lib/token.ts:7` — `randomBytes(3).toString('hex')`. Industry standard is 128+ bits. |
| 27 | Auth tokens logged to console in production | `payments/webhook/route.ts:74` — `console.log(\`Generated token ${authToken.token} for user ${email}\`)` |
| 28 | Message content logged to browser console | `DashboardContext.tsx:235` — `console.log(\`Sending message to ${patientId}: ${content}...\`)` |
| 29 | Prisma SQL query logging enabled always | `src/lib/prisma.ts:8` — `log: ['query']` will log all SQL including WHERE clauses with emails/content in production. |
| 30 | No rate limiting on WhatsApp webhook | No limit on token verification attempts — brute-force possible (mitigated somewhat by 24hr expiry + single-use tokens). |
| 31 | Pricing configurator can nullify fields with partial payload | `config/route.ts` POST uses `upsert` — if `pricing` is omitted, `pricing?.singleNaira` is `undefined` and Prisma sets the column to NULL. |
| 32 | `gateway_response` misused as `geoCountry` | `payments/webhook/route.ts:64` — stores Paystack's gateway message text (e.g., "Successful") instead of a country. |
| 33 | 4 markdown content files in `src/content/` are completely unused | `homepage.md`, `about.md`, `services.md`, `contact.md` — never imported by any component. `about.md` and `services.md` describe different content than what renders. |
| 34 | Orphaned code: `saveToStorage()`, `addMockIncomingMessage` (noop) | `DashboardContext.tsx:205-209,314` — defined but never called. |
| 35 | No database indexes on foreign keys | `userId`, `sessionId` columns have no `@@index`. Fine initially, will degrade with scale. |
| 36 | No `onDelete` cascades on Prisma relations | Deleting a `User` would leave orphaned rows in `Payment`, `Session`, `AuthToken`. |
| 37 | Seed script doesn't create a `GlobalSettings` row | `prisma/seed.ts` only creates an `Admin`. The app may crash on first request if no `GlobalSettings` row exists (the GET handler does handle the null case with a create, but POST doesn't handle null). |
| 38 | `NEXT_PUBLIC_WHATSAPP_WEBHOOK_URL` used in server-only API route | `dashboard/config/route.ts:41` — should be non-public to avoid client bundle exposure. |
| 39 | Dashboard "Log out" button is decorative — no `onClick` | `dashboard/layout.tsx:94-96` |
| 40 | Third-party geolocation dependency | `ipapi.co` — rate-limited free tier, will break silently in production if quota exhausted. |

---

## ✅ Done Correctly

- Paystack webhook HMAC-SHA512 signature verification (gold standard)
- Prisma ORM throughout — no raw SQL, no SQL injection risk
- WhatsApp auth tokens are single-use with 24hr expiry
- Auth tokens properly verified server-side (`verifyToken` checks existence, expiry, usage)
- Headless/wrapper component pattern is clean
- Tailwind v4 with `@theme` is well-structured
- `cn()` utility for conditional classes
- Dashboard layout has clean responsive design

---

## 🎯 Recommended Build Order

### Phase 1 — Minimum Viable Production
1. Run `npx prisma generate` + `npx prisma migrate dev --name init` (unblocks database)
2. Update `.env` with real PostgreSQL credentials
3. Implement admin login page + JWT session (`POST /api/auth/login` + `middleware.ts`)
4. Add auth guard to all `/api/dashboard/*` routes and `/dashboard/*` pages
5. Remove the hardcoded `admin123` passcode on behavior page
6. Remove the hardcoded webhook verify token fallback — require env var
7. Implement token delivery (at minimum email via Resend/SendGrid, or SMS) in Paystack webhook
8. Add `Content-Security-Policy` and security headers via `next.config.ts` or middleware

### Phase 2 — Functional Completeness
9. Wire the Contact form to an API route or server action
10. Replace all placeholder social/legal links with real URLs
11. Implement actual `sendMessage` — POST to WhatsApp API
12. Make `togglePatientStatus`, `toggleSessionStatus`, `updatePatientNotes` call real API endpoints
13. Remove hardcoded mock data from dashboard overview (chart data, activities, admin name)
14. Replace sandbox AI mock with actual calls to the AI module
15. Add loading states and error states to all dashboard pages

### Phase 3 — Hardening
16. Increase auth token entropy (at least `randomBytes(8)` → 16 hex chars)
17. Remove Prisma query logging in production
18. Remove auth token console logging
19. Add pagination to conversations and payments API endpoints
20. Add rate limiting to WhatsApp webhook
21. Encrypt WhatsApp credentials at rest in the database
22. Add database indexes on foreign key columns
23. Fix the type mismatch (`SUCCESSFUL` vs `RECEIVED`)
24. Add `onDelete: Cascade` to Prisma relations
25. Seed a `GlobalSettings` row in the seed script
26. Fix `gateway_response` misused as `geoCountry`

### Phase 4 — Polish
27. Fix all form accessibility issues (labels, ids, aria attributes)
28. Either wire up or delete the `src/content/` markdown files
29. Update `.env.example` and `REQUIRED_ENV_VARS.md` to match reality
30. Fix `AGENTS.md` inaccuracies about pricing vars
31. Add `min` validation on pricing inputs
32. Add confirmation modal before saving price changes

---

## File inventory

| File | Purpose |
|------|---------|
| `AGENTS.md` | OpenCode agent instruction file |
| `PRODUCTION_AUDIT.md` | This file — full production-readiness audit |
