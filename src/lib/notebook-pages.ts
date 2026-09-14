import type { DiaryEntry, NotePage, ReportFile } from "./types";

export const NOTEBOOK_LINES = 40;

type PageSource = {
  id?: string;
  summary?: string;
  body?: string;
  pages?: Array<string | NotePage>;
};

export function pagePreview(text: string) {
  const line = text.replace(/\s+/g, " ").trim();
  return line ? line.slice(0, 64) : "Blank leaf";
}

export function pageText(page: string | NotePage) {
  return typeof page === "string" ? page : page.text;
}

export function hydratePages(note: PageSource): NotePage[] {
  if (note.pages && note.pages.length > 0) {
    return note.pages.map((item, index) => toNotePage(item, note.id, index));
  }
  return paginateWriting([note.summary, note.body].filter(Boolean).join("\n\n")).map((text, index) =>
    toNotePage(text, note.id, index),
  );
}

export function writingFromNote(note: PageSource) {
  return hydratePages(note);
}

export function writingFromPages(pages: NotePage[]) {
  return pages.map((page) => page.text).filter((text) => text.trim()).join("\n\n");
}

export function paragraphsFromPages(pages: NotePage[], empty = "(empty leaf)") {
  const parts = writingFromPages(pages)
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.length ? parts : [empty];
}

export function hydrateDiaryPages(entry: Pick<DiaryEntry, "id" | "body" | "pages">): NotePage[] {
  return hydratePages({
    id: entry.id,
    body: entry.body.filter(Boolean).join("\n\n"),
    pages: entry.pages,
  });
}

export function hydrateReportPages(
  file: Pick<ReportFile, "id" | "summary" | "sections" | "pages">,
): NotePage[] {
  const pages = hydratePages({
    id: file.id,
    body: file.sections
      .flatMap((section) => [section.heading, ...section.paragraphs])
      .filter(Boolean)
      .join("\n\n"),
    pages: file.pages,
  });
  const summary = file.summary?.trim();
  if (!summary || !pages[0]) return pages;
  const text = pages[0].text.trimStart();
  if (!text.startsWith(summary)) return pages;
  const rest = text.slice(summary.length).replace(/^\s+/, "");
  const next = [{ ...pages[0], text: rest }, ...pages.slice(1)];
  if (!next[0].text.trim() && next.length > 1) return next.slice(1);
  return next;
}

export function blankPage(): NotePage {
  return {
    id: `leaf-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`,
    text: "",
    pinned: false,
    starred: false,
    italic: false,
    underline: false,
    ink: [],
  };
}

export function paginateWriting(source: string, columns = 68) {
  const lines = wrapWriting(source, columns);
  if (lines.length === 0) return [""];
  const pages: string[] = [];
  for (let index = 0; index < lines.length; index += NOTEBOOK_LINES) {
    pages.push(lines.slice(index, index + NOTEBOOK_LINES).join("\n"));
  }
  return pages;
}

export function wrapWriting(source: string, columns = 68) {
  const lines: string[] = [];
  const paragraphs = source.replace(/\r\n/g, "\n").split("\n");
  for (const paragraph of paragraphs) {
    if (paragraph.trim() === "") {
      lines.push("");
      continue;
    }
    let rest = paragraph.trim();
    while (rest.length > columns) {
      let split = rest.lastIndexOf(" ", columns);
      if (split < columns * 0.45) split = columns;
      lines.push(rest.slice(0, split).trimEnd());
      rest = rest.slice(split).trimStart();
    }
    if (rest) lines.push(rest);
  }
  while (lines.length > 1 && lines[lines.length - 1] === "") lines.pop();
  return lines;
}

export function splitOverflow(text: string, fits: (value: string) => boolean) {
  if (fits(text)) return { keep: text, rest: "" };
  let low = 0;
  let high = text.length;
  let fit = 0;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (fits(text.slice(0, mid))) {
      fit = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  let split = fit;
  const breakAt = Math.max(text.lastIndexOf("\n", fit - 1), text.lastIndexOf(" ", fit - 1));
  if (breakAt >= Math.floor(fit * 0.4)) split = breakAt + 1;
  return {
    keep: text.slice(0, split).replace(/[ \t]+$/g, ""),
    rest: text.slice(split).replace(/^[ \t]+/g, ""),
  };
}

function toNotePage(item: string | NotePage, noteId: string | undefined, index: number): NotePage {
  if (typeof item === "string") {
    return {
      id: `${noteId ?? "note"}-leaf-${index + 1}`,
      text: item,
      pinned: false,
      starred: false,
    };
  }
  return {
    id: item.id || `${noteId ?? "note"}-leaf-${index + 1}`,
    text: item.text ?? "",
    pinned: Boolean(item.pinned),
    starred: Boolean(item.starred),
    italic: Boolean(item.italic),
    underline: Boolean(item.underline),
    ink: Array.isArray(item.ink) ? item.ink : [],
  };
}
