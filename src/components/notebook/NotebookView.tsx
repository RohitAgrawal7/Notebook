"use client";

import { NoteArticle } from "@/components/notebook/NoteArticle";
import { PaperSheet } from "@/components/folio/PaperSheet";
import { CategoryChip } from "@/components/ui/CategoryChip";
import { useFolio } from "@/lib/folio-context";
import { NOTE_CATEGORIES } from "@/lib/types";

export function NotebookView() {
  const { leaf, category, setCategory, filteredNotes, page, pageCount } = useFolio();

  if (leaf.kind !== "notes") return null;

  const rangeStart = filteredNotes.length === 0 ? 0 : (page - 1) * 2 + 1;
  const rangeEnd = Math.min(page * 2, filteredNotes.length);

  return (
    <PaperSheet
      paper="ruled"
      eyebrow="Notebook · Adversaria"
      title="Working leaves"
      folio={`${filteredNotes.length} notes`}
    >
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <CategoryChip
          label="All"
          active={category === "All"}
          onClick={() => setCategory("All")}
        />
        {NOTE_CATEGORIES.map((item) => (
          <CategoryChip
            key={item}
            label={item}
            active={category === item}
            onClick={() => setCategory(item)}
          />
        ))}
        <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">
          Showing {rangeStart}–{rangeEnd}
        </span>
      </div>

      {leaf.notes.length === 0 ? (
        <p className="py-16 font-serif text-lg text-ink-soft">
          No notes in this drawer. Choose another category stamp.
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-ink/10">
          {leaf.notes.map((note) => (
            <div key={note.id} className="py-6">
              <NoteArticle note={note} />
            </div>
          ))}
        </div>
      )}

      <p className="mt-8 font-serif text-sm italic text-ink-soft">
        {page < pageCount
          ? "Continue on the next leaf →"
          : "End of the notebook register."}
      </p>
    </PaperSheet>
  );
}
