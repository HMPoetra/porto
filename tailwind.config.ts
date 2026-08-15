import type { Config } from "tailwindcss";

/**
 * Tailwind v4 mengambil konfigurasi tema langsung dari `@theme` di
 * src/app/globals.css. File ini hanya menyisakan daftar path konten
 * agar tooling/editor tetap mengenali project ini sebagai Tailwind.
 * Semua token Neo Brutalism (warna, hard shadow, font) ada di globals.css.
 */
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [],
};

export default config;
