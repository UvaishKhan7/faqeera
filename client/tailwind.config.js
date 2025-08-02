/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // ... a lot of color definitions here
    },
  },
  animation: {
    'accordion-down': 'accordion-down 0.3s ease-out',
    'accordion-up': 'accordion-up 0.3s ease-out',
  },
  keyframes: {
    'accordion-down': {
      from: { height: 0 },
      to: { height: 'var(--radix-collapsible-content-height)' },
    },
    'accordion-up': {
      from: { height: 'var(--radix-collapsible-content-height)' },
      to: { height: 0 },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
  ],
}