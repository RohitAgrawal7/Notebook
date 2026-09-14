"use client";

import { DiaryPrintLeaf, NotebookPrintLeaf, ReportPrintLeaf } from "@/components/folio/LinedLeaf";
import { useFolio } from "@/lib/folio-context";

export function PdfStudio() {
  const { pdfOpen, setPdfOpen, selectedLeaves, selected, clearSelection } = useFolio();
  if (!pdfOpen) return null;

  const total = selectedLeaves.length;

  return (
    <div className="folio-modal no-print" role="dialog" aria-modal="true" aria-labelledby="pdf-title">
      <div className="folio-modal-sheet paper-grain max-w-4xl">
        <header className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-ink/10 pb-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
              Selected leaves
            </p>
            <h2 id="pdf-title" className="font-serif text-2xl">
              PDF preview · {total} {total === 1 ? "sheet" : "sheets"}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="folio-ghost" onClick={clearSelection}>
              Clear
            </button>
            <button type="button" className="folio-ghost" onClick={() => setPdfOpen(false)}>
              Close
            </button>
            <button type="button" className="folio-solid" onClick={() => window.print()}>
              Download / Print PDF
            </button>
          </div>
        </header>
        <p className="mb-4 font-serif text-sm text-ink-soft">
          Each marked notebook, diary, or report leaf becomes one PDF sheet. Page 11 stays page 11,
          with the same forty lines and the same writing. In the print dialog choose “Save as PDF”.
        </p>
        <div className="folio-scroll max-h-[60vh] space-y-8 pr-1">
          {selected.size === 0 && selectedLeaves.length === 0 ? (
            <p className="font-serif text-ink-soft">Mark a leaf with the PDF box in the sidebar.</p>
          ) : (
            <PdfPages />
          )}
        </div>
      </div>
    </div>
  );
}

export function PdfPrintRoot() {
  const { selected, selectedLeaves } = useFolio();
  if (selected.size === 0 && selectedLeaves.length === 0) return null;
  return (
    <div className="pdf-print-root">
      <PdfPages />
      <p className="hidden">{selectedLeaves.length}</p>
    </div>
  );
}

function PdfPages() {
  const { selectedLeaves } = useFolio();
  return (
    <div className="pdf-pages">
      {selectedLeaves.map((leaf) => {
        if (leaf.kind === "notebook") {
          return (
            <NotebookPrintLeaf
              key={leaf.page.id}
              note={leaf.note}
              page={leaf.page}
              leafNumber={leaf.index + 1}
              pageCount={leaf.pageCount}
            />
          );
        }
        if (leaf.kind === "diary") {
          return (
            <DiaryPrintLeaf
              key={leaf.page.id}
              entry={leaf.entry}
              page={leaf.page}
              leafNumber={leaf.index + 1}
              pageCount={leaf.pageCount}
            />
          );
        }
        return (
          <ReportPrintLeaf
            key={leaf.page.id}
            file={leaf.file}
            page={leaf.page}
            leafNumber={leaf.index + 1}
            pageCount={leaf.pageCount}
          />
        );
      })}
    </div>
  );
}
