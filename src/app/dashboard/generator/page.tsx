import { GeneratorForm } from "@/components/dashboard/GeneratorForm";
import { SubscriptionPanel } from "@/components/dashboard/SubscriptionPanel";

export default function GeneratorPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-black uppercase text-coral">Generator</p>
        <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">Create a content pack from your brief.</h1>
        <p className="mt-2 text-white/70">
          Use a template or start from scratch, then generate captions, hooks, hashtags, and a calendar.
        </p>
      </div>
      <SubscriptionPanel />
      <GeneratorForm />
    </div>
  );
}
