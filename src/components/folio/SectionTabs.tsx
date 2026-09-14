"use client";

import { SECTION_META } from "@/lib/folio";
import { useFolio } from "@/lib/folio-context";
import { SECTIONS, type SectionId } from "@/lib/types";

const TAB_TINT: Record<SectionId, string> = {
  notebook: "bg-[#efe2c6]",
  diary: "bg-[#f3d9c4]",
  reports: "bg-manila",
};

export function SectionTabs() {
  const { section, setSection, page, pageCount } = useFolio();

  return (
    <div className="flex items-end gap-1 px-2 sm:px-5" role="tablist" aria-label="Folio sections">
      {SECTIONS.map((id) => {
        const active = section === id;
        const meta = SECTION_META[id];
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => setSection(id)}
            className={`relative min-w-0 rounded-t-[14px] border border-b-0 px-3 py-2 text-left shadow-[0_-6px_16px_rgba(0,0,0,0.14)] transition sm:px-5 ${
              TAB_TINT[id]
            } ${
              active
                ? "z-20 -mb-px border-ink/15 pb-3 text-ink"
                : "z-10 translate-y-1.5 border-ink/10 text-ink-soft hover:translate-y-0.5"
            }`}
          >
            <span className="block font-mono text-[9px] uppercase tracking-[0.22em] text-ink-soft">
              {meta.latin}
            </span>
            <span className="block truncate font-serif text-base sm:text-lg">
              {meta.label}
            </span>
            {active ? (
              <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-[0.14em] text-ink-soft">
                Leaf {page} of {pageCount}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
