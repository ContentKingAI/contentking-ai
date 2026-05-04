"use client";

import { Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { OutputView } from "@/components/dashboard/OutputView";
import { useAppState } from "@/context/AppStateProvider";
import { formatDate } from "@/lib/format";

export default function HistoryPage() {
  const { generations, deleteGeneration } = useAppState();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = useMemo(
    () => generations.find((item) => item.id === selectedId) ?? generations[0] ?? null,
    [generations, selectedId]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase text-coral">Saved results</p>
          <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">Generation history</h1>
          <p className="mt-2 text-white/70">Saved locally now, ready for a future Supabase generations table.</p>
        </div>
        <ButtonLink href="/dashboard">Create new pack</ButtonLink>
      </div>

      {generations.length === 0 ? (
        <div className="rounded-lg border border-ink/10 bg-white p-8 text-center shadow-sm">
          <h2 className="text-2xl font-black text-ink">No saved packs yet.</h2>
          <p className="mt-2 text-ink/70">Generate a weekly pack and it will appear here automatically.</p>
          <ButtonLink className="mt-6" href="/dashboard">
            Open generator
          </ButtonLink>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
          <section className="space-y-3">
            {generations.map((generation) => (
              <article
                className="rounded-lg border border-ink/10 bg-white p-4 shadow-sm"
                key={generation.id}
              >
                <button
                  className="block w-full text-left"
                  onClick={() => setSelectedId(generation.id)}
                  type="button"
                >
                  <p className="text-sm font-black text-ink">{generation.input.businessName}</p>
                  <p className="mt-1 text-sm text-ink/60">{generation.output.summary}</p>
                  <p className="mt-3 text-xs font-bold uppercase text-ink/50">
                    {formatDate(generation.createdAt)}
                  </p>
                </button>
                <Button
                  className="mt-3 h-10 min-h-10 w-full"
                  onClick={() => deleteGeneration(generation.id)}
                  variant="danger"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </article>
            ))}
          </section>

          <section>
            {selected ? <OutputView output={selected.output} /> : null}
          </section>
        </div>
      )}
    </div>
  );
}
