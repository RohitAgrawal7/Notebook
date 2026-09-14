"use client";

import { LeafTools } from "@/components/folio/LeafTools";
import { StatusStamp } from "@/components/reports/StatusStamp";
import { PinToggle } from "@/components/ui/PinToggle";
import { formatLongDate } from "@/lib/folio";
import { useFolio } from "@/lib/folio-context";
import type { ReportFile } from "@/lib/types";

export function ReportArticle({ file }: { file: ReportFile }) {
  const { isPinned, togglePin } = useFolio();
  const pinned = isPinned(file.id);

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
            The Folio records office
          </p>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
            From {file.author}
          </p>
          <h2 className="mt-2 max-w-xl font-serif text-[1.85rem] leading-tight tracking-tight">
            {file.title}
          </h2>
          <p className="mt-3 font-serif text-sm leading-6 text-ink-soft">
            To {file.recipient}
            <br />
            {formatLongDate(file.date)}
          </p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <StatusStamp status={file.status} large />
          <PinToggle
            pressed={pinned}
            onToggle={() => togglePin(file.id)}
            label={`${pinned ? "Unpin" : "Pin"} ${file.title}`}
          />
        </div>
      </div>

      <p className="mt-6 max-w-prose border-l-2 border-ink/20 pl-4 font-serif text-[17px] leading-7 text-ink">
        {file.summary}
      </p>

      <div className="mt-8 space-y-7">
        {file.sections.map((section) => (
          <section key={section.heading}>
            <h3 className="font-serif text-xl text-ink">{section.heading}</h3>
            {section.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="mt-2 max-w-prose font-serif text-[16.5px] leading-[1.8] text-ink/90"
              >
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>

      <LeafTools section="reports" id={file.id} title={file.title} />

      <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft">
        Suitable for submission · {file.folder} · {file.code}
      </p>
    </div>
  );
}
