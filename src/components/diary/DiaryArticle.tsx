"use client";

import { LeafTools } from "@/components/folio/LeafTools";
import { PinToggle } from "@/components/ui/PinToggle";
import { formatLongDate } from "@/lib/folio";
import { useFolio } from "@/lib/folio-context";
import type { DiaryEntry } from "@/lib/types";

export function DiaryArticle({ entry }: { entry: DiaryEntry }) {
  const { isPinned, togglePin } = useFolio();
  const pinned = isPinned(entry.id);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-margin-red">
            {entry.mood}
          </p>
          <h2 className="mt-1 font-serif text-3xl tracking-tight text-ink">{entry.title}</h2>
        </div>
        <PinToggle
          pressed={pinned}
          onToggle={() => togglePin(entry.id)}
          label={`${pinned ? "Unpin" : "Pin"} diary entry ${entry.title}`}
        />
      </div>

      <div className="max-w-prose space-y-5">
        {entry.body.map((paragraph, index) => (
          <p
            key={paragraph}
            className={`font-serif text-[17.5px] leading-[1.85] text-ink ${
              index === 0 ? "drop-cap" : ""
            }`}
          >
            {paragraph}
          </p>
        ))}
      </div>

      <LeafTools section="diary" id={entry.id} title={entry.title} />

      <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">
        {formatLongDate(entry.date)} · {entry.place}
      </p>
    </div>
  );
}
