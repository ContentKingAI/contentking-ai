"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { demoAccessService } from "@/services/demoAccessService";

export default function DemoAccessPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (demoAccessService.hasAccess()) {
      router.replace("/demo/dashboard");
      return;
    }

    setIsReady(true);
  }, [router]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const requiredCode = demoAccessService.getRequiredCode();

    if (requiredCode && code.trim() === requiredCode) {
      demoAccessService.grantAccess();
      router.push("/demo/dashboard");
      return;
    }

    setError("Invalid demo code. Please contact ContentKing AI for access.");
  }

  if (!isReady) {
    return (
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md rounded-lg border border-ink/10 bg-white p-6 shadow-soft">
          <div className="h-3 w-48 animate-pulse rounded-full bg-cloud" />
        </div>
      </section>
    );
  }

  return (
    <section className="bg-cloud px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md rounded-lg border border-ink/10 bg-white p-6 shadow-soft">
        <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-ink text-white">
          <LockKeyhole className="h-6 w-6" />
        </span>
        <h1 className="mt-5 text-3xl font-black text-ink">Enter Demo Access Code</h1>
        <p className="mt-2 text-sm leading-6 text-ink/70">
          This private demo lets you generate a few sample content packs before choosing a paid plan.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-bold text-ink">Demo access code</span>
            <input
              className="field mt-2"
              onChange={(event) => setCode(event.target.value)}
              placeholder="Enter code"
              value={code}
            />
          </label>

          {error ? (
            <div className="rounded-lg border border-coral/25 bg-coral/10 p-3 text-sm font-semibold text-ink">
              {error}
            </div>
          ) : null}

          <Button className="w-full" type="submit">
            Unlock private demo
          </Button>
        </form>
      </div>
    </section>
  );
}
