"use client";

import { LeafTools } from "@/components/folio/LeafTools";
import { CategoryChip } from "@/components/ui/CategoryChip";
import { PinToggle } from "@/components/ui/PinToggle";
import { formatLongDate, formatShortDate } from "@/lib/folio";
import { useFolio } from "@/lib/folio-context";
import type { Note } from "@/lib/types";

export function NoteArticle({ note }: { note: Note }) {
  const { isPinned, togglePin } = useFolio();
  const pinned = isPinned(note.id);

  return (
    <section className="relative grid gap-3 py-2 sm:grid-cols-[4.5rem_1fr] sm:gap-6">
      <aside className="flex items-start justify-between gap-3 sm:block">
        <time
          dateTime={note.date}
          className="block font-mono text-[11px] uppercase leading-5 tracking-[0.12em] text-margin-red"
        >
          {formatShortDate(note.date)}
        </time>
        <div className="sm:mt-3">
          <PinToggle
            compact
            pressed={pinned}
            onToggle={() => togglePin(note.id)}
            label={`${pinned ? "Unpin" : "Pin"} ${note.title}`}
          />
        </div>
      </aside>

      <div>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h2 className="font-serif text-[1.65rem] leading-tight tracking-tight text-ink">
            {note.title}
          </h2>
          <CategoryChip as="span" label={note.category} />
        </div>
        <p className="mt-2 max-w-prose font-serif text-[17px] leading-7 text-ink/90">
          {note.summary}
        </p>
        <p className="mt-3 max-w-prose font-serif text-[16.5px] leading-[1.75] text-ink-soft">
          {note.body}
        </p>
        <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft">
          <li>{formatLongDate(note.date)}</li>
          {note.tags.map((tag) => (
            <li key={tag}>#{tag}</li>
          ))}
        </ul>
        <LeafTools section="notebook" id={note.id} title={note.title} />
      </div>
    </section>
  );
}
