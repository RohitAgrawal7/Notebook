"use client";

import { DiaryArticle } from "@/components/diary/DiaryArticle";
import { PaperSheet } from "@/components/folio/PaperSheet";
import { useFolio } from "@/lib/folio-context";

export function DiaryView() {
  const { leaf, page, pageCount } = useFolio();
  if (leaf.kind !== "entry") return null;

  const { entry } = leaf;

  return (
    <PaperSheet
      paper="plain"
      eyebrow={`${entry.weekday} · ${entry.place}`}
      title={entry.title}
      folio="Diarium"
    >
      {entry.id.startsWith("empty-") ? (
        <p className="font-serif text-lg text-ink-soft">{entry.body[0]}</p>
      ) : (
        <DiaryArticle entry={entry} />
      )}
      <div className="mt-12 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">
        <span>
          Day {page} of {pageCount}
        </span>
        <span>{page < pageCount ? "The next morning →" : "The diary is current."}</span>
      </div>
    </PaperSheet>
  );
}
