# ContentKing AI Prototype

A polished Next.js + Tailwind prototype for an AI social media content generator. It behaves like a SaaS product while using mock browser storage for demo access, auth, billing, generation history, and AI output.

## What is included

- Landing page, monthly/yearly pricing page, and paid checkout page
- Private demo access page and separate demo dashboard
- Paid customer signup/login/logout
- Dashboard with subscription status, generator form, recent results, and billing link
- Client-side demo generation for captions, reels hooks, hashtags, and a 7-day calendar
- Saved generation history in localStorage
- Billing page with mock monthly/yearly subscription activation, cancellation, and content pack credit tracking
- Monthly plan: $12/month with 300 AI content packs/month
- Yearly plan: $79/year with 5,000 AI content packs/year
- Admin-ready modules for future users, subscriptions, generations, and templates

## Access flows

### Demo access

- Public route: `/demo`
- Correct demo code stores `demoAccessGranted=true` in localStorage
- Successful demo access redirects to `/demo/dashboard`
- Demo dashboard does not require signup or payment
- Demo usage is limited to 5 generations per browser
- Demo usage is stored as `demoGenerationsUsed`
- After the limit is reached, the demo prompts the user to choose a paid plan

Set the demo code with:

```bash
NEXT_PUBLIC_DEMO_ACCESS_CODE=KING2026
```

### Paid customer access

- Public routes: `/` and `/pricing`
- Paid checkout route: `/checkout`
- Choosing a plan stores mock checkout state in localStorage:
  - `selectedPlan`
  - `subscriptionStatus`
  - `textGenerationLimit`
  - `textGenerationsUsed`
- Signup and login are part of the paid customer flow
- `/dashboard`, `/dashboard/history`, `/dashboard/billing`, and `/admin` require a signed-in user with an active mock subscription
- If a user visits paid dashboard routes without an active subscription, they are sent to `/checkout`

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
