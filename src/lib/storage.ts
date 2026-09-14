import { diaryEntries as seedDiary, notes as seedNotes, reports as seedReports } from "./data";
import { hydrateDiaryPages, hydratePages, hydrateReportPages } from "./notebook-pages";
import type { DiaryEntry, Note, ReportFile } from "./types";

const KEYS = {
  notes: "folio-notes",
  diary: "folio-diary",
  reports: "folio-reports",
} as const;

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as T;
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

export function loadNotes(): Note[] {
  const stored = readJson<Note[]>(KEYS.notes, seedNotes);
  const list = stored.length ? stored : seedNotes;
  return list.map((note) => ({ ...note, pages: hydratePages(note) }));
}

export function loadDiary(): DiaryEntry[] {
  const stored = readJson<DiaryEntry[]>(KEYS.diary, seedDiary);
  const list = stored.length ? stored : seedDiary;
  return list.map((entry) => ({ ...entry, pages: hydrateDiaryPages(entry) }));
}

export function loadReports(): ReportFile[] {
  const stored = readJson<ReportFile[]>(KEYS.reports, seedReports);
  const list = stored.length ? stored : seedReports;
  return list.map((file) => ({ ...file, pages: hydrateReportPages(file) }));
}

export function saveNotes(notes: Note[]) {
  window.localStorage.setItem(KEYS.notes, JSON.stringify(notes));
}

export function saveDiary(entries: DiaryEntry[]) {
  window.localStorage.setItem(KEYS.diary, JSON.stringify(entries));
}

export function saveReports(files: ReportFile[]) {
  window.localStorage.setItem(KEYS.reports, JSON.stringify(files));
}

export function newId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;
}

export function weekdayFromDate(isoDate: string) {
  return new Intl.DateTimeFormat("en-GB", { weekday: "long" }).format(
    new Date(`${isoDate}T12:00:00`),
  );
}

export function todayIso() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export function nextReportCode(existing: ReportFile[]) {
  const next = existing.length + 1;
  return `FOLIO-${String(next).padStart(2, "0")}`;
}
