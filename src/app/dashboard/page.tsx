import { GeneratorForm } from "@/components/dashboard/GeneratorForm";
import { SubscriptionPanel } from "@/components/dashboard/SubscriptionPanel";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-black uppercase text-coral">Dashboard</p>
        <h1 className="mt-2 text-3xl font-black text-ink sm:text-4xl">Generate social content that sells.</h1>
        <p className="mt-2 text-ink/70">
          Mocked services power the prototype while keeping the production integration path clean.
        </p>
      </div>
      <SubscriptionPanel />
      <GeneratorForm />
    </div>
  );
}
