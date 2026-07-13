# Talk2Nebiah — Production-Readiness Audit (Remaining Issues)

**Audit date:** 2026-06-08 | **Last updated:** 2026-06-09

> 3 cosmetic/feature issues remaining. All blockers, critical, and most high/medium items resolved.

---

## ☑️ Remaining Issues

| # | Issue | Where | Detail |
|---|-------|-------|--------|
| 16 | AI Behavior sandbox is fake | `src/app/dashboard/behavior/page.tsx:78-113` | Uses `if/else` keyword matching with pre-written strings instead of real AI API |
| 17 | Insights star ratings are mock | `src/app/dashboard/insights/page.tsx:213` | "Resolving a session automatically assigns a random mockup star rating" |
| 40 | `ipapi.co` geolocation free tier | `src/context/DashboardContext.tsx:201` | Free tier has rate limits; will break silently if quota exhausted |

---

## ✅ Resolved (37 of 40)

All items 1-15, 18-39 (excluding 16, 17) — auth, security, API wiring, DB schema, env docs, accessibility, rate limiting, indexes, cascades, logging, etc.
