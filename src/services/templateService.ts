import { contentTemplates } from "@/data/templates";
import { readJson, removeStorage, writeJson } from "@/lib/storage";

const SELECTED_TEMPLATE_KEY = "contentking.selectedTemplateId";

export const templateService = {
  selectTemplate(templateId: string) {
    writeJson(SELECTED_TEMPLATE_KEY, templateId);
  },

  getSelectedTemplate() {
    const templateId = readJson<string | null>(SELECTED_TEMPLATE_KEY, null);

    if (!templateId) {
      return null;
    }

    return contentTemplates.find((template) => template.id === templateId) ?? null;
  },

  clearSelectedTemplate() {
    removeStorage(SELECTED_TEMPLATE_KEY);
  }
};
