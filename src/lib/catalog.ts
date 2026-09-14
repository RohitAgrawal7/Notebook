import { byDateAsc, byDateDesc } from "./pagination";
import type { DiaryEntry, Note, ReportFile } from "./types";

export function catalogNotes(notes: Note[]) {
  return [...notes].sort(byDateDesc);
}

export function catalogDiary(entries: DiaryEntry[]) {
  return [...entries].sort(byDateAsc);
}

export function catalogReports(files: ReportFile[]) {
  return [...files].sort((a, b) => {
    const folder = a.folder.localeCompare(b.folder);
    if (folder !== 0) return folder;
    return byDateDesc(a, b);
  });
}

export function neighbors<T extends { id: string }>(list: T[], id: string) {
  const index = list.findIndex((item) => item.id === id);
  return {
    index,
    item: index >= 0 ? list[index] : undefined,
    prev: index > 0 ? list[index - 1] : undefined,
    next: index >= 0 && index < list.length - 1 ? list[index + 1] : undefined,
    page: index >= 0 ? index + 1 : 0,
    count: list.length,
  };
}

export function monthLabel(isoDate: string) {
  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
  }).format(new Date(`${isoDate}T12:00:00`));
}
