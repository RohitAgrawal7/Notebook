import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  esbuild: {
    jsx: "automatic",
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 3000,
    host: "127.0.0.1",
    strictPort: false,
  },
});
