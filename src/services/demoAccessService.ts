import { readJson, writeJson } from "@/lib/storage";

const DEMO_ACCESS_KEY = "demoAccessGranted";
const DEMO_ACCESS_CODE_KEY = "demoAccessCode";
const FALLBACK_DEMO_ACCESS_CODE = "KING2026";

export const demoAccessService = {
  getRequiredCode() {
    return process.env.NEXT_PUBLIC_DEMO_ACCESS_CODE ?? FALLBACK_DEMO_ACCESS_CODE;
  },

  hasAccess() {
    return (
      readJson<boolean>(DEMO_ACCESS_KEY, false) === true &&
      readJson<string>(DEMO_ACCESS_CODE_KEY, "") === this.getRequiredCode()
    );
  },

  grantAccess() {
    writeJson(DEMO_ACCESS_KEY, true);
    writeJson(DEMO_ACCESS_CODE_KEY, this.getRequiredCode());
  }
};
