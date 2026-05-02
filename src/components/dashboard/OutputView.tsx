"use client";

import { CalendarDays, Copy, Hash, MessageSquareText, Video } from "lucide-react";
import type { ContentPack } from "@/types/saas";

function copyText(value: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    void navigator.clipboard.writeText(value);
  }
}

export function OutputView({ output }: { output: ContentPack }) {
  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <MessageSquareText className="h-5 w-5 text-coral" />
          <h3 className="text-lg font-black text-ink">Captions</h3>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {output.captions.map((caption, index) => (
            <article className="rounded-lg border border-ink/10 bg-cloud p-4" key={caption}>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-black uppercase text-ink/50">Caption {index + 1}</span>
                <button
                  aria-label="Copy caption"
                  className="rounded-lg p-2 text-ink/60 hover:bg-white hover:text-ink"
                  onClick={() => copyText(caption)}
                  type="button"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm leading-6 text-ink/80">{caption}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <Video className="h-5 w-5 text-mint" />
          <h3 className="text-lg font-black text-ink">Reels hooks</h3>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {output.reelsHooks.map((hook) => (
            <div className="rounded-lg bg-ink p-4 text-sm font-semibold leading-6 text-white" key={hook}>
              {hook}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <Hash className="h-5 w-5 text-honey" />
          <h3 className="text-lg font-black text-ink">Hashtags</h3>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {output.hashtags.map((hashtag) => (
            <button
              className="rounded-full bg-cloud px-3 py-2 text-sm font-bold text-ink hover:bg-mint/15"
              key={hashtag}
              onClick={() => copyText(hashtag)}
              type="button"
            >
              {hashtag}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <CalendarDays className="h-5 w-5 text-coral" />
          <h3 className="text-lg font-black text-ink">Weekly calendar</h3>
        </div>
        <div className="mt-4 overflow-hidden rounded-lg border border-ink/10">
          <div className="grid bg-cloud px-4 py-3 text-xs font-black uppercase text-ink/50 md:grid-cols-[0.6fr_1fr_1.3fr_1.3fr_1fr]">
            <span>Day</span>
            <span className="hidden md:block">Theme</span>
            <span className="hidden md:block">Caption angle</span>
            <span className="hidden md:block">Reel idea</span>
            <span className="hidden md:block">CTA</span>
          </div>
          {output.calendar.map((item) => (
            <div className="grid gap-2 border-t border-ink/10 px-4 py-4 text-sm md:grid-cols-[0.6fr_1fr_1.3fr_1.3fr_1fr]" key={item.day}>
              <strong className="text-ink">{item.day}</strong>
              <span className="text-ink/70">{item.theme}</span>
              <span className="text-ink/70">{item.captionAngle}</span>
              <span className="text-ink/70">{item.reelIdea}</span>
              <span className="font-semibold text-ink">{item.callToAction}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
