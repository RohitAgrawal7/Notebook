"use client";

import { formatPageLabel } from "@/lib/pagination";
import { useFolio, useSectionMeta } from "@/lib/folio-context";
import { useEffect, type ReactNode } from "react";

type PaperSheetProps = {
  children: ReactNode;
  eyebrow?: string;
  title?: string;
  folio?: string;
  paper?: "ruled" | "plain" | "letter";
  pageLabel?: string;
  sectionLabel?: string;
  leafKey?: string;
  stacked?: boolean;
};

export function PaperSheet({
  children,
  eyebrow,
  title,
  folio,
  paper: paperProp,
  pageLabel,
  sectionLabel,
  leafKey,
  stacked = true,
}: PaperSheetProps) {
  const { page, pageCount, direction, section } = useFolio();
  const meta = useSectionMeta();
  const paper = paperProp ?? meta.paper;

  useEffect(() => {
    document.getElementById("folio-leaf")?.scrollTo({ top: 0, behavior: "smooth" });
  }, [leafKey, page, section]);

  return (
    <div className="relative mx-auto w-full max-w-[760px]" style={{ perspective: "1400px" }}>
      {stacked ? <div className="stack-leaf pointer-events-none absolute inset-0 rounded-[2px]" /> : null}
      <article
        key={leafKey ?? `${section}-${page}`}
        className={`paper-grain paper-shadow relative min-h-[720px] overflow-hidden rounded-[2px] text-ink sm:min-h-[840px] ${
          direction === "next" ? "turn-next" : "turn-prev"
        }`}
      >
        <BindingHoles />
        {paper !== "letter" ? <MarginRule /> : null}

        <div
          className={`relative flex min-h-[720px] flex-col sm:min-h-[840px] ${
            paper === "letter"
              ? "px-7 py-7 sm:px-14 sm:py-10"
              : "pl-14 pr-6 py-7 sm:pl-[5.5rem] sm:pr-12 sm:py-10"
          }`}
        >
          <header
            className={`mb-6 flex items-start justify-between gap-4 pb-4 ${
              paper === "letter" ? "letterhead" : "border-b border-ink/10"
            }`}
          >
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft">
                {eyebrow ?? `The Folio · ${meta.latin}`}
              </p>
              {title ? (
                <h1 className="mt-1 font-serif text-2xl leading-tight tracking-tight text-ink sm:text-[1.85rem]">
                  {title}
                </h1>
              ) : null}
            </div>
            <p className="shrink-0 pt-1 text-right font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">
              {folio ?? "Vol. I · 2026"}
            </p>
          </header>

          <div
            id="folio-leaf"
            className={`folio-scroll flex-1 ${
              paper === "ruled" ? "paper-ruled -mx-1 rounded-sm px-1" : ""
            }`}
          >
            {children}
          </div>

          <footer className="mt-8 flex items-end justify-between border-t border-ink/10 pt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">
            <span>{sectionLabel ?? meta.label}</span>
            <span>{pageLabel ?? formatPageLabel(page, pageCount)}</span>
          </footer>
        </div>
      </article>
    </div>
  );
}

function BindingHoles() {
  return (
    <div
      aria-hidden
      className="absolute top-0 bottom-0 left-0 hidden w-10 flex-col justify-evenly py-16 sm:flex"
    >
      {[0, 1, 2].map((hole) => (
        <span
          key={hole}
          className="mx-auto block h-3.5 w-3.5 rounded-full bg-[radial-gradient(circle_at_35%_30%,#6a5340,#1a120e_70%)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_0_0_3px_rgba(42,33,24,0.08)]"
        />
      ))}
    </div>
  );
}

function MarginRule() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-0 bottom-0 left-10 hidden w-px bg-margin-red/70 sm:block sm:left-[4.4rem]"
    />
  );
}
