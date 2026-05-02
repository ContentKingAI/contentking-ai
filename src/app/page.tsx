import { ArrowRight, CalendarDays, CreditCard, Database, LockKeyhole, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { HeroProductPreview } from "@/components/site/HeroProductPreview";

const featureCards = [
  {
    icon: Sparkles,
    title: "Weekly content packs",
    text: "Captions, reels hooks, hashtags, and a 7-day calendar generated from one focused brief."
  },
  {
    icon: LockKeyhole,
    title: "SaaS-shaped auth",
    text: "Mock signup and login today, structured for Supabase Auth when production keys are ready."
  },
  {
    icon: CreditCard,
    title: "$67/year plan",
    text: "Stripe-style subscription flow with upgrade and billing states already represented."
  },
  {
    icon: Database,
    title: "Saved history",
    text: "Local demo persistence behind a history service that can later target Supabase tables."
  }
];

const workflow = [
  "Enter business, product, offer, language, and tone.",
  "Generate a full Instagram/TikTok weekly pack.",
  "Save results and reuse the best ideas from history."
];

export default function LandingPage() {
  return (
    <>
      <section className="relative isolate min-h-[86vh] overflow-hidden bg-[linear-gradient(145deg,#f8fbfa_0%,#ffffff_44%,#e9fbf6_100%)]">
        <div className="absolute inset-0 -z-10 opacity-70 [background-image:linear-gradient(rgba(24,32,31,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(24,32,31,0.06)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="mx-auto max-w-7xl px-4 pb-44 pt-20 sm:px-6 lg:px-8 lg:pb-72 lg:pt-28">
          <div className="max-w-3xl">
            <Badge tone="success">AI content engine for short-form social</Badge>
            <h1 className="mt-6 max-w-3xl text-5xl font-black leading-none tracking-normal text-ink sm:text-6xl lg:text-7xl">
              ContentKing AI
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/70 sm:text-xl">
              Turn one offer into polished captions, reels hooks, hashtags, and a weekly calendar for Instagram and TikTok.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/signup">
                Start building
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink href="/pricing" variant="secondary">
                View $67/year plan
              </ButtonLink>
            </div>
          </div>
        </div>
        <HeroProductPreview />
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 md:grid-cols-4">
            {featureCards.map((item) => (
              <article className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm" key={item.title}>
                <item.icon className="h-6 w-6 text-coral" />
                <h2 className="mt-4 text-lg font-black text-ink">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-ink/70">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cloud px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <Badge tone="warning">Prototype now, production path later</Badge>
            <h2 className="mt-4 text-3xl font-black text-ink sm:text-4xl">Built with the upgrade path already marked.</h2>
            <p className="mt-4 text-ink/70">
              Each integration has its own service file, so the current localStorage mocks can be replaced by real Supabase, Stripe, and OpenAI calls without tearing apart the screens.
            </p>
          </div>
          <div className="grid gap-3">
            {workflow.map((item, index) => (
              <div className="flex items-center gap-4 rounded-lg border border-ink/10 bg-white p-4 shadow-sm" key={item}>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ink text-sm font-black text-white">
                  {index + 1}
                </span>
                <p className="font-semibold text-ink">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 rounded-lg border border-ink/10 bg-ink p-8 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CalendarDays className="h-8 w-8 text-mint" />
            <h2 className="mt-4 text-3xl font-black">One brief. One weekly content system.</h2>
            <p className="mt-3 max-w-2xl text-white/70">
              The prototype includes auth, billing, generation, history, and admin-ready foundations.
            </p>
          </div>
          <ButtonLink className="bg-white text-ink hover:bg-cloud" href="/signup">
            Open dashboard
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
