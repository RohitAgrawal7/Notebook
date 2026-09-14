"use client";

import { CoverCard } from "@/components/catalog/CoverCard";
import { DeskFrame } from "@/components/layout/DeskFrame";
import { catalogDiary, catalogNotes, catalogReports } from "@/lib/catalog";
import { formatShortDate } from "@/lib/folio";
import { useFolio } from "@/lib/folio-context";
import { REPORT_STATUS_LABEL } from "@/lib/reports";
import { href } from "@/lib/routes";
import { useRouter } from "@/lib/router";
import type { ReactNode } from "react";

export function DashboardPage() {
  const { notes, diaryEntries, reports, openComposer } = useFolio();
  const { go } = useRouter();
  const books = catalogNotes(notes);
  const volumes = catalogDiary(diaryEntries);
  const files = catalogReports(reports);

  return (
    <DeskFrame
      kicker="Library desk"
      title="The Folio"
      deck="Three cabinets on one desk. Each title carries its subject on the cover. Open a book, a diary, or a report to read it as paper."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <Cabinet
          latin="Adversaria"
          title="Notebook"
          count={`${notes.length} books`}
          onAll={() => go(href.notebooks)}
          onAdd={() => openComposer("notebook", "create")}
        >
          {books.length === 0 ? (
            <p className="font-serif text-sm text-[#f3e6cf]/70">This cabinet is empty.</p>
          ) : (
            books.map((note) => (
              <CoverCard
                key={note.id}
                tone="book"
                kicker="Notebook"
                title={note.title}
                subject={note.category}
                date={formatShortDate(note.date)}
                onOpen={() => go(href.notebook(note.id))}
              />
            ))
          )}
        </Cabinet>

        <Cabinet
          latin="Diarium"
          title="Diary"
          count={`${diaryEntries.length} volumes`}
          onAll={() => go(href.diaries)}
          onAdd={() => openComposer("diary", "create")}
        >
          {volumes.length === 0 ? (
            <p className="font-serif text-sm text-[#f3e6cf]/70">This cabinet is empty.</p>
          ) : (
            volumes.map((entry) => (
              <CoverCard
                key={entry.id}
                tone="journal"
                kicker="Diary"
                title={entry.title}
                subject={entry.place}
                date={formatShortDate(entry.date)}
                onOpen={() => go(href.diary(entry.id))}
              />
            ))
          )}
        </Cabinet>

        <Cabinet
          latin="Acta"
          title="Reports"
          count={`${reports.length} files`}
          onAll={() => go(href.reports)}
          onAdd={() => openComposer("reports", "create")}
        >
          {files.length === 0 ? (
            <p className="font-serif text-sm text-[#f3e6cf]/70">This cabinet is empty.</p>
          ) : (
            files.map((file) => (
              <CoverCard
                key={file.id}
                tone="file"
                kicker={file.code}
                title={file.title}
                subject={file.folder}
                date={formatShortDate(file.date)}
                mark={REPORT_STATUS_LABEL[file.status]}
                onOpen={() => go(href.report(file.id))}
              />
            ))
          )}
        </Cabinet>
      </div>
    </DeskFrame>
  );
}

function Cabinet({
  latin,
  title,
  count,
  onAll,
  onAdd,
  children,
}: {
  latin: string;
  title: string;
  count: string;
  onAll: () => void;
  onAdd: () => void;
  children: ReactNode;
}) {
  return (
    <section className="rounded-sm border border-gold/20 bg-[#2a1810]/55 p-4 sm:p-5">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold/70">{latin}</p>
          <h2 className="font-serif text-2xl text-[#f6ead4]">{title}</h2>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-gold/55">
            {count}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <button type="button" className="folio-desk-btn" onClick={onAdd}>
            + Add
          </button>
          <button type="button" className="folio-desk-btn" onClick={onAll}>
            All titles
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}
