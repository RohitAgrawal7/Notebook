"use client";

import { EmptyCabinet } from "@/components/catalog/EmptyCabinet";
import { BookCover } from "@/components/catalog/LibraryCovers";
import { DeskFrame } from "@/components/layout/DeskFrame";
import { LibraryShelf } from "@/components/layout/LibraryShelf";
import { CategoryChip } from "@/components/ui/CategoryChip";
import { catalogNotes } from "@/lib/catalog";
import { formatShortDate } from "@/lib/folio";
import { useFolio } from "@/lib/folio-context";
import { href } from "@/lib/routes";
import { useRouter } from "@/lib/router";
import { NOTE_CATEGORIES, type NoteCategory } from "@/lib/types";
import { useMemo, useState } from "react";

export function NotebookIndexPage() {
  const { notes, openComposer } = useFolio();
  const { go } = useRouter();
  const [filter, setFilter] = useState<NoteCategory | "All">("All");
  const books = useMemo(() => {
    const list = catalogNotes(notes);
    return filter === "All" ? list : list.filter((note) => note.category === filter);
  }, [filter, notes]);

  return (
    <DeskFrame
      kicker="Adversaria"
      title="Notebook"
      deck="Every titled book in the notebook cabinet. The subject on the cover is the working stamp: research, design, field, or reference. Open a title to read the leaf."
    >
      <LibraryShelf
        section="notebook"
        latin="Adversaria"
        title="The books"
        count={`${books.length} titled ${books.length === 1 ? "book" : "books"}`}
        onAdd={() => openComposer("notebook", "create")}
      >
        <div className="mb-5 flex flex-wrap gap-2">
          <CategoryChip label="All" active={filter === "All"} onClick={() => setFilter("All")} />
          {NOTE_CATEGORIES.map((item) => (
            <CategoryChip
              key={item}
              label={item}
              active={filter === item}
              onClick={() => setFilter(item)}
            />
          ))}
        </div>
        {books.length === 0 ? (
          <EmptyCabinet label="No notebooks in this drawer yet." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {books.map((note) => (
              <BookCover
                key={note.id}
                title={note.title}
                subject={note.category}
                category={note.category}
                date={formatShortDate(note.date)}
                onOpen={() => go(href.notebook(note.id))}
              />
            ))}
          </div>
        )}
      </LibraryShelf>
    </DeskFrame>
  );
}
