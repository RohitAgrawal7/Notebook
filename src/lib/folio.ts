import { SECTIONS, type SectionId } from "./types";

export const SECTION_META: Record<
  SectionId,
  { label: string; latin: string; paper: "ruled" | "plain" | "letter" }
> = {
  notebook: {
    label: "Notebook",
    latin: "Adversaria",
    paper: "ruled",
  },
  diary: {
    label: "Diary",
    latin: "Diarium",
    paper: "plain",
  },
  reports: {
    label: "Report Files",
    latin: "Acta",
    paper: "letter",
  },
};

export function isSectionId(value: string | null | undefined): value is SectionId {
  return SECTIONS.some((section) => section === value);
}

export function parseSection(value: string | string[] | undefined): SectionId {
  const raw = Array.isArray(value) ? value[0] : value;
  return isSectionId(raw) ? raw : "notebook";
}

export function parsePage(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const page = Number.parseInt(raw ?? "1", 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

export function formatLongDate(isoDate: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${isoDate}T12:00:00`));
}

export function formatShortDate(isoDate: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${isoDate}T12:00:00`));
}

export function formatDeskNow() {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}
