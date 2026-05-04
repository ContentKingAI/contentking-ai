export type UserRole = "user" | "admin";

export type SubscriptionStatus =
  | "inactive"
  | "active"
  | "trialing"
  | "past_due"
  | "canceled";

export type BillingPlanId = "monthly" | "yearly";

export type BillingInterval = "month" | "year";

export type MockSubscriptionStatus = "active" | "inactive";

export type Tone =
  | "Friendly"
  | "Professional"
  | "Bold"
  | "Playful"
  | "Luxury";

export type Language =
  | "English"
  | "Spanish"
  | "French"
  | "German"
  | "Portuguese";

export type TemplateCategory =
  | "social_media_posts"
  | "reels_tiktok"
  | "sales_offers"
  | "weekly_content_plans"
  | "business_niches"
  | "captions"
  | "hashtags";

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  lastLoginAt: string;
}

export interface SubscriptionRecord {
  id: string;
  userId: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  status: SubscriptionStatus;
  subscriptionStatus: MockSubscriptionStatus;
  plan: BillingPlanId;
  planId?: BillingPlanId;
  planName: string;
  price: 12 | 79;
  priceCents: number;
  currency: "usd";
  billingInterval: BillingInterval;
  interval: BillingInterval;
  textGenerationLimit: number;
  textGenerationsUsed: number;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GenerationInput {
  businessName: string;
  product: string;
  offer: string;
  language: Language;
  tone: Tone;
}

export interface CalendarItem {
  day: string;
  theme: string;
  captionAngle: string;
  reelIdea: string;
  callToAction: string;
}

export interface ContentPack {
  summary: string;
  captions: string[];
  reelsHooks: string[];
  hashtags: string[];
  calendar: CalendarItem[];
}

export interface GenerationRecord {
  id: string;
  userId: string;
  input: GenerationInput;
  output: ContentPack;
  templateId?: string;
  createdAt: string;
}

export interface TemplateRecord {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  bestFor: string;
  icon: string;
  prompt: string;
  input: GenerationInput;
  fields: Array<keyof GenerationInput>;
  isActive: boolean;
  createdAt: string;
}
