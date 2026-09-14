export const SECTIONS = ["notebook", "diary", "reports"] as const;
export type SectionId = (typeof SECTIONS)[number];

export const NOTE_CATEGORIES = [
  "Research",
  "Design",
  "Field",
  "Reference",
] as const;
export type NoteCategory = (typeof NOTE_CATEGORIES)[number];

export const REPORT_STATUSES = ["draft", "review", "filed"] as const;
export type ReportStatus = (typeof REPORT_STATUSES)[number];

export interface InkPoint {
  x: number;
  y: number;
}

export type InkKind = "pen" | "highlighter" | "pencil" | "eraser" | "underline";

export interface InkStroke {
  id: string;
  tool: Exclude<InkKind, "eraser">;
  color: string;
  size: number;
  points: InkPoint[];
}

export interface NotePage {
  id: string;
  text: string;
  pinned: boolean;
  starred: boolean;
  italic?: boolean;
  underline?: boolean;
  ink?: InkStroke[];
}

export interface Note {
  id: string;
  title: string;
  summary: string;
  body: string;
  pages?: Array<string | NotePage>;
  category: NoteCategory;
  date: string;
  tags: string[];
  pinned: boolean;
  starred?: boolean;
}

export interface DiaryEntry {
  id: string;
  date: string;
  weekday: string;
  place: string;
  title: string;
  body: string[];
  pages?: Array<string | NotePage>;
  mood: string;
  pinned: boolean;
  starred?: boolean;
}

export interface ReportSection {
  heading: string;
  paragraphs: string[];
}

export interface ReportFile {
  id: string;
  code: string;
  title: string;
  folder: string;
  status: ReportStatus;
  author: string;
  date: string;
  recipient: string;
  summary: string;
  sections: ReportSection[];
  pages?: Array<string | NotePage>;
  pinned: boolean;
  starred?: boolean;
}

export type NotebookLeaf = {
  kind: "notes";
  notes: Note[];
};

export type DiaryLeaf = {
  kind: "entry";
  entry: DiaryEntry;
};

export type ReportLeaf =
  | { kind: "index"; files: ReportFile[]; folders: string[] }
  | { kind: "document"; file: ReportFile };

export type FolioLeaf = NotebookLeaf | DiaryLeaf | ReportLeaf;

export type PinRef = {
  id: string;
  section: SectionId;
  title: string;
  eyebrow: string;
};
