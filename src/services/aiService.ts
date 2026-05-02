import type { ContentPack, GenerationInput, Tone } from "@/types/saas";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const toneOpeners: Record<Tone, string[]> = {
  Friendly: ["Quick reminder", "Here is the simple win", "Your next easy step"],
  Professional: ["A smarter way to grow", "Built for focused teams", "A practical growth move"],
  Bold: ["Stop posting and hoping", "This is your unfair advantage", "Make the offer impossible to miss"],
  Playful: ["Tiny plot twist", "Your feed called", "Let us make this ridiculously easy"],
  Luxury: ["A more considered way", "Elevate the everyday", "For brands that value polish"]
};

function compact(input: string) {
  return input.trim().replace(/\s+/g, " ");
}

function hashtagBase(value: string) {
  return compact(value)
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1).toLowerCase())
    .join("");
}

export const aiService = {
  async generateContent(input: GenerationInput): Promise<ContentPack> {
    const business = compact(input.businessName) || "Your brand";
    const product = compact(input.product) || "your offer";
    const offer = compact(input.offer) || "a limited-time value";
    const language = input.language;
    const openers = toneOpeners[input.tone];

    await new Promise((resolve) => setTimeout(resolve, 450));

    const captions = [
      `${openers[0]}: ${business} helps you turn interest into action with ${product}. ${offer}.`,
      `If your audience is ready for a better result, introduce them to ${product} today. ${offer} makes the decision easier.`,
      `${business} was built for people who want momentum without the guesswork. Start with ${product} and lead with the result.`,
      `Your next post can do more than fill the feed. Show the problem, reveal ${product}, and close with ${offer}.`,
      `Make it clear, make it useful, make it easy to say yes. That is the ${business} approach to ${product}.`
    ].map((caption) => `${caption} (${language})`);

    const reelsHooks = [
      `${openers[1]} for anyone considering ${product}.`,
      `Three signs your audience is ready for ${business}.`,
      `Before you post again, show this ${product} transformation.`,
      `The fastest way to explain ${offer} in under 10 seconds.`,
      `Nobody talks about this part of selling ${product}.`
    ];

    const brandTag = hashtagBase(business) || "ContentKing";
    const productTag = hashtagBase(product) || "SocialGrowth";
    const hashtags = [
      `#${brandTag}`,
      `#${productTag}`,
      "#ContentMarketing",
      "#SocialMediaTips",
      "#SmallBusinessGrowth",
      "#InstagramMarketing",
      "#TikTokMarketing",
      "#BrandStrategy",
      "#CreatorTools",
      "#MarketingIdeas",
      "#WeeklyContent",
      "#ReelsTips",
      "#CaptionIdeas",
      "#OfferStrategy",
      "#DigitalMarketing",
      "#BusinessOwners",
      "#LaunchPlan",
      "#AudienceGrowth",
      "#ContentCalendar",
      "#SellWithContent"
    ];

    const calendar = days.map((day, index) => {
      const themes = [
        "Problem awareness",
        "Product education",
        "Behind the scenes",
        "Customer proof",
        "Offer spotlight",
        "Objection handling",
        "Community prompt"
      ];

      return {
        day,
        theme: themes[index],
        captionAngle: `${themes[index]} post connecting ${product} to one clear buyer outcome.`,
        reelIdea: `Film a short ${input.tone.toLowerCase()} clip that opens with "${reelsHooks[index % reelsHooks.length]}"`,
        callToAction: index === 4 ? offer : `Invite viewers to learn more from ${business}.`
      };
    });

    return {
      summary: `${business} weekly pack for ${product}, written in a ${input.tone.toLowerCase()} tone and prepared for ${language}.`,
      captions,
      reelsHooks,
      hashtags,
      calendar
    };
  }
};
