import { build } from "esbuild";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { folioPage } from "./folio-page.mjs";

const dist = join(process.cwd(), "dist");

await mkdir(dist, { recursive: true });
await writeFile(join(dist, "index.html"), folioPage);
await writeFile(join(dist, "404.html"), folioPage);

await build({
  entryPoints: ["src/main.tsx"],
  bundle: true,
  outfile: "dist/app.js",
  format: "esm",
  jsx: "automatic",
  alias: { "@": join(process.cwd(), "src") },
  minify: true,
  logLevel: "info",
});
