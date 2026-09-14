"use client";

import { MissingLeaf } from "@/components/folio/MissingLeaf";
import { DeskFrame } from "@/components/layout/DeskFrame";
import { ReadingDesk } from "@/components/layout/ReadingDesk";
import { NotebookBook } from "@/components/notebook/NotebookBook";
import { useFolio } from "@/lib/folio-context";
import { href } from "@/lib/routes";
import { useMemo } from "react";

export function NotebookReaderPage({ id }: { id: string }) {
  const { notes } = useFolio();
  const item = useMemo(() => notes.find((note) => note.id === id), [id, notes]);

  return (
    <DeskFrame kicker="Adversaria" title="Notebook">
      <ReadingDesk
        section="notebook"
        currentId={item?.id}
        indexHref={href.notebooks}
        indexLabel="All notebooks"
        hideSpine
      >
        {item ? (
          <NotebookBook note={item} />
        ) : (
          <MissingLeaf backHref={href.notebooks} backLabel="Return to notebooks" kind="notebook" />
        )}
      </ReadingDesk>
    </DeskFrame>
  );
}
