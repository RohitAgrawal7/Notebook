"use client";

import { useFolio, useSectionMeta } from "@/lib/folio-context";

export function PageControls() {
  const { page, pageCount, goNext, goPrev, goToPage } = useFolio();
  const meta = useSectionMeta();

  return (
    <nav
      aria-label="Page turn"
      className="mt-6 flex items-center justify-between gap-3 text-[#f3e6cf]"
    >
      <button
        type="button"
        onClick={goPrev}
        disabled={page <= 1}
        className="rounded-sm border border-gold/25 bg-leather/80 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition enabled:hover:border-gold/55 enabled:hover:bg-leather disabled:opacity-35"
      >
        ◀ Previous
      </button>

      <div className="flex min-w-0 flex-col items-center gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-gold/70">
          {meta.label} · {page} / {pageCount}
        </p>
        <div className="hidden items-center gap-1.5 sm:flex">
          {Array.from({ length: pageCount }, (_, index) => {
            const leaf = index + 1;
            const active = leaf === page;
            return (
              <button
                key={leaf}
                type="button"
                onClick={() => goToPage(leaf)}
                aria-label={`${meta.label} leaf ${leaf}`}
                aria-current={active ? "page" : undefined}
                className={`h-2.5 rounded-full transition ${
                  active ? "w-6 bg-gold" : "w-2.5 bg-gold/30 hover:bg-gold/55"
                }`}
              />
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={goNext}
        disabled={page >= pageCount}
        className="rounded-sm border border-gold/25 bg-leather/80 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition enabled:hover:border-gold/55 enabled:hover:bg-leather disabled:opacity-35"
      >
        Next ▶
      </button>
    </nav>
  );
}
