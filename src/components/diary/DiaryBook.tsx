"use client";

import { LinedBook } from "@/components/folio/LinedBook";
import { DiaryLeafHeader } from "@/components/folio/LinedLeaf";
import { formatLongDate } from "@/lib/folio";
import { useFolio } from "@/lib/folio-context";
import { hydrateDiaryPages } from "@/lib/notebook-pages";
import type { DiaryEntry } from "@/lib/types";

export function DiaryBook({ entry }: { entry: DiaryEntry }) {
  const { updateDiaryPages } = useFolio();
  const pages = hydrateDiaryPages(entry);

  return (
    <LinedBook
      section="diary"
      bookId={entry.id}
      title={entry.title}
      pages={pages}
      paper="plain"
      onPersist={(next) => updateDiaryPages(entry.id, next)}
      editLabel="Edit diary"
      deleteLabel="Delete diary"
      header={(leafNumber, pageCount) => (
        <DiaryLeafHeader entry={entry} leafNumber={leafNumber} pageCount={pageCount} />
      )}
      closing={
        <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">
          {formatLongDate(entry.date)} · {entry.place}
        </p>
      }
    />
  );
}
