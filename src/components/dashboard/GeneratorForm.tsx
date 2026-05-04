"use client";

import { FormEvent, useEffect, useState } from "react";
import { LayoutTemplate, Loader2, Sparkles } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { useAppState } from "@/context/AppStateProvider";
import type { GenerationInput, GenerationRecord, Language, Tone } from "@/types/saas";
import { OutputView } from "@/components/dashboard/OutputView";
import { templateService } from "@/services/templateService";

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
  const { isSubscribed, generateContent, subscription } = useAppState();
  const [input, setInput] = useState<GenerationInput>(initialInput);
  const [generation, setGeneration] = useState<GenerationRecord | null>(null);
  const [selectedTemplateName, setSelectedTemplateName] = useState("");
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const selectedTemplate = templateService.getSelectedTemplate();

    if (!selectedTemplate) {
      return;
    }

    if (subscription?.plan === "free" && selectedTemplate.access === "premium") {
      setError("Upgrade to unlock premium templates.");
      templateService.clearSelectedTemplate();
      return;
    }

    setInput(selectedTemplate.input);
    setSelectedTemplateName(selectedTemplate.name);
    templateService.clearSelectedTemplate();
  }, [subscription?.plan]);

  function update<Key extends keyof GenerationInput>(key: Key, value: GenerationInput[Key]) {
    setInput((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!isSubscribed) {
      setError("Choose a plan to unlock generation in this prototype.");
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

        {selectedTemplateName ? (
          <div className="mt-5 flex items-start gap-3 rounded-lg border border-mint/25 bg-mint/10 p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-ink">
              <LayoutTemplate className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-black uppercase text-ink/50">Template applied</p>
              <h3 className="mt-1 font-black text-ink">{selectedTemplateName}</h3>
              <p className="mt-1 text-sm leading-6 text-ink/65">
                The form has been pre-filled from this template. Adjust the details before generating.
              </p>
            </div>
          </div>
        ) : null}

        {!isSubscribed ? (
          <div className="mt-5 rounded-lg border border-honey/30 bg-honey/15 p-4">
            <h3 className="font-black text-ink">Generation locked</h3>
            <p className="mt-2 text-sm leading-6 text-ink/70">
              Choose Free, Monthly, or Yearly to test the generation flow.
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <ButtonLink href="/pricing?plan=free" variant="secondary">
                Start Free
              </ButtonLink>
              <ButtonLink href="/pricing?plan=monthly" variant="secondary">
                Start Monthly
              </ButtonLink>
              <ButtonLink href="/pricing?plan=yearly">
                Start Yearly
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
              <p>{error}</p>
              {error.includes("free content packs") || error.includes("premium templates") ? (
                <ButtonLink className="mt-3 w-full" href="/pricing">
                  Upgrade
                </ButtonLink>
              ) : null}
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
