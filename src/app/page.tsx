import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Check,
  Clock,
  Crown,
  Dumbbell,
  GraduationCap,
  Home,
  LockKeyhole,
  MessageSquareText,
  PlayCircle,
  Quote,
  Scissors,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  Utensils,
  Video,
  WandSparkles,
  Wrench,
  X
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

type IconCard = {
  icon: LucideIcon;
  title: string;
  text?: string;
};

const problems: IconCard[] = [
  {
    icon: MessageSquareText,
    title: "No content ideas",
    text: "You sit there wondering what to post."
  },
  {
    icon: Clock,
    title: "No time",
    text: "You're busy running your business."
  },
  {
    icon: WandSparkles,
    title: "No consistency",
    text: "You post randomly and lose attention."
  }
];

const features: IconCard[] = [
  {
    icon: MessageSquareText,
    title: "Captions",
    text: "Generate sales-focused captions instantly."
  },
  {
    icon: Video,
    title: "Reels Hooks",
    text: "Get scroll-stopping video ideas."
  },
  {
    icon: Sparkles,
    title: "Hashtags",
    text: "Find relevant hashtags that boost reach."
  },
  {
    icon: CalendarDays,
    title: "7-Day Calendar",
    text: "Get a complete content plan for the week."
  }
];

const beforeItems = [
  '"What should I post today?"',
  "Random captions",
  "Inconsistent posting",
  "Wasted time",
  "Low engagement"
];

const afterItems = [
  "30 content ideas ready",
  "Sales-focused captions",
  "Consistent posting",
  "Content in minutes",
  "Higher engagement"
];

const audiences: IconCard[] = [
  { icon: ShoppingCart, title: "Online Stores" },
  { icon: Utensils, title: "Restaurants" },
  { icon: Home, title: "Real Estate" },
  { icon: Scissors, title: "Salons" },
  { icon: Dumbbell, title: "Gyms" },
  { icon: Wrench, title: "Local Services" },
  { icon: GraduationCap, title: "Coaches" },
  { icon: Video, title: "Creators" }
];

const pricingFeatures = [
  "Unlimited content generation",
  "Captions",
  "Reels hooks",
  "Hashtags",
  "7-day content calendars",
  "Saved history",
  "Business-friendly templates",
  "Priority support"
];

const guarantees: Array<{
  icon: LucideIcon;
  text: string;
}> = [
  { icon: Star, text: "7-Day Money Back Guarantee" },
  { icon: LockKeyhole, text: "Cancel Anytime" },
  { icon: ShieldCheck, text: "Your Data is 100% Secure" }
];

function SectionLabel({ number, label, light = false }: { number: number; label: string; light?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#8d55ff] to-[#4d6dff] text-base font-black text-white shadow-lg shadow-[#704dff]/30">
        {number}
      </span>
      <span className={`text-xs font-black uppercase tracking-normal ${light ? "text-white" : "text-[#6f42f5]"}`}>
        {label}
      </span>
    </div>
  );
}

function PurpleButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#6d3cff] to-[#a23cff] px-5 py-3 text-sm font-black text-white shadow-lg shadow-[#6d3cff]/25 transition hover:translate-y-[-1px] hover:shadow-[#6d3cff]/35"
      href={href}
    >
      {children}
    </Link>
  );
}

function OutlineButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-5 py-3 text-sm font-black text-white transition hover:bg-white/10"
      href={href}
    >
      {children}
    </Link>
  );
}

function DashboardPreview() {
  const stats = [
    ["120", "Content Generated"],
    ["24+", "Hours Saved"],
    ["90", "Posts Ready"],
    ["+48%", "Engagement"]
  ];

  const calendarDots = [3, 7, 12, 14, 18, 23, 26, 29];

  return (
    <div className="rounded-lg border border-white/15 bg-[#0a1224]/80 p-3 shadow-2xl shadow-[#1c35ff]/25 backdrop-blur">
      <div className="overflow-hidden rounded-lg border border-white/10 bg-[#070d1a]">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
          <div className="flex items-center gap-2 text-sm font-black text-white">
            <Crown className="h-4 w-4 text-[#a855ff]" />
            ContentKing <span className="rounded bg-[#8b3dff] px-1 text-[10px]">AI</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-lg bg-[#6d3cff] px-3 py-2 text-xs font-black text-white">+ Generate New</span>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#8ff8df] to-[#6d3cff]" />
          </div>
        </div>
        <div className="grid md:grid-cols-[150px_1fr]">
          <aside className="hidden border-r border-white/10 bg-white/[0.03] p-4 md:block">
            {["Dashboard", "Generate", "History", "Calendar", "Templates", "Brand Voice", "Billing", "Settings"].map((item, index) => (
              <div
                className={`mb-2 rounded-lg px-3 py-2 text-xs font-bold ${index === 0 ? "bg-[#6d3cff] text-white" : "text-white/55"}`}
                key={item}
              >
                {item}
              </div>
            ))}
          </aside>
          <main className="p-4">
            <h3 className="text-lg font-black text-white">Dashboard</h3>
            <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {stats.map(([value, label]) => (
                <div className="rounded-lg bg-white/[0.04] p-3" key={label}>
                  <p className="text-xs font-semibold text-white/45">{label}</p>
                  <p className="mt-2 text-2xl font-black text-white">{value}</p>
                  <p className="text-[11px] font-bold text-white/40">This Month</p>
                </div>
              ))}
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
              <div className="rounded-lg bg-white/[0.04] p-4">
                <p className="text-xs font-black uppercase text-white/60">Recent Content</p>
                {["Your brand has a story. Let's help the world hear it.", "Stop scrolling if you want more customers in 30 days.", "#SmallBusiness #Growth #MarketingTips"].map((item, index) => (
                  <div className="mt-3 rounded-lg bg-[#070d1a] p-3" key={item}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-xs font-black text-white">{["Caption", "Reels Hook", "Hashtags"][index]}</span>
                      <span className="rounded bg-[#a23cff]/20 px-2 py-1 text-[10px] font-bold text-[#e4c7ff]">{["Instagram", "Reels", "Hashtags"][index]}</span>
                    </div>
                    <p className="text-xs leading-5 text-white/60">{item}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-lg bg-white/[0.04] p-4">
                <p className="text-xs font-black uppercase text-white/60">Content Calendar</p>
                <div className="mt-3 grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-white/40">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                    <span key={day}>{day}</span>
                  ))}
                </div>
                <div className="mt-3 grid grid-cols-7 gap-2">
                  {Array.from({ length: 35 }, (_, index) => (
                    <div
                      className={`flex aspect-square items-center justify-center rounded text-[10px] font-bold ${calendarDots.includes(index) ? "bg-[#6d3cff] text-white" : "bg-white/[0.04] text-white/35"}`}
                      key={index}
                    >
                      {index + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-[#050b17] text-white">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_10%,rgba(34,88,255,0.55),transparent_29rem),radial-gradient(circle_at_61%_8%,rgba(156,40,255,0.35),transparent_23rem),linear-gradient(135deg,#050b17_0%,#07111f_58%,#031027_100%)]" />
        <div className="absolute inset-0 -z-10 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:52px_52px]" />
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <SectionLabel number={1} label="Hero Section" light />
          <div className="grid gap-10 py-12 lg:grid-cols-[0.72fr_1fr] lg:items-center lg:py-16">
            <div>
              <div className="mb-10 flex items-center justify-center gap-2 text-lg font-black sm:justify-start">
                <Crown className="h-5 w-5 text-[#a855ff]" />
                ContentKing <span className="rounded bg-[#8b3dff] px-1.5 py-0.5 text-xs">AI</span>
              </div>
              <span className="inline-flex rounded-full border border-[#6d3cff]/40 bg-[#6d3cff]/10 px-4 py-2 text-xs font-black uppercase text-[#a98cff]">
                AI-powered content creation
              </span>
              <h1 className="mt-5 max-w-2xl text-5xl font-black leading-none tracking-normal sm:text-6xl">
                Create 30 Days of Social Media Content <span className="bg-gradient-to-r from-[#a855ff] to-[#4d6dff] bg-clip-text text-transparent">in 5 Minutes</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-white/75">
                ContentKing AI helps small businesses generate captions, reels hooks, hashtags, and weekly content calendars instantly.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <PurpleButton href="/signup">
                  Start for $67/year
                  <ArrowRight className="h-4 w-4" />
                </PurpleButton>
                <OutlineButton href="/dashboard">
                  See Demo
                  <PlayCircle className="h-4 w-4" />
                </OutlineButton>
              </div>
              <div className="mt-7 grid gap-3 text-xs font-bold text-white/70 sm:grid-cols-3">
                {["7-Day Money Back Guarantee", "Cancel Anytime", "Secure Payments"].map((item) => (
                  <div className="flex items-center gap-2" key={item}>
                    <ShieldCheck className="h-4 w-4 text-[#8a6bff]" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <DashboardPreview />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#f8faff] px-4 py-5 sm:px-6 lg:px-8">
        <div className="absolute right-14 top-24 h-28 w-28 opacity-40 [background-image:radial-gradient(#6d3cff_1px,transparent_1px)] [background-size:14px_14px]" />
        <div className="mx-auto max-w-7xl">
          <SectionLabel number={2} label="Problem Section" />
          <div className="py-10 text-center">
            <h2 className="text-3xl font-black leading-tight text-[#07111f] sm:text-4xl">
              Posting every day <br className="hidden sm:block" />
              should not feel like a <span className="text-[#7a3cff]">full-time job.</span>
            </h2>
            <div className="mx-auto mt-8 grid max-w-4xl gap-5 md:grid-cols-3">
              {problems.map((item, index) => (
                <article className="rounded-lg border border-[#dde4f3] bg-white p-6 text-left shadow-lg shadow-[#141b34]/5" key={item.title}>
                  <span className={`flex h-12 w-12 items-center justify-center rounded-full text-white ${index === 0 ? "bg-[#6d58ff]" : index === 1 ? "bg-[#ec4d8b]" : "bg-[#f59a2f]"}`}>
                    <item.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-6 text-lg font-black text-[#07111f]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#1f2b40]">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#050b17] px-4 py-5 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionLabel number={3} label="Solution / Features" light />
          <div className="py-9">
            <h2 className="text-center text-3xl font-black">
              ContentKing AI does the <span className="text-[#a855ff]">hard part</span> for you.
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {features.map((item, index) => (
                <article className="rounded-lg border border-white/10 bg-white/[0.04] p-6 shadow-lg shadow-black/20" key={item.title}>
                  <span className={`flex h-12 w-12 items-center justify-center rounded-full text-white ${["bg-[#214cd8]", "bg-[#d72d75]", "bg-[#16804d]", "bg-[#3553df]"][index]}`}>
                    <item.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 text-lg font-black">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/70">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f8faff] px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionLabel number={4} label="Before / After Comparison" />
          <div className="grid gap-6 py-10 md:grid-cols-[1fr_auto_1fr] md:items-center">
            <article className="mx-auto w-full max-w-sm rounded-lg border border-[#eadbe4] bg-white p-6 shadow-lg shadow-[#141b34]/5">
              <p className="mx-auto mb-5 w-fit rounded-full bg-[#ffeaf1] px-4 py-2 text-xs font-black uppercase text-[#d72d75]">
                Before ContentKing AI
              </p>
              <div className="space-y-4">
                {beforeItems.map((item) => (
                  <div className="flex items-center gap-3 text-sm font-semibold text-[#07111f]" key={item}>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ffe1eb] text-[#df326f]">
                      <X className="h-4 w-4" />
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </article>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#a855ff] to-[#265dff] text-xl font-black text-white shadow-lg shadow-[#6d3cff]/30">
              VS
            </div>
            <article className="mx-auto w-full max-w-sm rounded-lg border border-[#d7ecd9] bg-white p-6 shadow-lg shadow-[#141b34]/5">
              <p className="mx-auto mb-5 w-fit rounded-full bg-[#e7ffef] px-4 py-2 text-xs font-black uppercase text-[#1eaa5d]">
                After ContentKing AI
              </p>
              <div className="space-y-4">
                {afterItems.map((item) => (
                  <div className="flex items-center gap-3 text-sm font-semibold text-[#07111f]" key={item}>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#dfffee] text-[#1eaa5d]">
                      <Check className="h-4 w-4" />
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionLabel number={5} label="Demo Output Preview" />
          <div className="py-10">
            <h2 className="text-center text-3xl font-black text-[#07111f]">
              See what it <span className="text-[#6d3cff]">creates.</span>
            </h2>
            <div className="mx-auto mt-8 grid max-w-5xl gap-4 md:grid-cols-4">
              <article className="rounded-lg border border-[#dde4f3] bg-white p-5 shadow-lg shadow-[#141b34]/5">
                <Quote className="h-6 w-6 text-[#6d3cff]" />
                <h3 className="mt-3 text-sm font-black text-[#6d3cff]">Caption</h3>
                <p className="mt-4 text-sm leading-7 text-[#07111f]">Turn your offer into a best-selling post. Make your customers say YES!</p>
              </article>
              <article className="rounded-lg border border-[#f0dfe7] bg-white p-5 shadow-lg shadow-[#141b34]/5">
                <CalendarDays className="h-6 w-6 text-[#e64d87]" />
                <h3 className="mt-3 text-sm font-black text-[#07111f]">Reels Hook</h3>
                <p className="mt-4 text-sm leading-7 text-[#07111f]">Stop scrolling if you own a small business... This is for you.</p>
              </article>
              <article className="rounded-lg border border-[#d7ecd9] bg-white p-5 shadow-lg shadow-[#141b34]/5">
                <Sparkles className="h-6 w-6 text-[#1eaa5d]" />
                <h3 className="mt-3 text-sm font-black text-[#1e8f4f]">Hashtags</h3>
                <div className="mt-4 space-y-1 text-sm font-semibold text-[#07111f]">
                  {["#SmallBusiness", "#MarketingAI", "#ContentCreation", "#BusinessGrowth", "#EntrepreneurLife"].map((tag) => (
                    <p key={tag}>{tag}</p>
                  ))}
                </div>
              </article>
              <article className="rounded-lg border border-[#dbe5fb] bg-white p-5 shadow-lg shadow-[#141b34]/5">
                <CalendarDays className="h-6 w-6 text-[#3775e8]" />
                <h3 className="mt-3 text-sm font-black text-[#2869d8]">Weekly Plan</h3>
                <div className="mt-4 space-y-1 text-sm text-[#07111f]">
                  {[
                    ["Mon", "Product post"],
                    ["Tue", "Customer story"],
                    ["Wed", "Tips & Value"],
                    ["Thu", "Behind the scenes"],
                    ["Fri", "Offer / Promotion"],
                    ["Sat", "Testimonial"],
                    ["Sun", "Engagement post"]
                  ].map(([day, text]) => (
                    <div className="grid grid-cols-[2.4rem_1fr] gap-2" key={day}>
                      <strong>{day}</strong>
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f8faff] px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionLabel number={6} label="Who It's For" />
          <div className="py-10">
            <h2 className="text-center text-3xl font-black text-[#07111f]">
              Built for busy <span className="text-[#6d3cff]">business owners.</span>
            </h2>
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-8">
              {audiences.map((item) => (
                <article className="rounded-lg border border-[#dde4f3] bg-white p-4 text-center shadow-lg shadow-[#141b34]/5" key={item.title}>
                  <item.icon className="mx-auto h-8 w-8 text-[#6d3cff]" />
                  <h3 className="mt-4 text-xs font-black text-[#07111f]">{item.title}</h3>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#050b17] px-4 py-5 text-white sm:px-6 lg:px-8">
        <div className="absolute bottom-0 right-0 h-56 w-56 translate-x-20 translate-y-16 rotate-12 rounded-lg bg-[#17213b] opacity-45" />
        <div className="mx-auto max-w-7xl">
          <SectionLabel number={7} label="Pricing Section" light />
          <div className="grid gap-5 py-10 lg:grid-cols-[0.78fr_1.22fr]">
            <article className="rounded-lg border border-white/10 bg-white/[0.04] p-7 text-center shadow-lg shadow-black/20">
              <p className="text-sm text-white/80">Simple pricing. No confusion.</p>
              <div className="mt-4 text-6xl font-black">$67<span className="text-3xl">/year</span></div>
              <p className="mt-2 text-sm text-white/70">Just $5.58/month</p>
              <PurpleButton href="/signup">
                Get ContentKing AI for $67/year
                <ArrowRight className="h-4 w-4" />
              </PurpleButton>
              <p className="mt-4 text-xs text-white/60">Cancel anytime before renewal.</p>
            </article>
            <article className="rounded-lg border border-white/10 bg-white/[0.04] p-7 shadow-lg shadow-black/20">
              <div className="grid gap-4 md:grid-cols-2">
                {pricingFeatures.map((item) => (
                  <div className="flex items-center gap-3 text-sm font-semibold text-white/85" key={item}>
                    <BadgeCheck className="h-5 w-5 text-[#8a6bff]" />
                    {item}
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionLabel number={8} label="Trust / Guarantee Section" />
          <div className="grid gap-8 py-10 md:grid-cols-[1fr_1.1fr] md:items-center">
            <div className="grid gap-6 sm:grid-cols-[130px_1fr] sm:items-center">
              <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-[2rem] bg-gradient-to-br from-[#7c3cff] to-[#4f2bbd] text-white shadow-2xl shadow-[#6d3cff]/35">
                <Check className="h-16 w-16" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-[#07111f]">Try it risk-free.</h2>
                <p className="mt-3 max-w-lg leading-7 text-[#1f2b40]">
                  If ContentKing AI does not save you time creating content, cancel anytime before your renewal. No questions asked.
                </p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {guarantees.map(({ icon: Icon, text }) => (
                <article className="rounded-lg bg-white p-5 text-center shadow-lg shadow-[#141b34]/10" key={text}>
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#dde4f3] bg-white text-[#4d6dff] shadow-sm">
                    <Icon className="h-7 w-7" />
                  </span>
                  <h3 className="mt-4 text-sm font-black text-[#07111f]">{text}</h3>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#050b17] px-4 py-5 text-white sm:px-6 lg:px-8">
        <div className="absolute inset-y-0 right-0 w-2/3 bg-[radial-gradient(circle_at_74%_30%,rgba(126,40,255,0.7),transparent_27rem)]" />
        <div className="relative mx-auto max-w-7xl">
          <SectionLabel number={9} label="Final CTA Section" light />
          <div className="grid gap-8 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="flex gap-6">
              <div className="hidden h-24 w-24 shrink-0 items-center justify-center rounded-lg bg-[#6d3cff]/25 text-[#b58cff] sm:flex">
                <Crown className="h-14 w-14" />
              </div>
              <div>
                <h2 className="max-w-xl text-4xl font-black leading-tight">
                  Your next 30 posts are <span className="text-[#7c5cff]">waiting.</span>
                </h2>
                <p className="mt-3 text-white/75">Stop wasting time. Start posting with confidence.</p>
              </div>
            </div>
            <div>
              <PurpleButton href="/signup">
                Start Creating Content Today
                <ArrowRight className="h-4 w-4" />
              </PurpleButton>
              <div className="mt-5 grid gap-2 text-xs font-bold text-white/65 sm:grid-cols-3">
                {["7-Day Money Back Guarantee", "Cancel Anytime", "Secure Payments"].map((item) => (
                  <span className="flex items-center gap-2" key={item}>
                    <Check className="h-3.5 w-3.5 text-[#8a6bff]" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
