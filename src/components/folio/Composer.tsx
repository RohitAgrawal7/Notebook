"use client";

import { useFolio } from "@/lib/folio-context";
import { todayIso } from "@/lib/storage";
import { NOTE_CATEGORIES, REPORT_STATUSES } from "@/lib/types";
import { useState, type ReactNode } from "react";

export function Composer() {
  const { composer, closeComposer, notes, diaryEntries, reports, saveNote, saveDiary, saveReport } =
    useFolio();
  if (!composer.open) return null;

  const editing =
    composer.mode === "edit" && composer.id
      ? composer.section === "notebook"
        ? notes.find((item) => item.id === composer.id)
        : composer.section === "diary"
          ? diaryEntries.find((item) => item.id === composer.id)
          : reports.find((item) => item.id === composer.id)
      : undefined;

  return (
    <div className="folio-modal no-print" role="dialog" aria-modal="true" aria-labelledby="composer-title">
      <div className="folio-modal-sheet paper-grain">
        <header className="mb-5 flex items-start justify-between gap-4 border-b border-ink/10 pb-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
              {composer.mode === "create" ? "New leaf" : "Revise leaf"}
            </p>
            <h2 id="composer-title" className="font-serif text-2xl text-ink">
              {composer.section === "notebook"
                ? "Notebook"
                : composer.section === "diary"
                  ? "Diary volume"
                  : "Report filing"}
            </h2>
          </div>
          <button type="button" className="folio-ghost" onClick={closeComposer}>
            Close
          </button>
        </header>
        {composer.section === "notebook" ? (
          <NoteForm
            key={composer.id ?? "new-note"}
            initial={editing && "category" in editing ? editing : undefined}
            onCancel={closeComposer}
            onSave={(draft) => saveNote(draft, composer.mode === "edit" ? composer.id : undefined)}
          />
        ) : null}
        {composer.section === "diary" ? (
          <DiaryForm
            key={composer.id ?? "new-diary"}
            initial={editing && "mood" in editing ? editing : undefined}
            onCancel={closeComposer}
            onSave={(draft) => saveDiary(draft, composer.mode === "edit" ? composer.id : undefined)}
          />
        ) : null}
        {composer.section === "reports" ? (
          <ReportForm
            key={composer.id ?? "new-report"}
            initial={editing && "code" in editing ? editing : undefined}
            folders={reports.map((file) => file.folder)}
            onCancel={closeComposer}
            onSave={(draft) => saveReport(draft, composer.mode === "edit" ? composer.id : undefined)}
          />
        ) : null}
      </div>
    </div>
  );
}

function NoteForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: { title: string; summary: string; body: string; category: (typeof NOTE_CATEGORIES)[number]; date: string; tags: string[] };
  onSave: (draft: { title: string; summary: string; body: string; category: (typeof NOTE_CATEGORIES)[number]; date: string; tags: string }) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [summary, setSummary] = useState(initial?.summary ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [category, setCategory] = useState(initial?.category ?? NOTE_CATEGORIES[0]);
  const [date, setDate] = useState(initial?.date ?? todayIso());
  const [tags, setTags] = useState(initial?.tags.join(", ") ?? "");

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        onSave({ title, summary, body, category, date, tags });
      }}
    >
      <Field label="Title">
        <input className="folio-field" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Date">
          <input className="folio-field" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <Field label="Category">
          <select className="folio-field" value={category} onChange={(e) => setCategory(e.target.value as typeof category)}>
            {NOTE_CATEGORIES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Summary">
        <textarea className="folio-field min-h-16" value={summary} onChange={(e) => setSummary(e.target.value)} />
      </Field>
      <Field label="Body">
        <textarea className="folio-field min-h-32" value={body} onChange={(e) => setBody(e.target.value)} />
      </Field>
      <Field label="Tags, comma separated">
        <input className="folio-field" value={tags} onChange={(e) => setTags(e.target.value)} />
      </Field>
      <Actions onCancel={onCancel} />
    </form>
  );
}

function DiaryForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: { title: string; place: string; mood: string; date: string; body: string[] };
  onSave: (draft: { title: string; place: string; mood: string; date: string; body: string }) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [place, setPlace] = useState(initial?.place ?? "");
  const [mood, setMood] = useState(initial?.mood ?? "Steady");
  const [date, setDate] = useState(initial?.date ?? todayIso());
  const [body, setBody] = useState(initial?.body.join("\n\n") ?? "");

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        onSave({ title, place, mood, date, body });
      }}
    >
      <Field label="Title">
        <input className="folio-field" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </Field>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Date">
          <input className="folio-field" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <Field label="Place">
          <input className="folio-field" value={place} onChange={(e) => setPlace(e.target.value)} />
        </Field>
        <Field label="Mood">
          <input className="folio-field" value={mood} onChange={(e) => setMood(e.target.value)} />
        </Field>
      </div>
      <Field label="Entry — blank line starts a new paragraph">
        <textarea className="folio-field min-h-40" value={body} onChange={(e) => setBody(e.target.value)} />
      </Field>
      <Actions onCancel={onCancel} />
    </form>
  );
}

function ReportForm({
  initial,
  folders,
  onSave,
  onCancel,
}: {
  initial?: {
    code?: string;
    title: string;
    folder: string;
    status: (typeof REPORT_STATUSES)[number];
    author: string;
    recipient: string;
    date: string;
    summary: string;
    sections: { heading: string; paragraphs: string[] }[];
  };
  folders: string[];
  onSave: (draft: {
    title: string;
    folder: string;
    status: (typeof REPORT_STATUSES)[number];
    author: string;
    recipient: string;
    date: string;
    summary: string;
    heading: string;
    body: string;
  }) => void;
  onCancel: () => void;
}) {
  const first = initial?.sections[0];
  const [title, setTitle] = useState(initial?.title ?? "");
  const [folder, setFolder] = useState(initial?.folder ?? "Studies");
  const [status, setStatus] = useState(initial?.status ?? "draft");
  const [author, setAuthor] = useState(initial?.author ?? "A. Sen");
  const [recipient, setRecipient] = useState(initial?.recipient ?? "Studio review");
  const [date, setDate] = useState(initial?.date ?? todayIso());
  const [summary, setSummary] = useState(initial?.summary ?? "");
  const [heading, setHeading] = useState(first?.heading ?? "1. Purpose");
  const [body, setBody] = useState(first?.paragraphs.join("\n\n") ?? "");
  const folderChoices = [...new Set(folders.filter(Boolean))];

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        onSave({ title, folder, status, author, recipient, date, summary, heading, body });
      }}
    >
      {initial?.code ? (
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">
          Ref · {initial.code}
        </p>
      ) : null}
      <Field label="Title">
        <input className="folio-field" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </Field>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Folder">
          <input
            className="folio-field"
            list="report-folders"
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
          />
          <datalist id="report-folders">
            {folderChoices.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
        </Field>
        <Field label="Status">
          <select className="folio-field" value={status} onChange={(e) => setStatus(e.target.value as typeof status)}>
            {REPORT_STATUSES.map((item) => (
              <option key={item} value={item}>
                {item === "draft" ? "Draft" : item === "review" ? "In review" : "Filed"}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Date of filing">
          <input className="folio-field" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="From">
          <input className="folio-field" value={author} onChange={(e) => setAuthor(e.target.value)} />
        </Field>
        <Field label="Distribution / To">
          <input className="folio-field" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
        </Field>
      </div>
      <Field label="Abstract">
        <textarea className="folio-field min-h-16" value={summary} onChange={(e) => setSummary(e.target.value)} />
      </Field>
      {!initial ? (
        <>
          <Field label="Opening section">
            <input className="folio-field" value={heading} onChange={(e) => setHeading(e.target.value)} />
          </Field>
          <Field label="Opening text">
            <textarea className="folio-field min-h-32" value={body} onChange={(e) => setBody(e.target.value)} />
          </Field>
        </>
      ) : (
        <p className="font-serif text-sm text-ink-soft">
          Body text is revised on the letter itself. This form updates the filing header.
        </p>
      )}
      <Actions onCancel={onCancel} submitLabel="File this report" />
    </form>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">
        {label}
      </span>
      {children}
    </label>
  );
}

function Actions({ onCancel, submitLabel = "File this leaf" }: { onCancel: () => void; submitLabel?: string }) {
  return (
    <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
      <button type="button" className="folio-ghost" onClick={onCancel}>
        Cancel
      </button>
      <button type="submit" className="folio-solid">
        {submitLabel}
      </button>
    </div>
  );
}

export function ConfirmDialog() {
  const { confirm, cancelDelete, confirmDelete } = useFolio();
  if (!confirm.open) return null;
  return (
    <div className="folio-modal no-print" role="alertdialog" aria-modal="true">
      <div className="folio-modal-sheet paper-grain max-w-md">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-stamp">Remove leaf</p>
        <h2 className="mt-2 font-serif text-2xl">Delete “{confirm.title}”?</h2>
        <p className="mt-3 font-serif text-ink-soft">
          The page leaves the register. Pins and PDF selections for it are cleared.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" className="folio-ghost" onClick={cancelDelete}>
            Keep
          </button>
          <button type="button" className="folio-solid" onClick={confirmDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

