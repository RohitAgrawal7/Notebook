"use client";

import { InkToolbar } from "@/components/folio/InkToolbar";
import { useFolio } from "@/lib/folio-context";
import { hydratePages } from "@/lib/notebook-pages";
import type { SectionId } from "@/lib/types";

const SECTION_ADD: Record<SectionId, string> = {
  notebook: "+ Notebook",
  diary: "+ Diary",
  reports: "+ Report",
};

export function RegisterBar({
  sectionHint,
  currentId,
}: {
  sectionHint?: SectionId;
  currentId?: string;
} = {}) {
  const {
    section,
    openComposer,
    selectOnly,
    clearSelection,
    selected,
    setPdfOpen,
    activeLeafId,
    notes,
    updateNotePages,
  } = useFolio();
  const count = selected.size;
  const leafId = activeLeafId ?? currentId;
  const createSection = sectionHint ?? section;
  const showInk = createSection === "notebook" && Boolean(leafId);
  const activePage = notes
    .flatMap((note) => hydratePages(note))
    .find((page) => page.id === leafId);

  return (
    <div className="no-print mb-4 flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        {sectionHint ? (
          <button
            type="button"
            className="folio-desk-btn"
            onClick={() => openComposer(createSection, "create")}
          >
            {SECTION_ADD[createSection]}
          </button>
        ) : (
          <>
            <button type="button" className="folio-desk-btn" onClick={() => openComposer("notebook", "create")}>
              + Notebook
            </button>
            <button type="button" className="folio-desk-btn" onClick={() => openComposer("diary", "create")}>
              + Diary
            </button>
            <button type="button" className="folio-desk-btn" onClick={() => openComposer("reports", "create")}>
              + Report
            </button>
          </>
        )}
        <span className="hidden h-4 w-px bg-gold/25 sm:block" />
        {leafId ? (
          <button type="button" className="folio-desk-btn" onClick={() => selectOnly(leafId)}>
            Select this leaf
          </button>
        ) : null}
        <button type="button" className="folio-desk-btn" onClick={clearSelection} disabled={count === 0}>
          Clear
        </button>
        <button
          type="button"
          className="folio-desk-btn folio-desk-btn-gold"
          onClick={() => setPdfOpen(true)}
          disabled={count === 0}
        >
          Preview PDF · {count}
        </button>
      </div>
      {showInk ? (
        <InkToolbar
          tone="desk"
          italic={Boolean(activePage?.italic)}
          onItalic={() => {
            if (!leafId) return;
            for (const note of notes) {
              const pages = hydratePages(note);
              const index = pages.findIndex((page) => page.id === leafId);
              if (index < 0) continue;
              updateNotePages(
                note.id,
                pages.map((page, pageIndex) =>
                  pageIndex === index ? { ...page, italic: !page.italic } : page,
                ),
              );
              return;
            }
          }}
        />
      ) : null}
    </div>
  );
}
