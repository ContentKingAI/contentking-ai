import { readJson, writeJson } from "@/lib/storage";

const DEMO_ACCESS_KEY = "demoAccessGranted";

export const demoAccessService = {
  getRequiredCode() {
    return process.env.NEXT_PUBLIC_DEMO_ACCESS_CODE ?? "";
  },

  hasAccess() {
    return readJson<boolean>(DEMO_ACCESS_KEY, false) === true;
  },

  grantAccess() {
    writeJson(DEMO_ACCESS_KEY, true);
  }
};
