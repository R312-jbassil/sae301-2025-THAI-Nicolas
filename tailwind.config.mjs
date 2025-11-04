/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        // Couleurs TaVue
        vert: "#589772",
        "vert-light": "#F0F7F4",
        noir: "#1A1A1A",
        gris: "#4A5A54",
        "gris-dark": "#6B6B6B",
      },
      fontFamily: {
        nunito: ['"Nunito Sans"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
