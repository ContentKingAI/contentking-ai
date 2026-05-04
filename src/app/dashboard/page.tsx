import { LayoutTemplate, WandSparkles } from "lucide-react";
import { GeneratorForm } from "@/components/dashboard/GeneratorForm";
import { SubscriptionPanel } from "@/components/dashboard/SubscriptionPanel";
import { ButtonLink } from "@/components/ui/Button";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-black uppercase text-coral">Dashboard</p>
        <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">Generate social content that sells.</h1>
        <p className="mt-2 text-white/70">
          Mocked services power the prototype while keeping the production integration path clean.
        </p>
      </div>
      <SubscriptionPanel />
      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
          <LayoutTemplate className="h-6 w-6 text-mint" />
          <h2 className="mt-4 text-xl font-black text-ink">Templates</h2>
          <p className="mt-2 text-sm leading-6 text-ink/65">
            Browse launch-ready templates for posts, Reels, offers, calendars, and business niches.
          </p>
          <ButtonLink className="mt-4" href="/dashboard/templates">
            Open templates
          </ButtonLink>
        </article>
        <article className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
          <WandSparkles className="h-6 w-6 text-coral" />
          <h2 className="mt-4 text-xl font-black text-ink">Generator</h2>
          <p className="mt-2 text-sm leading-6 text-ink/65">
            Start from scratch or use a template to pre-fill your content brief.
          </p>
          <ButtonLink className="mt-4" href="/dashboard/generator" variant="secondary">
            Open generator
          </ButtonLink>
        </article>
      </section>
      <GeneratorForm />
    </div>
  );
}
