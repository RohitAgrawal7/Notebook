"use client";

import { useFolio } from "@/lib/folio-context";
import type { SectionId } from "@/lib/types";

export function LeafTools({
  section,
  id,
  title,
}: {
  section: SectionId;
  id: string;
  title: string;
}) {
  const { isSelected, toggleSelect, selectOnly, openComposer, askDelete } = useFolio();
  if (id.startsWith("empty-")) return null;
  const selected = isSelected(id);

  return (
    <div className="no-print mt-3 flex flex-wrap items-center gap-2">
      <label className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => {
            if (selected) toggleSelect(id);
            else selectOnly(id);
          }}
        />
        PDF
      </label>
      <button type="button" className="folio-tiny" onClick={() => openComposer(section, "edit", id)}>
        Edit
      </button>
      <button type="button" className="folio-tiny" onClick={() => askDelete(section, id, title)}>
        Delete
      </button>
    </div>
  );
}
