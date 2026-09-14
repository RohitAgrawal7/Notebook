"use client";

import { useFolio } from "@/lib/folio-context";
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
  } = useFolio();
  const count = selected.size;
  const leafId = activeLeafId ?? currentId;
  const createSection = sectionHint ?? section;

  return (
    <div className="no-print mb-4 flex flex-wrap items-center gap-2">
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
  );
}
