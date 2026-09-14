"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { diaryEntries as seedDiary, notes as seedNotes, reports as seedReports } from "./data";
import { SECTION_META } from "./folio";
import {
  blankPage,
  hydrateDiaryPages,
  hydratePages,
  hydrateReportPages,
  paragraphsFromPages,
  writingFromPages,
} from "./notebook-pages";
import { href, hrefFor } from "./routes";
import { byDateAsc, byDateDesc, chunk, clampPage } from "./pagination";
import {
  loadDiary,
  loadNotes,
  loadReports,
  newId,
  nextReportCode,
  saveDiary as persistDiary,
  saveNotes as persistNotes,
  saveReports as persistReports,
  todayIso,
  weekdayFromDate,
} from "./storage";
import type {
  DiaryEntry,
  FolioLeaf,
  Note,
  NoteCategory,
  NotePage,
  PinRef,
  ReportFile,
  ReportStatus,
  SectionId,
} from "./types";

const PIN_STORAGE_KEY = "folio-pins";

export type ComposerState =
  | { open: false }
  | { open: true; section: SectionId; mode: "create" | "edit"; id?: string };

export type ConfirmState =
  | { open: false }
  | { open: true; section: SectionId; id: string; title: string };

type FolioContextValue = {
  section: SectionId;
  page: number;
  pageCount: number;
  direction: "next" | "prev";
  leaf: FolioLeaf;
  category: NoteCategory | "All";
  setCategory: (category: NoteCategory | "All") => void;
  pins: Set<string>;
  pinRefs: PinRef[];
  isPinned: (id: string) => boolean;
  togglePin: (id: string) => void;
  setSection: (section: SectionId) => void;
  goToPage: (page: number) => void;
  goNext: () => void;
  goPrev: () => void;
  openItem: (section: SectionId, id: string) => void;
  updateNotePages: (id: string, pages: NotePage[]) => void;
  updateDiaryPages: (id: string, pages: NotePage[]) => void;
  updateReportPages: (id: string, pages: NotePage[]) => void;
  toggleStar: (id: string) => void;
  isStarred: (id: string) => boolean;
  notes: Note[];
  diaryEntries: DiaryEntry[];
  reports: ReportFile[];
  filteredNotes: Note[];
  composer: ComposerState;
  openComposer: (section: SectionId, mode: "create" | "edit", id?: string) => void;
  closeComposer: () => void;
  saveNote: (input: NoteDraft, id?: string) => void;
  saveDiary: (input: DiaryDraft, id?: string) => void;
  saveReport: (input: ReportDraft, id?: string) => void;
  confirm: ConfirmState;
  askDelete: (section: SectionId, id: string, title: string) => void;
  cancelDelete: () => void;
  confirmDelete: () => void;
  selected: Set<string>;
  toggleSelect: (id: string) => void;
  selectOnly: (id: string) => void;
  isSelected: (id: string) => boolean;
  selectCurrentLeaf: () => void;
  selectMany: (ids: string[]) => void;
  clearSelection: () => void;
  pdfOpen: boolean;
  setPdfOpen: (open: boolean) => void;
  selectedBundle: {
    notes: Note[];
    diary: DiaryEntry[];
    reports: ReportFile[];
  };
  selectedLeaves: SelectedLeaf[];
  activeLeafId: string | null;
  setActiveLeafId: (id: string | null) => void;
};

export type NoteDraft = {
  title: string;
  summary: string;
  body: string;
  category: NoteCategory;
  date: string;
  tags: string;
};

export type DiaryDraft = {
  title: string;
  place: string;
  mood: string;
  date: string;
  body: string;
};

export type ReportDraft = {
  title: string;
  folder: string;
  status: ReportStatus;
  author: string;
  recipient: string;
  date: string;
  summary: string;
  heading: string;
  body: string;
};

export type SelectedLeaf =
  | { kind: "notebook"; note: Note; page: NotePage; index: number; pageCount: number }
  | { kind: "diary"; entry: DiaryEntry; page: NotePage; index: number; pageCount: number }
  | { kind: "reports"; file: ReportFile; page: NotePage; index: number; pageCount: number };

const FolioContext = createContext<FolioContextValue | null>(null);

function defaultPins(notes: Note[], diary: DiaryEntry[], reports: ReportFile[]) {
  return new Set([
    ...notes.filter((item) => item.pinned).map((item) => item.id),
    ...diary.filter((item) => item.pinned).map((item) => item.id),
    ...reports.filter((item) => item.pinned).map((item) => item.id),
  ]);
}

function readStoredPins(notes: Note[], diary: DiaryEntry[], reports: ReportFile[]) {
  try {
    const raw = window.localStorage.getItem(PIN_STORAGE_KEY);
    if (!raw) return defaultPins(notes, diary, reports);
    const parsed = JSON.parse(raw) as string[];
    if (!Array.isArray(parsed)) return defaultPins(notes, diary, reports);
    return new Set(parsed);
  } catch {
    return defaultPins(notes, diary, reports);
  }
}

function locateNotePage(list: Note[], id: string, pageSize = 2) {
  const index = list.findIndex((item) => item.id === id);
  if (index < 0) return 1;
  return Math.floor(index / pageSize) + 1;
}

function locateDiaryPage(list: DiaryEntry[], id: string) {
  const index = list.findIndex((item) => item.id === id);
  return index < 0 ? 1 : index + 1;
}

function locateReportPage(list: ReportFile[], id: string) {
  const index = list.findIndex((item) => item.id === id);
  return index < 0 ? 1 : index + 2;
}

export function FolioProvider({
  children,
  initialSection,
  initialPage,
  navigate,
}: {
  children: ReactNode;
  initialSection: SectionId;
  initialPage: number;
  navigate?: (path: string) => void;
}) {
  const [section, setSectionState] = useState<SectionId>(initialSection);
  const [pageBySection, setPageBySection] = useState<Record<SectionId, number>>({
    notebook: initialSection === "notebook" ? initialPage : 1,
    diary: initialSection === "diary" ? initialPage : 1,
    reports: initialSection === "reports" ? initialPage : 1,
  });
  const [category, setCategoryState] = useState<NoteCategory | "All">("All");
  const [notes, setNotes] = useState<Note[]>(() =>
    seedNotes.map((note) => ({ ...note, pages: hydratePages(note) })),
  );
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>(() =>
    seedDiary.map((entry) => ({ ...entry, pages: hydrateDiaryPages(entry) })),
  );
  const [reports, setReports] = useState<ReportFile[]>(() =>
    seedReports.map((file) => ({ ...file, pages: hydrateReportPages(file) })),
  );
  const [pins, setPins] = useState<Set<string>>(() => defaultPins(seedNotes, seedDiary, seedReports));
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [ready, setReady] = useState(false);
  const [composer, setComposer] = useState<ComposerState>({ open: false });
  const [confirm, setConfirm] = useState<ConfirmState>({ open: false });
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pdfOpen, setPdfOpen] = useState(false);
  const [pendingOpen, setPendingOpen] = useState<{ section: SectionId; id: string } | null>(null);
  const [activeLeafId, setActiveLeafId] = useState<string | null>(null);

  useEffect(() => {
    const nextNotes = loadNotes();
    const nextDiary = loadDiary();
    const nextReports = loadReports();
    setNotes(nextNotes);
    setDiaryEntries(nextDiary);
    setReports(nextReports);
    setPins(readStoredPins(nextNotes, nextDiary, nextReports));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    persistNotes(notes);
    persistDiary(diaryEntries);
    persistReports(reports);
    window.localStorage.setItem(PIN_STORAGE_KEY, JSON.stringify([...pins]));
  }, [diaryEntries, notes, pins, ready, reports]);

  const filteredNotes = useMemo(() => {
    const scoped =
      category === "All" ? notes : notes.filter((note) => note.category === category);
    return [...scoped].sort((a, b) => {
      const pinDelta = Number(pins.has(b.id)) - Number(pins.has(a.id));
      if (pinDelta !== 0) return pinDelta;
      return byDateDesc(a, b);
    });
  }, [category, notes, pins]);

  const orderedDiary = useMemo(() => [...diaryEntries].sort(byDateAsc), [diaryEntries]);

  const orderedReports = useMemo(
    () =>
      [...reports].sort((a, b) => {
        const folder = a.folder.localeCompare(b.folder);
        if (folder !== 0) return folder;
        return byDateDesc(a, b);
      }),
    [reports],
  );

  const leaves = useMemo<FolioLeaf[]>(() => {
    if (section === "notebook") {
      return chunk(filteredNotes, 2).map((pageNotes) => ({
        kind: "notes",
        notes: pageNotes,
      }));
    }
    if (section === "diary") {
      return orderedDiary.length
        ? orderedDiary.map((entry) => ({ kind: "entry" as const, entry }))
        : [{ kind: "entry", entry: emptyDiary() }];
    }
    const folders = [...new Set(orderedReports.map((file) => file.folder))];
    return [
      { kind: "index", files: orderedReports, folders },
      ...orderedReports.map((file) => ({ kind: "document" as const, file })),
    ];
  }, [filteredNotes, orderedDiary, orderedReports, section]);

  const pageCount = Math.max(leaves.length, 1);
  const page = clampPage(pageBySection[section], pageCount);
  const leaf = leaves[page - 1] ?? leaves[0];

  const syncUrl = useCallback((_nextSection: SectionId, _nextPage: number) => {
    // Path routes own the address bar.
  }, []);

  const goToPage = useCallback(
    (nextPage: number) => {
      const safe = clampPage(nextPage, pageCount);
      setDirection(safe >= page ? "next" : "prev");
      setPageBySection((current) => ({ ...current, [section]: safe }));
      syncUrl(section, safe);
    },
    [page, pageCount, section, syncUrl],
  );

  const counts = useMemo(
    () => ({
      notebook: Math.max(chunk(filteredNotes, 2).length, 1),
      diary: Math.max(orderedDiary.length, 1),
      reports: Math.max(orderedReports.length + 1, 1),
    }),
    [filteredNotes, orderedDiary, orderedReports],
  );

  const setSection = useCallback(
    (nextSection: SectionId) => {
      setDirection(SECTIONS_ORDER(nextSection) >= SECTIONS_ORDER(section) ? "next" : "prev");
      setSectionState(nextSection);
      const nextPage = clampPage(pageBySection[nextSection], counts[nextSection]);
      syncUrl(nextSection, nextPage);
    },
    [counts, pageBySection, section, syncUrl],
  );

  const setCategory = useCallback(
    (next: NoteCategory | "All") => {
      setCategoryState(next);
      setDirection("next");
      setPageBySection((current) => ({ ...current, notebook: 1 }));
      if (section === "notebook") syncUrl("notebook", 1);
    },
    [section, syncUrl],
  );

  const goNext = useCallback(() => goToPage(page + 1), [goToPage, page]);
  const goPrev = useCallback(() => goToPage(page - 1), [goToPage, page]);

  const togglePin = useCallback((id: string) => {
    setPins((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const isPinned = useCallback((id: string) => pins.has(id), [pins]);

  const toggleStar = useCallback((id: string) => {
    setNotes((current) => {
      if (!current.some((item) => item.id === id)) return current;
      return current.map((item) => (item.id === id ? { ...item, starred: !item.starred } : item));
    });
    setDiaryEntries((current) => {
      if (!current.some((item) => item.id === id)) return current;
      return current.map((item) => (item.id === id ? { ...item, starred: !item.starred } : item));
    });
    setReports((current) => {
      if (!current.some((item) => item.id === id)) return current;
      return current.map((item) => (item.id === id ? { ...item, starred: !item.starred } : item));
    });
  }, []);

  const isStarred = useCallback(
    (id: string) =>
      Boolean(
        notes.find((item) => item.id === id)?.starred ??
          diaryEntries.find((item) => item.id === id)?.starred ??
          reports.find((item) => item.id === id)?.starred,
      ),
    [diaryEntries, notes, reports],
  );

  const pinRefs = useMemo<PinRef[]>(() => {
    const refs: PinRef[] = [];
    for (const note of notes) {
      if (!pins.has(note.id)) continue;
      refs.push({
        id: note.id,
        section: "notebook",
        title: note.title,
        eyebrow: note.category,
      });
    }
    for (const entry of diaryEntries) {
      if (!pins.has(entry.id)) continue;
      refs.push({
        id: entry.id,
        section: "diary",
        title: entry.title,
        eyebrow: entry.date,
      });
    }
    for (const file of reports) {
      if (!pins.has(file.id)) continue;
      refs.push({
        id: file.id,
        section: "reports",
        title: file.title,
        eyebrow: file.code,
      });
    }
    return refs;
  }, [diaryEntries, notes, pins, reports]);

  const openItem = useCallback(
    (target: SectionId, id: string) => {
      if (target === "notebook") setCategoryState("All");
      const notebookLeaves = [...notes].sort((a, b) => {
        const pinDelta = Number(pins.has(b.id)) - Number(pins.has(a.id));
        if (pinDelta !== 0) return pinDelta;
        return byDateDesc(a, b);
      });
      const diaryList = [...diaryEntries].sort(byDateAsc);
      const reportList = [...reports].sort((a, b) => {
        const folder = a.folder.localeCompare(b.folder);
        if (folder !== 0) return folder;
        return byDateDesc(a, b);
      });
      let nextPage = 1;
      if (target === "notebook") nextPage = locateNotePage(notebookLeaves, id);
      if (target === "diary") nextPage = locateDiaryPage(diaryList, id);
      if (target === "reports") nextPage = locateReportPage(reportList, id);
      setDirection("next");
      setSectionState(target);
      setPageBySection((current) => ({ ...current, [target]: nextPage }));
      syncUrl(target, nextPage);
    },
    [diaryEntries, notes, pins, reports, syncUrl],
  );

  const updateNotePages = useCallback((id: string, pages: NotePage[]) => {
    const nextPages = pages.length ? pages : [blankPage()];
    setNotes((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              pages: nextPages,
              body: writingFromPages(nextPages),
            }
          : item,
      ),
    );
  }, []);

  const updateDiaryPages = useCallback((id: string, pages: NotePage[]) => {
    const nextPages = pages.length ? pages : [blankPage()];
    setDiaryEntries((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              pages: nextPages,
              body: paragraphsFromPages(nextPages),
            }
          : item,
      ),
    );
  }, []);

  const updateReportPages = useCallback((id: string, pages: NotePage[]) => {
    const nextPages = pages.length ? pages : [blankPage()];
    setReports((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              pages: nextPages,
              sections: [
                {
                  heading: item.sections[0]?.heading || "1. Note",
                  paragraphs: paragraphsFromPages(nextPages, "(empty filing)"),
                },
              ],
            }
          : item,
      ),
    );
  }, []);

  const openComposer = useCallback(
    (target: SectionId, mode: "create" | "edit", id?: string) => {
      setSectionState(target);
      setComposer({ open: true, section: target, mode, id });
    },
    [],
  );

  const closeComposer = useCallback(() => setComposer({ open: false }), []);

  const saveNote = useCallback(
    (input: NoteDraft, id?: string) => {
      const existing = id ? notes.find((item) => item.id === id) : undefined;
      const record: Note = {
        id: id ?? newId("note"),
        title: (input.title ?? "").trim() || "Untitled note",
        summary: (input.summary ?? "").trim(),
        body: (input.body ?? "").trim(),
        pages:
          id && existing?.pages && existing.pages.length > 0
            ? hydratePages(existing)
            : hydratePages({ summary: input.summary, body: input.body }),
        category: input.category,
        date: input.date || todayIso(),
        tags: (input.tags ?? "")
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        pinned: id ? pins.has(id) : false,
        starred: existing?.starred,
      };
      setNotes((current) => {
        if (!id) return [record, ...current];
        return current.map((item) => (item.id === id ? record : item));
      });
      setCategoryState("All");
      setSectionState("notebook");
      closeComposer();
      setPendingOpen({ section: "notebook", id: record.id });
    },
    [closeComposer, notes, pins],
  );

  const saveDiary = useCallback(
    (input: DiaryDraft, id?: string) => {
      const existing = id ? diaryEntries.find((item) => item.id === id) : undefined;
      const date = input.date || todayIso();
      const recordId = id ?? newId("diary");
      const body = (input.body ?? "")
        .split(/\n{2,}/)
        .map((part) => part.trim())
        .filter(Boolean);
      const record: DiaryEntry = {
        id: recordId,
        date,
        weekday: weekdayFromDate(date),
        place: (input.place ?? "").trim() || "Studio",
        title: (input.title ?? "").trim() || "Untitled day",
        mood: (input.mood ?? "").trim() || "Steady",
        body: body.length ? body : ["(empty leaf)"],
        pages:
          id && existing?.pages && existing.pages.length > 0
            ? hydrateDiaryPages(existing)
            : hydrateDiaryPages({
                id: recordId,
                body: body.length ? body : ["(empty leaf)"],
              }),
        pinned: id ? pins.has(id) : false,
        starred: existing?.starred,
      };
      setDiaryEntries((current) => {
        if (!id) return [...current, record];
        return current.map((item) => (item.id === id ? record : item));
      });
      setSectionState("diary");
      closeComposer();
      setPendingOpen({ section: "diary", id: record.id });
    },
    [closeComposer, diaryEntries, pins],
  );

  const saveReport = useCallback(
    (input: ReportDraft, id?: string) => {
      const existing = id ? reports.find((file) => file.id === id) : undefined;
      const record: ReportFile = {
        id: id ?? newId("report"),
        code: existing?.code ?? nextReportCode(reports),
        title: (input.title ?? "").trim() || "Untitled report",
        folder: (input.folder ?? "").trim() || "Submissions",
        status: input.status,
        author: (input.author ?? "").trim() || "A. Sen",
        recipient: (input.recipient ?? "").trim() || "Studio review",
        date: input.date || todayIso(),
        summary: (input.summary ?? "").trim(),
        sections:
          id && existing?.sections && existing.sections.length > 0
            ? existing.sections
            : [
                {
                  heading: (input.heading ?? "").trim() || "1. Note",
                  paragraphs: (input.body ?? "")
                    .split(/\n{2,}/)
                    .map((part) => part.trim())
                    .filter(Boolean),
                },
              ],
        pages:
          id && existing?.pages && existing.pages.length > 0
            ? hydrateReportPages(existing)
            : undefined,
        pinned: id ? pins.has(id) : false,
        starred: existing?.starred,
      };
      if (record.sections[0] && record.sections[0].paragraphs.length === 0) {
        record.sections[0].paragraphs = ["(empty filing)"];
      }
      if (!record.pages) {
        record.pages = hydrateReportPages(record);
      }
      setReports((current) => {
        if (!id) return [record, ...current];
        return current.map((item) => (item.id === id ? record : item));
      });
      setSectionState("reports");
      closeComposer();
      setPendingOpen({ section: "reports", id: record.id });
    },
    [closeComposer, pins, reports],
  );

  const askDelete = useCallback((target: SectionId, id: string, title: string) => {
    setConfirm({ open: true, section: target, id, title });
  }, []);

  const cancelDelete = useCallback(() => setConfirm({ open: false }), []);

  const confirmDelete = useCallback(() => {
    if (!confirm.open) return;
    const { id, section: target } = confirm;
    const leafIds = [id];
    if (target === "notebook") {
      const note = notes.find((item) => item.id === id);
      if (note) leafIds.push(...hydratePages(note).map((page) => page.id));
      setNotes((current) => current.filter((item) => item.id !== id));
    }
    if (target === "diary") {
      const entry = diaryEntries.find((item) => item.id === id);
      if (entry) leafIds.push(...hydrateDiaryPages(entry).map((page) => page.id));
      setDiaryEntries((current) => current.filter((item) => item.id !== id));
    }
    if (target === "reports") {
      const file = reports.find((item) => item.id === id);
      if (file) leafIds.push(...hydrateReportPages(file).map((page) => page.id));
      setReports((current) => current.filter((item) => item.id !== id));
    }
    setPins((current) => {
      const next = new Set(current);
      next.delete(id);
      return next;
    });
    setSelected((current) => {
      const next = new Set(current);
      leafIds.forEach((leafId) => next.delete(leafId));
      return next;
    });
    setConfirm({ open: false });
    navigate?.(hrefFor(target));
  }, [confirm, diaryEntries, navigate, notes, reports]);

  const toggleSelect = useCallback((id: string) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectOnly = useCallback((id: string) => {
    setSelected(new Set([id]));
  }, []);

  const selectMany = useCallback((ids: string[]) => {
    setSelected((current) => {
      const next = new Set(current);
      ids.forEach((id) => next.add(id));
      return next;
    });
  }, []);

  const isSelected = useCallback((id: string) => selected.has(id), [selected]);

  const selectCurrentLeaf = useCallback(() => {
    const ids =
      leaf.kind === "notes"
        ? leaf.notes.map((note) => note.id)
        : leaf.kind === "entry"
          ? leaf.entry.id.startsWith("empty-")
            ? []
            : [leaf.entry.id]
          : leaf.kind === "document"
            ? [leaf.file.id]
            : leaf.files.map((file) => file.id);
    setSelected((current) => {
      const next = new Set(current);
      ids.forEach((id) => next.add(id));
      return next;
    });
  }, [leaf]);

  const clearSelection = useCallback(() => setSelected(new Set()), []);

  const selectedLeaves = useMemo(() => {
    const leaves: SelectedLeaf[] = [];
    for (const note of notes) {
      const pages = hydratePages(note);
      pages.forEach((page, index) => {
        if (selected.has(page.id)) {
          leaves.push({ kind: "notebook", note, page, index, pageCount: pages.length });
        }
      });
    }
    for (const entry of diaryEntries) {
      const pages = hydrateDiaryPages(entry);
      pages.forEach((page, index) => {
        if (selected.has(page.id)) {
          leaves.push({ kind: "diary", entry, page, index, pageCount: pages.length });
        }
      });
    }
    for (const file of reports) {
      const pages = hydrateReportPages(file);
      pages.forEach((page, index) => {
        if (selected.has(page.id)) {
          leaves.push({ kind: "reports", file, page, index, pageCount: pages.length });
        }
      });
    }
    return leaves.sort((a, b) => {
      const titleA = a.kind === "notebook" ? a.note.title : a.kind === "diary" ? a.entry.title : a.file.title;
      const titleB = b.kind === "notebook" ? b.note.title : b.kind === "diary" ? b.entry.title : b.file.title;
      if (a.kind !== b.kind) return a.kind.localeCompare(b.kind);
      if (titleA !== titleB) return titleA.localeCompare(titleB);
      return a.index - b.index;
    });
  }, [diaryEntries, notes, reports, selected]);

  const selectedBundle = useMemo(
    () => ({
      notes: notes.filter((item) => selected.has(item.id)),
      diary: diaryEntries.filter((item) => selected.has(item.id)),
      reports: reports.filter((item) => selected.has(item.id)),
    }),
    [diaryEntries, notes, reports, selected],
  );

  useEffect(() => {
    if (!pendingOpen) return;
    openItem(pendingOpen.section, pendingOpen.id);
    navigate?.(hrefFor(pendingOpen.section, pendingOpen.id));
    setPendingOpen(null);
  }, [diaryEntries, navigate, notes, openItem, pendingOpen, reports]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return;
      }
      if (event.key === "Escape") {
        closeComposer();
        setPdfOpen(false);
        cancelDelete();
      }
      if (event.key === "1") navigate?.(href.notebooks);
      if (event.key === "2") navigate?.(href.diaries);
      if (event.key === "3") navigate?.(href.reports);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cancelDelete, closeComposer, navigate]);

  const value = useMemo<FolioContextValue>(
    () => ({
      section,
      page,
      pageCount,
      direction,
      leaf,
      category,
      setCategory,
      pins,
      pinRefs,
      isPinned,
      togglePin,
      toggleStar,
      isStarred,
      setSection,
      goToPage,
      goNext,
      goPrev,
      openItem,
      updateNotePages,
      updateDiaryPages,
      updateReportPages,
      notes,
      diaryEntries,
      reports,
      filteredNotes,
      composer,
      openComposer,
      closeComposer,
      saveNote,
      saveDiary,
      saveReport,
      confirm,
      askDelete,
      cancelDelete,
      confirmDelete,
      selected,
      toggleSelect,
      selectOnly,
      isSelected,
      selectCurrentLeaf,
      selectMany,
      clearSelection,
      pdfOpen,
      setPdfOpen,
      selectedBundle,
      selectedLeaves,
      activeLeafId,
      setActiveLeafId,
    }),
    [
      askDelete,
      cancelDelete,
      category,
      clearSelection,
      closeComposer,
      composer,
      confirm,
      confirmDelete,
      diaryEntries,
      direction,
      filteredNotes,
      goNext,
      goPrev,
      goToPage,
      isPinned,
      isStarred,
      isSelected,
      leaf,
      notes,
      openComposer,
      openItem,
      page,
      pageCount,
      pdfOpen,
      pinRefs,
      pins,
      reports,
      saveDiary,
      saveNote,
      saveReport,
      section,
      selectCurrentLeaf,
      selectMany,
      selected,
      selectedBundle,
      selectedLeaves,
      activeLeafId,
      setCategory,
      setSection,
      togglePin,
      toggleStar,
      toggleSelect,
      selectOnly,
      updateNotePages,
      updateDiaryPages,
      updateReportPages,
    ],
  );

  return <FolioContext.Provider value={value}>{children}</FolioContext.Provider>;
}

function emptyDiary(): DiaryEntry {
  return {
    id: "empty-diary",
    date: todayIso(),
    weekday: weekdayFromDate(todayIso()),
    place: "",
    title: "The diary is empty",
    body: ["Add a new page to begin the register."],
    mood: "Quiet",
    pinned: false,
    pages: [blankPage()],
  };
}

function SECTIONS_ORDER(section: SectionId) {
  return section === "notebook" ? 0 : section === "diary" ? 1 : 2;
}

export function useFolio() {
  const context = useContext(FolioContext);
  if (!context) {
    throw new Error("useFolio must be used within FolioProvider");
  }
  return context;
}

export function useSectionMeta() {
  const { section } = useFolio();
  return SECTION_META[section];
}
