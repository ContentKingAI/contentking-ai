import type { TemplateCategory, TemplateRecord } from "@/types/saas";

export const templateCategories: Array<{
  id: TemplateCategory;
  name: string;
  description: string;
}> = [
  {
    id: "social_media_posts",
    name: "Social Media Posts",
    description: "Polished post ideas for daily publishing."
  },
  {
    id: "reels_tiktok",
    name: "Reels & TikTok",
    description: "Hooks, scripts, and short-form video angles."
  },
  {
    id: "sales_offers",
    name: "Sales & Offers",
    description: "Promotion templates built for conversion."
  },
  {
    id: "weekly_content_plans",
    name: "Weekly Content Plans",
    description: "Structured calendars and idea banks."
  },
  {
    id: "business_niches",
    name: "Business Niches",
    description: "Ready-made packs for specific industries."
  },
  {
    id: "captions",
    name: "Captions",
    description: "Caption frameworks for awareness and sales."
  },
  {
    id: "hashtags",
    name: "Hashtags",
    description: "Discovery-focused hashtag sets."
  }
];

const commonFields: TemplateRecord["fields"] = ["businessName", "product", "offer", "language", "tone"];

export const contentTemplates: TemplateRecord[] = [
  {
    id: "tpl_product_promotion_post",
    name: "Product Promotion Post",
    description: "Turn one product into a benefit-led post with a clear buying CTA.",
    category: "social_media_posts",
    bestFor: "Product launches",
    icon: "package",
    prompt: "Create a product promotion post that highlights benefits, urgency, and a simple CTA.",
    input: {
      businessName: "ContentKing AI",
      product: "signature product",
      offer: "Highlight the biggest benefit and invite customers to buy today",
      language: "English",
      tone: "Bold"
    },
    fields: commonFields,
    isActive: true,
    createdAt: "2026-05-03T00:00:00.000Z"
  },
  {
    id: "tpl_service_promotion_post",
    name: "Service Promotion Post",
    description: "Explain what your service solves and why people should book now.",
    category: "social_media_posts",
    bestFor: "Local services",
    icon: "briefcase",
    prompt: "Create a service promotion post that explains the problem, solution, proof, and booking CTA.",
    input: {
      businessName: "ContentKing AI",
      product: "done-for-you service",
      offer: "Book a consultation this week and get a personalized recommendation",
      language: "English",
      tone: "Professional"
    },
    fields: commonFields,
    isActive: true,
    createdAt: "2026-05-03T00:00:00.000Z"
  },
  {
    id: "tpl_flash_sale_post",
    name: "Flash Sale Post",
    description: "Create urgent sale copy without sounding pushy or generic.",
    category: "sales_offers",
    bestFor: "Limited-time promos",
    icon: "zap",
    prompt: "Create a flash sale post with urgency, value, and a direct CTA.",
    input: {
      businessName: "ContentKing AI",
      product: "limited-time offer",
      offer: "24-hour flash sale with a special discount for fast action",
      language: "English",
      tone: "Bold"
    },
    fields: commonFields,
    isActive: true,
    createdAt: "2026-05-03T00:00:00.000Z"
  },
  {
    id: "tpl_reels_hook_generator",
    name: "Reels Hook Generator",
    description: "Generate scroll-stopping openers for Instagram Reels and TikTok.",
    category: "reels_tiktok",
    bestFor: "Short-form video",
    icon: "video",
    prompt: "Create attention-grabbing video hooks that can be spoken in the first three seconds.",
    input: {
      businessName: "ContentKing AI",
      product: "short-form video topic",
      offer: "Get viewers to stop scrolling and watch the full video",
      language: "English",
      tone: "Playful"
    },
    fields: commonFields,
    isActive: true,
    createdAt: "2026-05-03T00:00:00.000Z"
  },
  {
    id: "tpl_15_second_reel_script",
    name: "15-Second Reel Script",
    description: "Map a tight video script with hook, beats, and call to action.",
    category: "reels_tiktok",
    bestFor: "Video scripts",
    icon: "clapperboard",
    prompt: "Create a 15-second Reel script with a hook, three quick beats, and a CTA.",
    input: {
      businessName: "ContentKing AI",
      product: "educational video topic",
      offer: "Teach one quick tip and invite viewers to take the next step",
      language: "English",
      tone: "Friendly"
    },
    fields: commonFields,
    isActive: true,
    createdAt: "2026-05-03T00:00:00.000Z"
  },
  {
    id: "tpl_7_day_content_calendar",
    name: "7-Day Content Calendar",
    description: "Plan a balanced week of education, proof, engagement, and selling.",
    category: "weekly_content_plans",
    bestFor: "Weekly planning",
    icon: "calendar",
    prompt: "Create a seven-day content calendar with themes, post angles, reel ideas, and CTAs.",
    input: {
      businessName: "ContentKing AI",
      product: "main offer",
      offer: "Build a week of posts that warms up the audience and promotes the offer",
      language: "English",
      tone: "Professional"
    },
    fields: commonFields,
    isActive: true,
    createdAt: "2026-05-03T00:00:00.000Z"
  },
  {
    id: "tpl_30_day_content_ideas",
    name: "30-Day Content Ideas",
    description: "Fill a month of content with varied ideas your audience can act on.",
    category: "weekly_content_plans",
    bestFor: "Monthly planning",
    icon: "calendar-days",
    prompt: "Create 30 content ideas across education, proof, objections, stories, and offers.",
    input: {
      businessName: "ContentKing AI",
      product: "monthly content theme",
      offer: "Create a full month of useful content that leads toward the main offer",
      language: "English",
      tone: "Friendly"
    },
    fields: commonFields,
    isActive: true,
    createdAt: "2026-05-03T00:00:00.000Z"
  },
  {
    id: "tpl_customer_review_post",
    name: "Customer Review Post",
    description: "Turn testimonials into trust-building social proof content.",
    category: "social_media_posts",
    bestFor: "Social proof",
    icon: "message-circle",
    prompt: "Create a customer review post that turns a testimonial into believable proof and a CTA.",
    input: {
      businessName: "ContentKing AI",
      product: "customer success story",
      offer: "Show the result a customer achieved and invite similar customers to reach out",
      language: "English",
      tone: "Professional"
    },
    fields: commonFields,
    isActive: true,
    createdAt: "2026-05-03T00:00:00.000Z"
  },
  {
    id: "tpl_before_after_post",
    name: "Before & After Post",
    description: "Show transformation clearly so customers understand the value.",
    category: "captions",
    bestFor: "Transformations",
    icon: "split",
    prompt: "Create a before-and-after post that frames the problem, transformation, and next step.",
    input: {
      businessName: "ContentKing AI",
      product: "transformation offer",
      offer: "Compare the before state with the after result and invite customers to start",
      language: "English",
      tone: "Bold"
    },
    fields: commonFields,
    isActive: true,
    createdAt: "2026-05-03T00:00:00.000Z"
  },
  {
    id: "tpl_restaurant_content_pack",
    name: "Restaurant Content Pack",
    description: "Promote menu items, specials, customer cravings, and local visits.",
    category: "business_niches",
    bestFor: "Restaurants",
    icon: "utensils",
    prompt: "Create restaurant content that highlights cravings, menu items, specials, and reservations.",
    input: {
      businessName: "ContentKing AI Bistro",
      product: "signature menu item",
      offer: "Visit this week for a limited chef special",
      language: "English",
      tone: "Playful"
    },
    fields: commonFields,
    isActive: true,
    createdAt: "2026-05-03T00:00:00.000Z"
  },
  {
    id: "tpl_real_estate_content_pack",
    name: "Real Estate Content Pack",
    description: "Create listing, buyer education, market update, and lead-gen content.",
    category: "business_niches",
    bestFor: "Real estate",
    icon: "home",
    prompt: "Create real estate content that educates buyers or sellers and invites them to book a call.",
    input: {
      businessName: "ContentKing Realty",
      product: "home buying consultation",
      offer: "Book a local market strategy call",
      language: "English",
      tone: "Professional"
    },
    fields: commonFields,
    isActive: true,
    createdAt: "2026-05-03T00:00:00.000Z"
  },
  {
    id: "tpl_ecommerce_store_content_pack",
    name: "Ecommerce Store Content Pack",
    description: "Generate product, review, bundle, and promo content for online stores.",
    category: "business_niches",
    bestFor: "Ecommerce",
    icon: "shopping-cart",
    prompt: "Create ecommerce content that promotes products, reviews, bundles, and offers.",
    input: {
      businessName: "ContentKing Store",
      product: "bestselling ecommerce product",
      offer: "Shop today and unlock a special online-only deal",
      language: "English",
      tone: "Bold"
    },
    fields: commonFields,
    isActive: true,
    createdAt: "2026-05-03T00:00:00.000Z"
  }
];
