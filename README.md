# ContentKing AI Prototype

A polished Next.js + Tailwind prototype for an AI social media content generator. It behaves like a SaaS product with Supabase Auth/profile storage, plus mock browser storage for demo access, generation history, and AI output.

## What is included

- Landing page, public templates page, Free/Monthly/Yearly pricing page, and checkout page
- Private demo access page and separate demo dashboard
- Supabase email/password signup/login/logout
- Dashboard with subscription status, generator form, recent results, and billing link
- Public template gallery plus paid dashboard templates that pre-fill the generator form
- Client-side demo generation for captions, reels hooks, hashtags, and a 7-day calendar
- Saved generation history in localStorage
- Billing page with mock Free/Monthly/Yearly subscription management and content pack credit tracking
- Free plan: $0/month with 10 AI content packs/month
- Monthly plan: $12/month with 300 AI content packs/month
- Yearly plan: $79/year with 5,000 AI content packs/year
- Admin-ready modules for future users, subscriptions, generations, and templates
- Admin customer view backed by the Supabase `profiles` table

## Access flows

### Demo access

- Public route: `/demo`
- Correct demo code stores `demoAccessGranted=true` in localStorage
- Demo access also stores the matching code locally, so old access is invalidated if the demo code changes
- Successful demo access redirects to `/demo/dashboard`
- Demo dashboard does not require signup or payment
- Demo usage is limited to 5 generations per browser
- Demo usage is stored as `demoGenerationsUsed`
- After the limit is reached, the demo prompts the user to choose a paid plan

Set the demo code with:

```bash
NEXT_PUBLIC_DEMO_ACCESS_CODE=KING2026
```

### Free plan access

- Public route: `/pricing`
- Choosing Free sends the user to `/signup?plan=free`
- Free signup/login does not require Stripe Checkout
- Free plan state is stored in the Supabase `profiles` table:
  - `selectedPlan=free`
  - `subscriptionStatus=free`
  - `textGenerationLimit=10`
  - `textGenerationsUsed=0`
  - `billingInterval=free`
- Free users can access `/dashboard`
- Free users are limited to 10 content packs per month
- Premium templates show an upgrade prompt for Free users

### Paid customer access

- Public routes: `/`, `/pricing`, and `/templates`
- Plan selection routes: `/pricing` and `/checkout`
- Choosing Monthly or Yearly stores selected checkout state locally until Stripe completes:
  - `selectedPlan`
  - `subscriptionStatus`
  - `textGenerationLimit`
  - `textGenerationsUsed`
- Signup and login display the selected plan and then start Stripe Checkout for paid plans
- Successful Stripe payment returns to `/dashboard?payment=success`
- After payment success, the Supabase `profiles` row is updated with plan, subscription status, and credits
- `/dashboard`, `/dashboard/history`, `/dashboard/billing`, and `/admin` require a signed-in user with Free or active paid access
- If a user visits paid dashboard routes without payment/subscription success, they are sent to `/pricing`

## Supabase setup

Create a Supabase project, then run the SQL in `supabase/profiles.sql` in the Supabase SQL editor. It creates:

- `public.profiles`
- Row-level security policies for a user to read/update their own profile
- An auth trigger that creates a profile row when a Supabase Auth user is created
- A primary key on `profiles.id` and unique email index to prevent duplicate customer profiles

The profile columns are:

- `id`
- `email`
- `full_name`
- `plan`
- `subscription_status`
- `text_generation_limit`
- `text_generations_used`
- `created_at`

For local and Vercel environments, set:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_ADMIN_EMAIL=
```

`SUPABASE_SERVICE_ROLE_KEY` is server-only and is used by `/api/admin/profiles` to read all customer profiles for the in-app admin page. Set `NEXT_PUBLIC_ADMIN_EMAIL` to the email that should be allowed to view the admin customer list. For the smoothest prototype signup flow, turn off Supabase email confirmation while testing, or users may need to confirm their email before the browser has a signed-in session.

## Service layer

The app is intentionally routed through replaceable services:

- `src/services/authService.ts`
- `src/services/aiService.ts`
- `src/services/billingService.ts`
- `src/services/historyService.ts`
- `src/services/templateService.ts`
- `src/services/profileService.ts`

Auth and customer profiles now use Supabase. Generation history, AI output, demo access, and parts of checkout state remain prototype services and can later be moved to Supabase tables, Stripe Checkout/Portal, and the OpenAI API without rewriting the UI.

## Stripe checkout

After signup or login, the app calls `POST /api/stripe/checkout` with `{ "plan": "monthly" }` or `{ "plan": "yearly" }`.

Set these variables to use real Stripe Checkout subscriptions:

```bash
STRIPE_SECRET_KEY=
STRIPE_MONTHLY_PRICE_ID=
STRIPE_YEARLY_PRICE_ID=
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_ADMIN_EMAIL=
```

Use recurring Stripe Price IDs that start with `price_` for `STRIPE_MONTHLY_PRICE_ID` and `STRIPE_YEARLY_PRICE_ID`. Product IDs that start with `prod_` cannot be used as Checkout line item prices.

If `STRIPE_SECRET_KEY` is missing, signup/login falls back to the local mock subscription flow so the prototype keeps working without real payment credentials.

The app also includes the current Monthly and Yearly Stripe Price IDs as non-secret fallback values, so Checkout can still work if Vercel has not picked up the price ID variables yet. Keep the Vercel variables set anyway so price changes can be made without code changes.

For Vercel, add these Environment Variables in the project settings:

```bash
STRIPE_SECRET_KEY=
STRIPE_MONTHLY_PRICE_ID=
STRIPE_YEARLY_PRICE_ID=
NEXT_PUBLIC_APP_URL=https://contentking-ai.vercel.app
```

Redeploy the Vercel project after adding or changing environment variables.

## Local setup

Install dependencies once a package manager is available:

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

This environment currently has Node available, but `npm` was not found on PATH during implementation.
