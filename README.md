# ContentKing AI Prototype

A polished Next.js + Tailwind prototype for an AI social media content generator. It behaves like a SaaS product while using mock browser storage for auth, billing, generation history, and AI output.

## What is included

- Landing page and $67/year pricing page
- Mock signup/login/logout
- Dashboard with subscription status, generator form, recent results, and billing link
- Client-side demo generation for captions, reels hooks, hashtags, and a 7-day calendar
- Saved generation history in localStorage
- Billing page with mock yearly subscription activation/cancellation
- Admin-ready modules for future users, subscriptions, generations, and templates

## Service layer

The app is intentionally routed through replaceable services:

- `src/services/authService.ts`
- `src/services/aiService.ts`
- `src/services/billingService.ts`
- `src/services/historyService.ts`

Today those services use localStorage and deterministic mock content. Later they can be replaced with Supabase Auth, Supabase tables, Stripe Checkout/Portal, and the OpenAI API without rewriting the UI.

## Local setup

Install dependencies once a package manager is available:

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

This environment currently has Node available, but `npm` was not found on PATH during implementation.
