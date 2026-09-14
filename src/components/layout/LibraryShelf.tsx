"use client";

import { RegisterBar } from "@/components/folio/RegisterBar";
import type { SectionId } from "@/lib/types";
import type { ReactNode } from "react";

export function LibraryShelf({
  children,
  section,
  latin,
  title,
  count,
  onAdd,
}: {
  children: ReactNode;
  section: SectionId;
  latin: string;
  title: string;
  count: string;
  onAdd: () => void;
}) {
  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold/70">{latin}</p>
          <h2 className="font-serif text-3xl text-[#f6ead4]">{title}</h2>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-gold/55">{count}</p>
        </div>
        <button type="button" className="folio-desk-btn folio-desk-btn-gold" onClick={onAdd}>
          + Add
        </button>
      </div>
      <RegisterBar sectionHint={section} />
      {children}
    </div>
  );
}
