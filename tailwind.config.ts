import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#18201f",
        cloud: "#f6f8f7",
        mint: "#37c6ab",
        coral: "#ff6f61",
        honey: "#f5b642"
      },
      boxShadow: {
        soft: "0 20px 70px rgba(24, 32, 31, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
