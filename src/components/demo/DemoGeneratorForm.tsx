"use client";

import { FormEvent, useEffect, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { OutputView } from "@/components/dashboard/OutputView";
import { aiService } from "@/services/aiService";
import { demoUsageService, type DemoUsage } from "@/services/demoUsageService";
import type { ContentPack, GenerationInput, Language, Tone } from "@/types/saas";

const languages: Language[] = ["English", "Spanish", "French", "German", "Portuguese"];
const tones: Tone[] = ["Friendly", "Professional", "Bold", "Playful", "Luxury"];

const initialInput: GenerationInput = {
  businessName: "GlowBar Studio",
  product: "at-home skincare consultation",
  offer: "Book this week and get a free glow routine audit",
  language: "English",
  tone: "Bold"
};

const initialUsage: DemoUsage = {
  used: 0,
  limit: 5,
  remaining: 5
};

export function DemoGeneratorForm() {
  const [input, setInput] = useState<GenerationInput>(initialInput);
  const [output, setOutput] = useState<ContentPack | null>(null);
  const [usage, setUsage] = useState<DemoUsage>(initialUsage);
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setUsage(demoUsageService.getUsage());
  }, []);

  function update<Key extends keyof GenerationInput>(key: Key, value: GenerationInput[Key]) {
    setInput((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      demoUsageService.assertCanGenerate();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to generate demo content.");
      return;
    }

    setIsGenerating(true);
    try {
      const nextOutput = await aiService.generateContent(input);
      const nextUsage = demoUsageService.recordGeneration();
      setOutput(nextOutput);
      setUsage(nextUsage);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to generate demo content.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
        <div>
          <p className="text-sm font-black uppercase text-coral">Private demo</p>
          <h2 className="mt-2 text-2xl font-black text-ink">Create a sample content pack</h2>
          <p className="mt-2 text-sm leading-6 text-ink/70">
            Try ContentKing AI without signup or payment. Demo content is limited to this browser.
          </p>
          <p className="mt-4 rounded-lg bg-cloud px-4 py-3 text-sm font-black text-ink">
            Demo generations left: {usage.remaining} / {usage.limit}
          </p>
        </div>

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
            Generate demo pack
          </Button>
        </form>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <ButtonLink href="/checkout?plan=monthly" variant="secondary">
            Start Monthly &mdash; $12/month
          </ButtonLink>
          <ButtonLink href="/checkout?plan=yearly">
            Start Yearly &mdash; $79/year
          </ButtonLink>
        </div>
      </section>

      <section>
        {output ? (
          <OutputView output={output} />
        ) : (
          <div className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
            <p className="text-sm font-black uppercase text-mint">Output preview</p>
            <h2 className="mt-2 text-2xl font-black text-ink">Your demo pack appears here.</h2>
            <p className="mt-3 text-sm leading-6 text-ink/70">
              The demo generates captions, reels hooks, hashtags, and a weekly calendar.
            </p>
            <div className="mt-5 grid gap-3">
              {["Captions", "Reels hooks", "Hashtags", "Weekly calendar"].map((item) => (
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
