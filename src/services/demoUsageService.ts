import { readJson, writeJson } from "@/lib/storage";

const DEMO_USAGE_KEY = "demoGenerationsUsed";

export const DEMO_GENERATION_LIMIT = 5;
export const DEMO_LIMIT_REACHED_MESSAGE = "Demo limit reached. Choose a plan to continue.";

export interface DemoUsage {
  used: number;
  limit: number;
  remaining: number;
}

function clampUsage(value: number) {
  return Math.max(0, Math.min(value, DEMO_GENERATION_LIMIT));
}

export const demoUsageService = {
  getUsage(): DemoUsage {
    const used = clampUsage(readJson<number>(DEMO_USAGE_KEY, 0));

    return {
      used,
      limit: DEMO_GENERATION_LIMIT,
      remaining: Math.max(0, DEMO_GENERATION_LIMIT - used)
    };
  },

  assertCanGenerate() {
    const usage = this.getUsage();

    if (usage.used >= usage.limit) {
      throw new Error(DEMO_LIMIT_REACHED_MESSAGE);
    }

    return usage;
  },

  recordGeneration(): DemoUsage {
    const usage = this.assertCanGenerate();
    const used = clampUsage(usage.used + 1);
    writeJson(DEMO_USAGE_KEY, used);
    return this.getUsage();
  }
};
