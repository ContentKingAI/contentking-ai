export type UserRole = "user" | "admin";

export type SubscriptionStatus =
  | "inactive"
  | "active"
  | "trialing"
  | "past_due"
  | "canceled";

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
  | "captions"
  | "reels"
  | "hashtags"
  | "calendar";

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
  planName: string;
  priceCents: number;
  currency: "usd";
  interval: "year";
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
  prompt: string;
  fields: Array<keyof GenerationInput>;
  isActive: boolean;
  createdAt: string;
}
