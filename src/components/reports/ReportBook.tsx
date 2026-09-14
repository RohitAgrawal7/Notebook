"use client";

import { LinedBook } from "@/components/folio/LinedBook";
import { ReportLeafHeader } from "@/components/folio/LinedLeaf";
import { useFolio } from "@/lib/folio-context";
import { hydrateReportPages } from "@/lib/notebook-pages";
import { collectReportHeadings } from "@/lib/reports";
import type { ReportFile } from "@/lib/types";

export function ReportBook({ file }: { file: ReportFile }) {
  const { updateReportPages } = useFolio();
  const pages = hydrateReportPages(file);
  const headings = collectReportHeadings(pages);

  return (
    <LinedBook
      section="reports"
      bookId={file.id}
      title={file.title}
      pages={pages}
      paper="letter"
      indexKicker="File register"
      unitSingular="sheet"
      unitPlural="sheets"
      addLabel="+ Add sheet"
      pagePrefix="Sheet"
      pdfHint="Mark a sheet. Only marked sheets are printed, as they appear on the letter."
      onPersist={(next) => updateReportPages(file.id, next)}
      editLabel="Revise filing"
      deleteLabel="Remove from cabinet"
      header={(leafNumber, pageCount) => (
        <ReportLeafHeader
          file={file}
          leafNumber={leafNumber}
          pageCount={pageCount}
          headings={headings}
        />
      )}
      closing={
        <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft">
          Filed for the record · {file.folder} · {file.code}
        </p>
      }
    />
  );
}
