"use client";

import { FileCover } from "@/components/catalog/LibraryCovers";
import { DeskFrame } from "@/components/layout/DeskFrame";
import { LibraryShelf } from "@/components/layout/LibraryShelf";
import { EmptyCabinet } from "@/components/catalog/EmptyCabinet";
import { catalogReports } from "@/lib/catalog";
import { formatShortDate } from "@/lib/folio";
import { useFolio } from "@/lib/folio-context";
import { REPORT_STATUS_LABEL } from "@/lib/reports";
import { href } from "@/lib/routes";
import { useRouter } from "@/lib/router";
import { REPORT_STATUSES, type ReportStatus } from "@/lib/types";
import { useMemo, useState } from "react";

export function ReportsIndexPage() {
  const { reports, openComposer } = useFolio();
  const { go } = useRouter();
  const [status, setStatus] = useState<ReportStatus | "All">("All");
  const files = useMemo(() => catalogReports(reports), [reports]);
  const visible = useMemo(
    () => (status === "All" ? files : files.filter((file) => file.status === status)),
    [files, status],
  );
  const folders = useMemo(() => [...new Set(visible.map((file) => file.folder))], [visible]);
  const tallies = useMemo(
    () => ({
      draft: files.filter((file) => file.status === "draft").length,
      review: files.filter((file) => file.status === "review").length,
      filed: files.filter((file) => file.status === "filed").length,
    }),
    [files],
  );

  return (
    <DeskFrame
      kicker="Acta"
      title="Reports"
      deck="The records cabinet. Filter by status, open a file, and the letterhead fills from the register — reference, distribution, and stamp."
    >
      <LibraryShelf
        section="reports"
        latin="Acta"
        title="The cabinet"
        count={`${files.length} ${files.length === 1 ? "file" : "files"} · ${tallies.filed} filed · ${tallies.review} in review · ${tallies.draft} draft`}
        onAdd={() => openComposer("reports", "create")}
      >
        {files.length === 0 ? (
          <EmptyCabinet label="The filing cabinet is empty." />
        ) : (
          <div className="space-y-8">
            <div className="flex flex-wrap gap-2">
              <StatusFilter
                label="All files"
                active={status === "All"}
                onClick={() => setStatus("All")}
              />
              {REPORT_STATUSES.map((item) => (
                <StatusFilter
                  key={item}
                  label={`${REPORT_STATUS_LABEL[item]} · ${tallies[item]}`}
                  active={status === item}
                  onClick={() => setStatus(item)}
                />
              ))}
            </div>
            {visible.length === 0 ? (
              <p className="font-serif text-sm text-[#f3e6cf]/70">No files in this status.</p>
            ) : (
              folders.map((folder) => {
                const contents = visible.filter((file) => file.folder === folder);
                return (
                  <section key={folder}>
                    <div className="mb-3 flex items-end gap-3">
                      <span className="inline-block rounded-t-md border border-b-0 border-gold/25 bg-manila px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink">
                        {folder}
                      </span>
                      <span className="mb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-gold/55">
                        {contents.length} {contents.length === 1 ? "file" : "files"}
                      </span>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {contents.map((file) => (
                        <FileCover
                          key={file.id}
                          code={file.code}
                          title={file.title}
                          subject={file.folder}
                          date={formatShortDate(file.date)}
                          author={file.author}
                          status={file.status}
                          onOpen={() => go(href.report(file.id))}
                        />
                      ))}
                    </div>
                  </section>
                );
              })
            )}
          </div>
        )}
      </LibraryShelf>
    </DeskFrame>
  );
}

function StatusFilter({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-sm border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] ${
        active
          ? "border-gold bg-gold/15 text-gold"
          : "border-gold/25 text-gold/70 hover:border-gold/55 hover:text-gold"
      }`}
    >
      {label}
    </button>
  );
}
