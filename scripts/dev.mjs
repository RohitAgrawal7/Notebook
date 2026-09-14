import { context } from "esbuild";
import { createServer } from "node:http";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";

const dist = join(process.cwd(), "dist");
const port = Number(process.env.PORT || 3000);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

const page = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>The Folio — Notebook, Diary, Report Files</title>
    <link rel="stylesheet" href="/app.css" />
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              desk: "#1d120d",
              leather: "#2b1810",
              spine: "#22140e",
              paper: "#f4ead6",
              "paper-deep": "#eadcc0",
              ink: "#2a2118",
              "ink-soft": "#5c4e3f",
              "margin-red": "#b55242",
              gold: "#c4a06a",
              manila: "#e6c27a",
              stamp: "#8a2e24",
            },
            fontFamily: {
              serif: ['"Iowan Old Style"', '"Palatino Linotype"', "Palatino", "serif"],
              mono: ["ui-monospace", "SF Mono", "Menlo", "monospace"],
              sans: ["ui-sans-serif", "system-ui", "sans-serif"],
            },
          },
        },
      };
    </script>
  </head>
  <body>
    <div id="root">
      <p style="margin:3rem;font-family:Georgia,serif;color:#f4ead6">Opening the folio…</p>
    </div>
    <script type="module" src="/app.js"></script>
  </body>
</html>
`;

await mkdir(dist, { recursive: true });
await writeFile(join(dist, "index.html"), page);

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
