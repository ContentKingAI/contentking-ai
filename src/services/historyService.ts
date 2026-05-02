import { createId, readJson, writeJson } from "@/lib/storage";
import type { GenerationInput, GenerationRecord, ContentPack } from "@/types/saas";

const GENERATIONS_KEY = "contentking.generations";

function readGenerations() {
  return readJson<GenerationRecord[]>(GENERATIONS_KEY, []);
}

function writeGenerations(generations: GenerationRecord[]) {
  writeJson(GENERATIONS_KEY, generations);
}

export const historyService = {
  async saveGeneration(userId: string, input: GenerationInput, output: ContentPack) {
    const generation: GenerationRecord = {
      id: createId("gen"),
      userId,
      input,
      output,
      templateId: "tpl_weekly_calendar",
      createdAt: new Date().toISOString()
    };

    writeGenerations([generation, ...readGenerations()]);
    return generation;
  },

  async listGenerations(userId: string) {
    return readGenerations()
      .filter((item) => item.userId === userId)
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  },

  async getGeneration(userId: string, generationId: string) {
    return readGenerations().find((item) => item.userId === userId && item.id === generationId) ?? null;
  },

  async deleteGeneration(userId: string, generationId: string) {
    writeGenerations(
      readGenerations().filter((item) => !(item.userId === userId && item.id === generationId))
    );
  },

  async listAllGenerations() {
    return readGenerations().sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  }
};
