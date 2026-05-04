"use client";

import {
  ArrowRight,
  BadgePercent,
  BriefcaseBusiness,
  Calendar,
  CalendarDays,
  Clapperboard,
  Eye,
  Home,
  LayoutTemplate,
  MessageCircle,
  Package,
  PanelsTopLeft,
  ShoppingCart,
  Sparkles,
  Split,
  Utensils,
  Video,
  Zap,
  type LucideIcon
} from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, ButtonLink } from "@/components/ui/Button";
import { contentTemplates, templateCategories } from "@/data/templates";
import { cn } from "@/lib/format";
import { templateService } from "@/services/templateService";

type TemplateGalleryMode = "public" | "dashboard";

const iconMap: Record<string, LucideIcon> = {
  package: Package,
  briefcase: BriefcaseBusiness,
  zap: Zap,
  video: Video,
  clapperboard: Clapperboard,
  calendar: Calendar,
  "calendar-days": CalendarDays,
  "message-circle": MessageCircle,
  split: Split,
  utensils: Utensils,
  home: Home,
  "shopping-cart": ShoppingCart
};

export function TemplateGallery({ mode }: { mode: TemplateGalleryMode }) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const isPublic = mode === "public";

  const visibleTemplates = useMemo(() => {
    if (activeCategory === "all") {
      return contentTemplates;
    }

    return contentTemplates.filter((template) => template.category === activeCategory);
  }, [activeCategory]);

  function handleUseTemplate(templateId: string) {
    templateService.selectTemplate(templateId);

    if (isPublic) {
      router.push(`/pricing?template=${encodeURIComponent(templateId)}`);
      return;
    }

    router.push(`/dashboard/generator?template=${encodeURIComponent(templateId)}`);
  }

  return (
    <div className={cn("space-y-6", isPublic && "brand-page px-4 py-12 sm:px-6 lg:px-8")}>
      <div className={cn(isPublic && "mx-auto max-w-7xl")}>
        <section className="overflow-hidden rounded-lg border border-ink/10 bg-ink text-white shadow-sm">
          <div className="relative p-6 sm:p-8">
            <div className="absolute right-0 top-0 h-48 w-48 translate-x-16 -translate-y-16 rounded-full bg-mint/20 blur-3xl" />
            <div className="absolute bottom-0 left-1/2 h-36 w-72 -translate-x-1/2 translate-y-16 rounded-full bg-coral/20 blur-3xl" />
            <div className="relative grid gap-6 lg:grid-cols-[1fr_0.72fr] lg:items-end">
              <div>
                <p className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-xs font-black uppercase text-mint">
                  {isPublic ? <Eye className="h-4 w-4" /> : <LayoutTemplate className="h-4 w-4" />}
                  {isPublic ? "Public template library" : "Templates"}
                </p>
                <h1 className="mt-5 max-w-3xl text-3xl font-black sm:text-4xl">
                  {isPublic ? "Preview the templates before you choose a plan." : "Start faster with proven content templates."}
                </h1>
                <p className="mt-3 max-w-2xl leading-7 text-white/70">
                  {isPublic
                    ? "Browse the first ContentKing AI templates for posts, reels, offers, calendars, and business niches. Pick one now and keep it ready for the generator after signup."
                    : "Pick a template for your campaign, niche, or content format. ContentKing AI will pre-fill the generator with a focused brief you can edit before generating."}
                </p>
                {isPublic ? (
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <ButtonLink href="/pricing" variant="secondary">
                      Start Creating
                      <ArrowRight className="h-4 w-4" />
                    </ButtonLink>
                    <ButtonLink href="/demo" variant="ghost" className="border border-white/15 bg-white/5 text-white hover:bg-white/10">
                      Try Private Demo
                    </ButtonLink>
                  </div>
                ) : null}
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
                <div className="rounded-lg bg-white/10 p-4">
                  <PanelsTopLeft className="h-5 w-5 text-mint" />
                  <p className="mt-3 text-2xl font-black">{contentTemplates.length}</p>
                  <p className="text-xs font-bold text-white/55">Launch templates</p>
                </div>
                <div className="rounded-lg bg-white/10 p-4">
                  <BadgePercent className="h-5 w-5 text-coral" />
                  <p className="mt-3 text-2xl font-black">{templateCategories.length}</p>
                  <p className="text-xs font-bold text-white/55">Categories</p>
                </div>
                {isPublic ? (
                  <div className="col-span-2 rounded-lg bg-white/10 p-4 sm:col-span-1 lg:col-span-2">
                    <Sparkles className="h-5 w-5 text-honey" />
                    <p className="mt-3 text-2xl font-black">$12+</p>
                    <p className="text-xs font-bold text-white/55">Plans start monthly</p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-lg border border-ink/10 bg-white p-4 shadow-sm">
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              className={cn(
                "shrink-0 rounded-lg px-4 py-2 text-sm font-black transition",
                activeCategory === "all" ? "bg-ink text-white" : "bg-cloud text-ink/70 hover:text-ink"
              )}
              onClick={() => setActiveCategory("all")}
              type="button"
            >
              All Templates
            </button>
            {templateCategories.map((category) => (
              <button
                className={cn(
                  "shrink-0 rounded-lg px-4 py-2 text-sm font-black transition",
                  activeCategory === category.id ? "bg-ink text-white" : "bg-cloud text-ink/70 hover:text-ink"
                )}
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                type="button"
              >
                {category.name}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleTemplates.map((template) => {
            const Icon = iconMap[template.icon] ?? LayoutTemplate;

            return (
              <article
                className="group flex min-h-[22rem] flex-col rounded-lg border border-ink/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-mint/50 hover:shadow-soft"
                key={template.id}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-ink text-white shadow-sm group-hover:bg-mint group-hover:text-ink">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="rounded-full bg-cloud px-3 py-1 text-xs font-black text-ink/65">
                    {template.bestFor}
                  </span>
                </div>

                <div className="mt-5 flex-1">
                  <h2 className="text-xl font-black text-ink">{template.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-ink/65">{template.description}</p>
                </div>

                <div className="mt-5 rounded-lg bg-cloud p-4">
                  <p className="text-xs font-black uppercase text-ink/45">Template brief</p>
                  <div className="mt-3 space-y-2 text-sm leading-6 text-ink/70">
                    <p>
                      <span className="font-black text-ink">Product:</span> {template.input.product}
                    </p>
                    <p>
                      <span className="font-black text-ink">Offer:</span> {template.input.offer}
                    </p>
                    <p>
                      <span className="font-black text-ink">Tone:</span> {template.input.tone}
                    </p>
                  </div>
                </div>

                <Button className="mt-4 w-full" onClick={() => handleUseTemplate(template.id)}>
                  Use Template
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </article>
            );
          })}
        </section>

        {visibleTemplates.length === 0 ? (
          <section className="mt-6 rounded-lg border border-dashed border-ink/15 bg-white p-8 text-center shadow-sm">
            <LayoutTemplate className="mx-auto h-8 w-8 text-ink/35" />
            <h2 className="mt-4 text-xl font-black text-ink">Templates coming soon</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink/60">
              This category is ready for future launch templates. Choose another category to use a template now.
            </p>
          </section>
        ) : null}

        {isPublic ? (
          <section className="mt-6 overflow-hidden rounded-lg border border-ink/10 bg-white p-6 shadow-soft sm:p-8">
            <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-sm font-black uppercase text-coral">Ready to generate?</p>
                <h2 className="mt-2 text-3xl font-black text-ink">Choose a plan, then turn any template into content.</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/65">
                  Your selected template is saved in this browser so the paid generator can open with the brief already prepared.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[24rem]">
                <ButtonLink href="/pricing?plan=monthly" variant="secondary">
                  Start Monthly
                </ButtonLink>
                <ButtonLink href="/pricing?plan=yearly">
                  Start Yearly
                </ButtonLink>
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
