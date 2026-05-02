import { Badge } from "@/components/ui/Badge";

const mockCaptions = [
  "Stop posting and hoping. Show the offer in one simple frame.",
  "Your next post can do more than fill the feed.",
  "Make it useful, make it clear, make it easy to say yes."
];

export function HeroProductPreview() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-[-120px] mx-auto hidden max-w-6xl px-6 lg:block"
    >
      <div className="grid grid-cols-[1fr_0.72fr] gap-4 rounded-lg border border-white/70 bg-white/80 p-4 shadow-soft backdrop-blur-xl">
        <div className="rounded-lg border border-ink/10 bg-cloud p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase text-coral">Weekly pack</p>
              <h2 className="mt-1 text-2xl font-black text-ink">GlowBar Studio</h2>
            </div>
            <Badge tone="success">Active yearly</Badge>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {mockCaptions.map((caption) => (
              <div className="rounded-lg bg-white p-4 shadow-sm" key={caption}>
                <div className="mb-3 h-2 w-12 rounded-full bg-mint" />
                <p className="text-sm font-semibold leading-6 text-ink">{caption}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-ink/10 bg-ink p-4 text-white">
          <div className="flex items-center justify-between">
            <p className="font-black">7-day calendar</p>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold">TikTok + IG</span>
          </div>
          <div className="mt-4 space-y-2">
            {["Proof post", "Offer reel", "Objection story", "Launch CTA"].map((item, index) => (
              <div className="flex items-center gap-3 rounded-lg bg-white/10 p-3" key={item}>
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-honey text-xs font-black text-ink">
                  {index + 1}
                </span>
                <span className="text-sm font-semibold">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
