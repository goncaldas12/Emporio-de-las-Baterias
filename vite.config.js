import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";

// Keep every original HTML entry point and its metadata, including direct links.
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        [
          "index",
          "baterias",
          "buscador",
          "nosotros",
          "contacto",
          "privacidad",
        ].map((page) => [page, resolve(import.meta.dirname, `${page}.html`)]),
      ),
    },
  },
});
