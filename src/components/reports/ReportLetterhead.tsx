"use client";

import { StatusStamp } from "@/components/reports/StatusStamp";
import { formatLongDate } from "@/lib/folio";
import { REPORT_STATUS_LABEL } from "@/lib/reports";
import type { ReportFile } from "@/lib/types";

export function ReportLetterhead({
  file,
  leafNumber,
  pageCount,
  headings = [],
}: {
  file: ReportFile;
  leafNumber: number;
  pageCount: number;
  headings?: string[];
}) {
  if (leafNumber > 1) {
    return (
      <header className="report-runhead">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">
            {file.code} · {file.folder}
          </p>
          <p className="mt-1 truncate font-serif text-sm text-ink">{file.title}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <StatusStamp status={file.status} />
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft">
            Sheet {leafNumber} of {pageCount}
          </span>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="report-masthead">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-soft">
              The Folio records office
            </p>
            <p className="mt-1 font-serif text-xl tracking-tight text-ink">Acta · Internal filing</p>
          </div>
          <StatusStamp status={file.status} large />
        </div>
        <dl className="report-meta">
          <Meta label="Ref" value={file.code} />
          <Meta label="Folder" value={file.folder} />
          <Meta label="Date" value={formatLongDate(file.date)} />
          <Meta label="Status" value={REPORT_STATUS_LABEL[file.status]} />
          <Meta label="From" value={file.author} wide />
          <Meta label="To" value={file.recipient} wide />
        </dl>
      </header>
      <h1 className="mt-6 font-serif text-[1.85rem] leading-tight tracking-tight text-ink">{file.title}</h1>
      {file.summary ? (
        <section className="report-abstract">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">Abstract</p>
          <p className="mt-2 font-serif text-[17px] leading-7 text-ink">{file.summary}</p>
        </section>
      ) : null}
      {headings.length > 1 ? (
        <section className="report-toc">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">
            Contents of this file
          </p>
          <ol className="mt-2 space-y-1">
            {headings.map((heading) => (
              <li key={heading} className="font-serif text-sm leading-6 text-ink-soft">
                {heading}
              </li>
            ))}
          </ol>
        </section>
      ) : null}
    </>
  );
}

function Meta({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={wide ? "report-meta-wide" : undefined}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
