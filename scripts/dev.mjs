import { context } from "esbuild";
import { createServer } from "node:http";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { folioPage } from "./folio-page.mjs";

const dist = join(process.cwd(), "dist");
const port = Number(process.env.PORT || 3000);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

await mkdir(dist, { recursive: true });
await writeFile(join(dist, "index.html"), folioPage);

const ctx = await context({
  entryPoints: ["src/main.tsx"],
  bundle: true,
  outfile: "dist/app.js",
  format: "esm",
  jsx: "automatic",
  alias: { "@": join(process.cwd(), "src") },
  logLevel: "silent",
});

await ctx.rebuild();
await ctx.watch();

const server = createServer(async (req, res) => {
  const url = new URL(req.url || "/", "http://localhost");
  const file = url.pathname === "/" ? "index.html" : url.pathname.slice(1);
  const kind = extname(file) || ".html";
  try {
    const body = await readFile(join(dist, file));
    res.writeHead(200, {
      "content-type": types[kind] || "application/octet-stream",
      "cache-control": "no-store",
    });
    res.end(body);
  } catch {
    const body = await readFile(join(dist, "index.html"));
    res.writeHead(200, {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    });
    res.end(body);
  }
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${port} is busy. Stop the other npm run dev, then try again.`);
    process.exit(1);
  }
  throw error;
});

server.listen(port, "0.0.0.0", () => {
  console.log("");
  console.log("The Folio is ready");
  console.log(`  http://localhost:${port}/`);
  console.log(`  http://127.0.0.1:${port}/`);
  console.log("");
});
