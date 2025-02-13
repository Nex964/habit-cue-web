import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "media",
  theme: {
    
    fontFamily: {
      sans: ['"Plus Jakarta Sans"', 'sans-serif']
    },
    extend: {},
  },
  plugins: [],
} satisfies Config;
