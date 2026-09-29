# The Folio

```bash
npm run dev
```

Then open **http://localhost:3000/**

Stop any previous `npm run dev` with Ctrl+C first. The first compile is bundled up front so the page should appear immediately.

## Vercel

This is a static SPA, not Next.js. The production build writes `dist/index.html`, `dist/app.js`, and `dist/app.css`. Client routes such as `/notebook/...` are rewritten to `index.html`.

```bash
npm run build
```
