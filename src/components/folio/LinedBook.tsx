"use client";

import { FolioEditor } from "@/components/folio/FolioEditor";
import { InkCanvas } from "@/components/folio/InkCanvas";
import { InkToolbar } from "@/components/folio/InkToolbar";
import { NotebookRules } from "@/components/folio/LinedLeaf";
import { TypeToolbar } from "@/components/folio/TypeToolbar";
import { useFolio } from "@/lib/folio-context";
import { blankPage, NOTEBOOK_LINES, pagePreview } from "@/lib/notebook-pages";
import { htmlToPlain, splitOverflowHtml } from "@/lib/rich-text";
import type { InkStroke, NotePage, SectionId } from "@/lib/types";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

export function LinedBook({
  section,
  bookId,
  title,
  pages,
  onPersist,
  header,
  closing,
  editLabel,
  deleteLabel,
  paper = "ruled",
  indexKicker = "Contents",
  unitSingular = "leaf",
  unitPlural = "leaves",
  addLabel = "+ New page",
  pdfHint = "Mark a leaf. Only marked leaves are printed, as they appear on the paper.",
  pagePrefix = "Page",
}: {
  section: SectionId;
  bookId: string;
  title: string;
  pages: NotePage[];
  onPersist: (pages: NotePage[]) => void;
  header: (leafNumber: number, pageCount: number) => ReactNode;
  closing?: ReactNode;
  editLabel: string;
  deleteLabel: string;
  paper?: "ruled" | "plain" | "letter";
  indexKicker?: string;
  unitSingular?: string;
  unitPlural?: string;
  addLabel?: string;
  pdfHint?: string;
  pagePrefix?: string;
}) {
  const {
    isPinned,
    togglePin,
    isStarred,
    toggleStar,
    openComposer,
    askDelete,
    isSelected,
    toggleSelect,
    selectMany,
    selected,
    selectedLeaves,
    setPdfOpen,
    setActiveLeafId,
  } = useFolio();
  const pagesRef = useRef(pages);
  pagesRef.current = pages;
  const [pageIndex, setPageIndex] = useState(0);
  const [text, setText] = useState(() => pages[0]?.text ?? "");
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [confirmLeaf, setConfirmLeaf] = useState<number | null>(null);
  const [contentsOpen, setContentsOpen] = useState(false);
  const areaRef = useRef<HTMLDivElement>(null);
  const pageIndexRef = useRef(0);
  const bookPinned = isPinned(bookId);
  const bookStarred = isStarred(bookId);

  useEffect(() => {
    setPageIndex(0);
    setText(pagesRef.current[0]?.text ?? "");
  }, [bookId]);

  useEffect(() => {
    const leafId = pagesRef.current[Math.min(pageIndex, pagesRef.current.length - 1)]?.id ?? null;
    setActiveLeafId(leafId);
    return () => setActiveLeafId(null);
  }, [bookId, pageIndex, setActiveLeafId]);

  function fits() {
    const area = areaRef.current;
    if (!area || area.clientHeight < 24) return true;
    return area.scrollHeight <= area.clientHeight + 2;
  }

  function persist(nextPages: NotePage[]) {
    const cleaned = nextPages.length ? nextPages : [blankPage()];
    pagesRef.current = cleaned;
    onPersist(cleaned);
    return cleaned;
  }

  function write(value: string) {
    const current = [...pagesRef.current];
    while (current.length <= pageIndex) current.push(blankPage());
    const area = areaRef.current;
    if (!area || fits()) {
      current[pageIndex] = { ...current[pageIndex], text: value };
      setText(value);
      persist(current);
      return;
    }
    const { keep, rest } = splitOverflowHtml(area);
    current[pageIndex] = { ...current[pageIndex], text: keep };
    current.splice(pageIndex + 1, 0, { ...blankPage(), text: rest });
    persist(current);
    setDirection("next");
    setPageIndex(pageIndex + 1);
    setText(rest);
  }

  useLayoutEffect(() => {
    const area = areaRef.current;
    if (!area) return;
    if (fits()) return;
    write(area.innerHTML);
  }, [pageIndex, bookId]);

  function editorHtml() {
    return areaRef.current?.innerHTML ?? text;
  }

  function addPage() {
    const current = [...pagesRef.current];
    current[pageIndex] = { ...current[pageIndex], text: editorHtml() };
    current.splice(pageIndex + 1, 0, blankPage());
    persist(current);
    setDirection("next");
    setPageIndex(pageIndex + 1);
    setText("");
    requestAnimationFrame(() => areaRef.current?.focus());
  }

  function goPage(next: number) {
    const current = [...pagesRef.current];
    current[pageIndex] = { ...current[pageIndex], text: editorHtml() };
    persist(current);
    setDirection(next > pageIndex ? "next" : "prev");
    setPageIndex(next);
    setText(current[next]?.text ?? "");
    setContentsOpen(false);
    requestAnimationFrame(() => areaRef.current?.focus());
  }

  function patchPage(index: number, patch: Partial<NotePage>) {
    const current = [...pagesRef.current];
    current[index] = { ...current[index], ...patch };
    persist(current);
  }

  function deletePage(index: number) {
    const current = [...pagesRef.current];
    current[pageIndex] = { ...current[pageIndex], text: editorHtml() };
    if (current.length <= 1) {
      current[0] = { ...current[0], text: "", pinned: false, starred: false, italic: false, underline: false, ink: [] };
      persist(current);
      setText("");
      setPageIndex(0);
      setConfirmLeaf(null);
      return;
    }
    current.splice(index, 1);
    persist(current);
    const nextIndex = Math.min(index, current.length - 1);
    setPageIndex(nextIndex);
    setText(current[nextIndex]?.text ?? "");
    setConfirmLeaf(null);
  }

  const pageCount = Math.max(pagesRef.current.length, 1);
  const safeIndex = Math.min(pageIndex, pageCount - 1);
  pageIndexRef.current = safeIndex;
  const currentPage = pagesRef.current[safeIndex];
  const ruled = paper === "ruled";
  const letter = paper === "letter";
  const sheetClass = ruled ? "notebook-sheet" : letter ? "letter-sheet" : "diary-sheet";
  const innerClass = ruled ? "notebook-inner" : letter ? "letter-inner" : "diary-inner";
  const handClass = ruled ? "notebook-hand" : letter ? "letter-hand" : "diary-hand";

  return (
    <div className="notebook-spread">
      <div className="notebook-index-slot no-print">
        <aside className={`notebook-index${contentsOpen ? " is-open" : ""}`}>
          <div className="notebook-index-head">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold/70">{indexKicker}</p>
                <h2 className="mt-1 font-serif text-lg leading-snug text-[#f6ead4]">{title}</h2>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-gold/55">
                  {pageCount} {pageCount === 1 ? unitSingular : unitPlural}
                  <span className="notebook-current-chip">
                    {" "}
                    · {pagePrefix} {safeIndex + 1}
                  </span>
                </p>
              </div>
              <button
                type="button"
                className="notebook-contents-toggle folio-desk-btn shrink-0"
                aria-expanded={contentsOpen}
                onClick={() => setContentsOpen((open) => !open)}
              >
                {contentsOpen ? "Hide" : "Contents"}
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <IconAction
                label={bookStarred ? "Unstar book" : "Star book"}
                active={bookStarred}
                onClick={() => toggleStar(bookId)}
              >
                {bookStarred ? "★" : "☆"} Star
              </IconAction>
              <IconAction
                label={bookPinned ? "Unpin book" : "Pin book"}
                active={bookPinned}
                onClick={() => togglePin(bookId)}
              >
                {bookPinned ? "◆" : "◇"} Pin
              </IconAction>
              <IconAction label={editLabel} onClick={() => openComposer(section, "edit", bookId)}>
                Edit
              </IconAction>
              <IconAction label={deleteLabel} danger onClick={() => askDelete(section, bookId, title)}>
                Delete
              </IconAction>
            </div>
          </div>

          <div className="notebook-index-extra">
          <div className="notebook-pdf-bar">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold/80">PDF</p>
            <p className="notebook-pdf-hint mt-1 font-serif text-[13px] leading-5 text-[#f6ead4]/80">{pdfHint}</p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-gold/55">
              {pagesRef.current.filter((page) => isSelected(page.id)).length} marked in this book
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <IconAction
                label="Select all pages"
                onClick={() => selectMany(pagesRef.current.map((page) => page.id))}
              >
                Select all
              </IconAction>
              <IconAction
                label="Clear PDF marks"
                onClick={() => {
                  pagesRef.current.forEach((page) => {
                    if (isSelected(page.id)) toggleSelect(page.id);
                  });
                }}
              >
                Clear
              </IconAction>
              <IconAction
                label="Preview PDF"
                active={selectedLeaves.length > 0 || selected.size > 0}
                onClick={() => {
                  const current = [...pagesRef.current];
                  current[pageIndex] = { ...current[pageIndex], text: editorHtml() };
                  persist(current);
                  setPdfOpen(true);
                }}
              >
                Preview
              </IconAction>
            </div>
          </div>

          <button type="button" className="folio-desk-btn w-full shrink-0" onClick={addPage}>
            {addLabel}
          </button>

          <ul className="notebook-index-list">
            {pagesRef.current.map((page, index) => {
              const active = index === safeIndex;
              return (
                <li key={page.id}>
                  <div className={`notebook-leaf-card ${active ? "is-current" : ""} ${page.pinned ? "is-pinned" : ""}`}>
                    <button type="button" className="notebook-leaf-open" onClick={() => goPage(index)}>
                      <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-gold/65">
                        {pagePrefix} {String(index + 1).padStart(2, "0")}
                        {page.starred ? " · ★" : ""}
                        {page.pinned ? " · pin" : ""}
                      </span>
                      <span className="mt-1 block font-serif text-sm leading-5 text-[#f6ead4]">
                        {pagePreview(index === safeIndex ? text : page.text)}
                      </span>
                    </button>
                    <div className="mt-2 flex flex-wrap gap-1">
                      <label className="notebook-pdf-mark">
                        <input
                          type="checkbox"
                          checked={isSelected(page.id)}
                          onChange={() => toggleSelect(page.id)}
                        />
                        PDF
                      </label>
                      <IconAction
                        label={page.starred ? "Unstar page" : "Star page"}
                        active={page.starred}
                        onClick={() => patchPage(index, { starred: !page.starred })}
                      >
                        {page.starred ? "★" : "☆"}
                      </IconAction>
                      <IconAction
                        label={page.pinned ? "Unpin page" : "Pin page"}
                        active={page.pinned}
                        onClick={() => patchPage(index, { pinned: !page.pinned })}
                      >
                        {page.pinned ? "◆" : "◇"}
                      </IconAction>
                      <IconAction
                        label="Edit page"
                        onClick={() => {
                          goPage(index);
                          requestAnimationFrame(() => areaRef.current?.focus());
                        }}
                      >
                        Edit
                      </IconAction>
                      {confirmLeaf === index ? (
                        <>
                          <IconAction label="Keep page" onClick={() => setConfirmLeaf(null)}>
                            Keep
                          </IconAction>
                          <IconAction label="Confirm delete" danger onClick={() => deletePage(index)}>
                            Confirm
                          </IconAction>
                        </>
                      ) : (
                        <IconAction
                          label="Delete page"
                          danger
                          onClick={() => {
                            if (!htmlToPlain(page.text).trim() && !(index === safeIndex && htmlToPlain(text).trim()) && !/<img/i.test(page.text) && !/<img/i.test(text)) {
                              deletePage(index);
                              return;
                            }
                            setConfirmLeaf(index);
                          }}
                        >
                          Delete
                        </IconAction>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          </div>
        </aside>
      </div>

      <div className="notebook-stage">
        <article
          className={`paper-grain paper-shadow ${sheetClass} relative overflow-hidden text-ink ${
            direction === "next" ? "turn-next" : "turn-prev"
          }`}
        >
          {letter ? null : (
            <div className="notebook-holes" aria-hidden>
              {[0, 1, 2].map((hole) => (
                <span key={hole} />
              ))}
            </div>
          )}
          {letter ? null : <div className="notebook-margin" aria-hidden />}

          <div className={innerClass}>
            {header(safeIndex + 1, pageCount)}

            <div className="mb-3 flex flex-col gap-2 no-print paper-tools">
              <div className="flex flex-wrap items-center gap-2">
                <button type="button" className="folio-tiny" onClick={addPage}>
                  {addLabel}
                </button>
                {ruled ? (
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft">
                    {NOTEBOOK_LINES} lines
                  </span>
                ) : null}
              </div>
              <TypeToolbar section={section} tone="paper" onApplied={() => write(editorHtml())} />
              {section === "notebook" ? <InkToolbar tone="paper" /> : null}
            </div>

            <div className={ruled ? "notebook-pad" : "prose-pad"}>
              {ruled ? <NotebookRules /> : null}
              <FolioEditor
                key={currentPage?.id ?? bookId}
                html={text}
                editorRef={areaRef}
                className={`${handClass} folio-editor`}
                ariaLabel={`${title} page ${safeIndex + 1}`}
                onChange={write}
                onSubmitPage={addPage}
              />
              {section === "notebook" ? (
                <InkCanvas
                  strokes={currentPage?.ink ?? []}
                  onChange={(next: InkStroke[]) => {
                    const index = pageIndexRef.current;
                    const current = [...pagesRef.current];
                    current[index] = { ...current[index], ink: next };
                    persist(current);
                  }}
                />
              ) : null}
            </div>

            {closing}

            <nav className="mt-4 flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft sm:gap-3">
              <button
                type="button"
                className="folio-tiny min-h-10"
                onClick={() => goPage(safeIndex - 1)}
                disabled={safeIndex <= 0}
              >
                ◀ <span className="hidden sm:inline">Previous {unitSingular}</span>
              </button>
              <span>
                {pagePrefix} {safeIndex + 1} / {pageCount}
              </span>
              <button
                type="button"
                className="folio-tiny min-h-10"
                onClick={() => {
                  if (safeIndex >= pageCount - 1) addPage();
                  else goPage(safeIndex + 1);
                }}
              >
                {safeIndex >= pageCount - 1
                  ? <><span className="hidden sm:inline">Next {unitSingular} · </span>new</>
                  : <>Next<span className="hidden sm:inline"> {unitSingular}</span> ▶</>}
              </button>
            </nav>
          </div>
        </article>
      </div>
    </div>
  );
}

function IconAction({
  children,
  onClick,
  label,
  active = false,
  danger = false,
}: {
  children: ReactNode;
  onClick: () => void;
  label: string;
  active?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className={`icon-action rounded-sm border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] ${
        danger
          ? "border-stamp/40 text-[#e8b4a8] hover:border-stamp"
          : active
            ? "border-gold bg-gold/20 text-gold"
            : "border-gold/25 text-gold/75 hover:border-gold/55 hover:text-gold"
      }`}
    >
      {children}
    </button>
  );
}
