"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DemoGeneratorForm } from "@/components/demo/DemoGeneratorForm";
import { demoAccessService } from "@/services/demoAccessService";

export default function DemoDashboardPage() {
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const accessGranted = demoAccessService.hasAccess();

    if (!accessGranted) {
      router.replace("/demo");
      return;
    }

    setHasAccess(true);
    setIsReady(true);
  }, [router]);

  if (!isReady || !hasAccess) {
    return (
      <section className="brand-page px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-lg border border-ink/10 bg-white p-8 shadow-sm">
          <p className="text-sm font-black uppercase text-mint">Opening private demo</p>
          <div className="mt-4 h-3 w-64 animate-pulse rounded-full bg-cloud" />
        </div>
      </section>
    );
  }

  return (
    <section className="brand-page px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <p className="text-sm font-black uppercase text-coral">Demo dashboard</p>
          <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">Try ContentKing AI privately.</h1>
          <p className="mt-2 max-w-2xl text-white/70">
            No signup or payment needed here. Generate a limited sample pack, then choose a plan when you are ready.
          </p>
        </div>
        <DemoGeneratorForm />
      </div>
    </section>
  );
}
