"use client";

import { StatusStamp } from "@/components/reports/StatusStamp";
import type { NoteCategory, ReportStatus } from "@/lib/types";

const BOOK_CLOTH: Record<NoteCategory, string> = {
  Research: "bg-[#3d4f3a]",
  Design: "bg-[#6b2e2a]",
  Field: "bg-[#8a5a2b]",
  Reference: "bg-[#2c3d55]",
};

export function BookCover({
  title,
  subject,
  date,
  category,
  onOpen,
}: {
  title: string;
  subject: string;
  date: string;
  category: NoteCategory;
  onOpen: () => void;
}) {
  return (
    <button type="button" onClick={onOpen} className="book-cover group text-left">
      <span className={`book-spine ${BOOK_CLOTH[category]}`} aria-hidden />
      <span className="flex min-w-0 flex-1 flex-col bg-[#efe2c6] px-4 py-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">
          Notebook
        </span>
        <span className="mt-2 font-serif text-xl leading-snug text-ink group-hover:underline group-hover:decoration-ink/25">
          {title}
        </span>
        <span className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-margin-red">
          Subject
        </span>
        <span className="mt-1 font-serif text-sm text-ink-soft">{subject}</span>
        <span className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft">
          {date}
        </span>
      </span>
    </button>
  );
}

export function JournalCover({
  title,
  subject,
  date,
  weekday,
  onOpen,
}: {
  title: string;
  subject: string;
  date: string;
  weekday: string;
  onOpen: () => void;
}) {
  return (
    <button type="button" onClick={onOpen} className="journal-cover group text-left">
      <span className="flex w-[4.5rem] shrink-0 flex-col items-center justify-center bg-[#5c2e24] px-2 py-4 text-[#f6ead4]">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em]">{weekday.slice(0, 3)}</span>
        <span className="mt-1 font-serif text-lg leading-none">{date.split(" ")[0]}</span>
      </span>
      <span className="flex min-w-0 flex-1 flex-col bg-[#f3d9c4] px-4 py-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">Diary</span>
        <span className="mt-2 font-serif text-xl leading-snug text-ink group-hover:underline group-hover:decoration-ink/25">
          {title}
        </span>
        <span className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-margin-red">
          Subject
        </span>
        <span className="mt-1 font-serif text-sm text-ink-soft">{subject}</span>
        <span className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft">
          {date}
        </span>
      </span>
    </button>
  );
}

export function FileCover({
  code,
  title,
  subject,
  date,
  author,
  status,
  onOpen,
}: {
  code: string;
  title: string;
  subject: string;
  date: string;
  author?: string;
  status?: ReportStatus;
  onOpen: () => void;
}) {
  return (
    <button type="button" onClick={onOpen} className="file-cover group text-left">
      <span className="file-tab">{subject}</span>
      <span className="file-body bg-manila px-4 pb-4 pt-5">
        <span className="flex items-start justify-between gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">{code}</span>
          {status ? <StatusStamp status={status} /> : null}
        </span>
        <span className="mt-2 block font-serif text-xl leading-snug text-ink group-hover:underline group-hover:decoration-ink/25">
          {title}
        </span>
        {author ? (
          <span className="mt-2 block font-serif text-sm text-ink-soft">From {author}</span>
        ) : (
          <>
            <span className="mt-3 block font-mono text-[10px] uppercase tracking-[0.14em] text-margin-red">
              Subject
            </span>
            <span className="mt-1 block font-serif text-sm text-ink-soft">{subject}</span>
          </>
        )}
        <span className="mt-4 block font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft">
          {date}
        </span>
      </span>
    </button>
  );
}
