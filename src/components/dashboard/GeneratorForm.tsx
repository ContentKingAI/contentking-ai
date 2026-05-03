"use client";

import { FormEvent, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { useAppState } from "@/context/AppStateProvider";
import type { GenerationInput, GenerationRecord, Language, Tone } from "@/types/saas";
import { OutputView } from "@/components/dashboard/OutputView";

const languages: Language[] = ["English", "Spanish", "French", "German", "Portuguese"];
const tones: Tone[] = ["Friendly", "Professional", "Bold", "Playful", "Luxury"];

const initialInput: GenerationInput = {
  businessName: "GlowBar Studio",
  product: "at-home skincare consultation",
  offer: "Book this week and get a free glow routine audit",
  language: "English",
  tone: "Bold"
};

export function GeneratorForm() {
  const { isSubscribed, generateContent, activateSubscription } = useAppState();
  const [input, setInput] = useState<GenerationInput>(initialInput);
  const [generation, setGeneration] = useState<GenerationRecord | null>(null);
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  function update<Key extends keyof GenerationInput>(key: Key, value: GenerationInput[Key]) {
    setInput((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!isSubscribed) {
      setError("Activate a monthly or yearly plan to unlock generation in this prototype.");
      return;
    }

    setIsGenerating(true);
    try {
      const nextGeneration = await generateContent(input);
      setGeneration(nextGeneration);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to generate content.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
        <div>
          <p className="text-sm font-black uppercase text-coral">Generator</p>
          <h2 className="mt-2 text-2xl font-black text-ink">Create a weekly content pack</h2>
          <p className="mt-2 text-sm leading-6 text-ink/70">
            Create a complete short-form content pack from one focused business brief.
          </p>
        </div>

        {!isSubscribed ? (
          <div className="mt-5 rounded-lg border border-honey/30 bg-honey/15 p-4">
            <h3 className="font-black text-ink">Generation locked</h3>
            <p className="mt-2 text-sm leading-6 text-ink/70">
              Activate a mock monthly or yearly plan to test the full generation and save flow.
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <Button onClick={() => activateSubscription("monthly")} variant="secondary">
                <Sparkles className="h-4 w-4" />
                Monthly
              </Button>
              <Button onClick={() => activateSubscription("yearly")}>
                <Sparkles className="h-4 w-4" />
                Yearly
              </Button>
              <ButtonLink href="/pricing" variant="secondary">
                See pricing
              </ButtonLink>
            </div>
          </div>
        ) : null}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-bold text-ink">Business name</span>
            <input
              className="field mt-2"
              onChange={(event) => update("businessName", event.target.value)}
              value={input.businessName}
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-ink">Product or service</span>
            <input
              className="field mt-2"
              onChange={(event) => update("product", event.target.value)}
              value={input.product}
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-ink">Offer</span>
            <textarea
              className="field mt-2 min-h-24 resize-none"
              onChange={(event) => update("offer", event.target.value)}
              value={input.offer}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-bold text-ink">Language</span>
              <select
                className="field mt-2"
                onChange={(event) => update("language", event.target.value as Language)}
                value={input.language}
              >
                {languages.map((language) => (
                  <option key={language}>{language}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-bold text-ink">Tone</span>
              <select
                className="field mt-2"
                onChange={(event) => update("tone", event.target.value as Tone)}
                value={input.tone}
              >
                {tones.map((tone) => (
                  <option key={tone}>{tone}</option>
                ))}
              </select>
            </label>
          </div>

          {error ? (
            <div className="rounded-lg border border-coral/25 bg-coral/10 p-3 text-sm font-semibold text-ink">
              {error}
            </div>
          ) : null}

          <Button className="w-full" disabled={isGenerating} type="submit">
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Generate weekly pack
          </Button>
        </form>
      </section>

      <section>
        {generation ? (
          <OutputView output={generation.output} />
        ) : (
          <div className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
            <p className="text-sm font-black uppercase text-mint">Output preview</p>
            <h2 className="mt-2 text-2xl font-black text-ink">Your generated pack appears here.</h2>
            <p className="mt-3 text-sm leading-6 text-ink/70">
              Once generated, the result is saved and appears on the history page.
            </p>
            <div className="mt-5 grid gap-3">
              {["5 captions", "5 reels hooks", "20 hashtags", "7 calendar days"].map((item) => (
                <div className="rounded-lg bg-cloud p-4 text-sm font-black text-ink" key={item}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
