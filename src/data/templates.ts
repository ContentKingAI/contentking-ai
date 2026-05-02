import type { TemplateRecord } from "@/types/saas";

export const contentTemplates: TemplateRecord[] = [
  {
    id: "tpl_caption_conversion",
    name: "Conversion Caption Pack",
    description: "Caption angles for product-aware Instagram and TikTok posts.",
    category: "captions",
    prompt:
      "Create short-form social captions with a clear offer, believable benefit, and action-oriented close.",
    fields: ["businessName", "product", "offer", "language", "tone"],
    isActive: true,
    createdAt: "2026-05-02T00:00:00.000Z"
  },
  {
    id: "tpl_reels_hooks",
    name: "Reels Hook Sprint",
    description: "Thumb-stopping opening lines for short-form video.",
    category: "reels",
    prompt:
      "Write hooks that can be spoken in the first three seconds of a vertical video.",
    fields: ["businessName", "product", "offer", "language", "tone"],
    isActive: true,
    createdAt: "2026-05-02T00:00:00.000Z"
  },
  {
    id: "tpl_weekly_calendar",
    name: "Weekly Content Calendar",
    description: "Seven-day plan that balances education, proof, objection handling, and offer posts.",
    category: "calendar",
    prompt:
      "Map a weekly publishing plan with one clear theme, reel idea, and CTA per day.",
    fields: ["businessName", "product", "offer", "language", "tone"],
    isActive: true,
    createdAt: "2026-05-02T00:00:00.000Z"
  }
];
