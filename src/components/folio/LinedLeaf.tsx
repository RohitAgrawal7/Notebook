"use client";

import { InkMarks } from "@/components/folio/InkMarks";
import { ReportLetterhead } from "@/components/reports/ReportLetterhead";
import { formatLongDate, formatShortDate } from "@/lib/folio";
import { hydrateReportPages, NOTEBOOK_LINES } from "@/lib/notebook-pages";
import { collectReportHeadings, isReportHeading } from "@/lib/reports";
import type { DiaryEntry, Note, NotePage, ReportFile } from "@/lib/types";
import type { ReactNode } from "react";

export function NotebookRules() {
  return (
    <div className="notebook-rules" aria-hidden>
      {Array.from({ length: NOTEBOOK_LINES }, (_, line) => (
        <span key={line} />
      ))}
    </div>
  );
}

export function NotebookChrome({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="notebook-holes" aria-hidden>
        {[0, 1, 2].map((hole) => (
          <span key={hole} />
        ))}
      </div>
      <div className="notebook-margin" aria-hidden />
      <div className="notebook-inner">{children}</div>
    </>
  );
}

export function NotebookLeafHeader({
  note,
  leafNumber,
  pageCount,
}: {
  note: Note;
  leafNumber: number;
  pageCount: number;
}) {
  return (
    <header className="mb-3 flex items-start justify-between gap-3 border-b border-ink/10 pb-3">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
          {note.category} · {formatShortDate(note.date)}
        </p>
        <h1 className="mt-1 font-serif text-2xl leading-tight tracking-tight">{note.title}</h1>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-margin-red">
          Subject · {note.category}
        </p>
      </div>
      <LeafNumber leafNumber={leafNumber} pageCount={pageCount} />
    </header>
  );
}

export function DiaryLeafHeader({
  entry,
  leafNumber,
  pageCount,
}: {
  entry: DiaryEntry;
  leafNumber: number;
  pageCount: number;
}) {
  return (
    <>
      <header className="mb-6 flex items-start justify-between gap-4 border-b border-ink/10 pb-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft">
            {entry.weekday} · {entry.place}
          </p>
          <h1 className="mt-1 font-serif text-2xl leading-tight tracking-tight sm:text-[1.85rem]">
            {formatLongDate(entry.date)}
          </h1>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">
            Subject · {entry.place}
          </p>
        </div>
        <p className="shrink-0 pt-1 text-right font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">
          Diarium
          <br />
          Page {leafNumber} / {pageCount}
        </p>
      </header>
      <div className="mb-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-margin-red">{entry.mood}</p>
        <h2 className="mt-1 font-serif text-3xl tracking-tight text-ink">{entry.title}</h2>
      </div>
    </>
  );
}

export function ReportLeafHeader({
  file,
  leafNumber,
  pageCount,
  headings = [],
}: {
  file: ReportFile;
  leafNumber: number;
  pageCount: number;
  headings?: string[];
}) {
  return (
    <ReportLetterhead
      file={file}
      leafNumber={leafNumber}
      pageCount={pageCount}
      headings={headings}
    />
  );
}

export function LinedPrintLeaf({
  title,
  kindLabel,
  page,
  leafNumber,
  pageCount,
  header,
}: {
  title: string;
  kindLabel: string;
  page: NotePage;
  leafNumber: number;
  pageCount: number;
  header: ReactNode;
}) {
  return (
    <article className="paper-grain paper-shadow notebook-sheet pdf-notebook-leaf relative overflow-hidden text-ink">
      <p className="pdf-leaf-kicker no-print">
        {kindLabel} page {leafNumber} of {pageCount} · complete leaf · {NOTEBOOK_LINES} lines
      </p>
      <NotebookChrome>
        {header}
        <div className="notebook-pad">
          <NotebookRules />
          <div className={`notebook-hand${page.italic ? " is-italic" : ""}${page.underline ? " is-underline" : ""}`}>
            {page.text}
          </div>
          <InkMarks strokes={page.ink ?? []} />
        </div>
        <footer className="mt-3 flex items-end justify-between border-t border-ink/10 pt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">
          <span>{title}</span>
          <span>
            Page {leafNumber} of {pageCount}
          </span>
        </footer>
      </NotebookChrome>
    </article>
  );
}

export function NotebookPrintLeaf({
  note,
  page,
  leafNumber,
  pageCount,
}: {
  note: Note;
  page: NotePage;
  leafNumber: number;
  pageCount: number;
}) {
  return (
    <LinedPrintLeaf
      title={note.title}
      kindLabel="Notebook"
      page={page}
      leafNumber={leafNumber}
      pageCount={pageCount}
      header={<NotebookLeafHeader note={note} leafNumber={leafNumber} pageCount={pageCount} />}
    />
  );
}

export function DiaryPrintLeaf({
  entry,
  page,
  leafNumber,
  pageCount,
}: {
  entry: DiaryEntry;
  page: NotePage;
  leafNumber: number;
  pageCount: number;
}) {
  return (
    <article className="paper-grain pdf-page pdf-prose-leaf relative text-ink">
      <p className="pdf-leaf-kicker no-print">
        Diary page {leafNumber} of {pageCount}
      </p>
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">
        Diary · {entry.weekday} · {formatLongDate(entry.date)}
      </p>
      <h3 className="mt-2 font-serif text-2xl">{entry.title}</h3>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-margin-red">
        {entry.mood} · {entry.place}
      </p>
      <div className="mt-5 max-w-prose">
        <ProseParagraphs text={page.text} dropCap={leafNumber === 1} className="font-serif text-[17.5px] leading-[1.85]" />
      </div>
      <footer className="mt-10 flex items-end justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">
        <span>
          {formatLongDate(entry.date)} · {entry.place}
        </span>
        <span>
          Page {leafNumber} of {pageCount}
        </span>
      </footer>
    </article>
  );
}

export function ReportPrintLeaf({
  file,
  page,
  leafNumber,
  pageCount,
}: {
  file: ReportFile;
  page: NotePage;
  leafNumber: number;
  pageCount: number;
}) {
  const headings = collectReportHeadings(hydrateReportPages(file));
  return (
    <article className="paper-grain pdf-page pdf-prose-leaf relative text-ink">
      <p className="pdf-leaf-kicker no-print">
        Report sheet {leafNumber} of {pageCount}
      </p>
      <ReportLetterhead
        file={file}
        leafNumber={leafNumber}
        pageCount={pageCount}
        headings={headings}
      />
      <div className="mt-6">
        <ReportParagraphs text={page.text} />
      </div>
      <footer className="mt-10 flex items-end justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft">
        <span>
          Filed for the record · {file.folder} · {file.code}
        </span>
        <span>
          Sheet {leafNumber} of {pageCount}
        </span>
      </footer>
    </article>
  );
}

function ProseParagraphs({
  text,
  dropCap = false,
  className,
}: {
  text: string;
  dropCap?: boolean;
  className: string;
}) {
  const parts = text.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean);
  if (parts.length === 0) {
    return text ? <p className={className}>{text}</p> : null;
  }
  return (
    <>
      {parts.map((part, index) => (
        <p
          key={`${index}-${part.slice(0, 24)}`}
          className={`${className} ${dropCap && index === 0 ? "drop-cap" : ""} ${index > 0 ? "mt-5" : ""}`}
        >
          {part}
        </p>
      ))}
    </>
  );
}

function ReportParagraphs({ text }: { text: string }) {
  const parts = text.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean);
  return (
    <>
      {parts.map((part, index) => {
        const heading = isReportHeading(part);
        if (heading) {
          return (
            <h4 key={`${index}-${part}`} className={`${index > 0 ? "mt-7" : ""} font-serif text-xl text-ink`}>
              {part}
            </h4>
          );
        }
        return (
          <p key={`${index}-${part.slice(0, 24)}`} className="mt-2 max-w-prose font-serif text-[16.5px] leading-[1.8] text-ink/90">
            {part}
          </p>
        );
      })}
    </>
  );
}

function LeafNumber({ leafNumber, pageCount }: { leafNumber: number; pageCount: number }) {
  return (
    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft">
      Page {leafNumber} / {pageCount}
    </span>
  );
}
