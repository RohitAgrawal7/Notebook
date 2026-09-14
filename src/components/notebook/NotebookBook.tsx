"use client";

import { LinedBook } from "@/components/folio/LinedBook";
import { NotebookLeafHeader } from "@/components/folio/LinedLeaf";
import { useFolio } from "@/lib/folio-context";
import { hydratePages } from "@/lib/notebook-pages";
import type { Note } from "@/lib/types";

export function NotebookBook({ note }: { note: Note }) {
  const { updateNotePages } = useFolio();
  const pages = hydratePages(note);

  return (
    <LinedBook
      section="notebook"
      bookId={note.id}
      title={note.title}
      pages={pages}
      onPersist={(next) => updateNotePages(note.id, next)}
      editLabel="Edit notebook"
      deleteLabel="Delete notebook"
      header={(leafNumber, pageCount) => (
        <NotebookLeafHeader note={note} leafNumber={leafNumber} pageCount={pageCount} />
      )}
    />
  );
}
