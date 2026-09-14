"use client";

import { LeafTools } from "@/components/folio/LeafTools";
import { PaperSheet } from "@/components/folio/PaperSheet";
import { ReportArticle } from "@/components/reports/ReportArticle";
import { StatusStamp } from "@/components/reports/StatusStamp";
import { formatLongDate } from "@/lib/folio";
import { useFolio } from "@/lib/folio-context";
import { href } from "@/lib/routes";
import { useRouter } from "@/lib/router";
import type { ReportFile } from "@/lib/types";

export function ReportView() {
  const { leaf } = useFolio();
  if (leaf.kind === "index") {
    return <ReportIndex files={leaf.files} folders={leaf.folders} />;
  }
  if (leaf.kind === "document") {
    return (
      <PaperSheet paper="letter" eyebrow={`${leaf.file.folder} · ${leaf.file.code}`} folio={leaf.file.code}>
        <ReportArticle file={leaf.file} />
      </PaperSheet>
    );
  }
  return null;
}

function ReportIndex({
  files,
  folders,
}: {
  files: ReportFile[];
  folders: string[];
}) {
  const { isPinned } = useFolio();
  const { go } = useRouter();

  return (
    <PaperSheet paper="letter" eyebrow="Report Files · Acta" title="Filing index" folio="Register">
      <p className="max-w-prose font-serif text-[17px] leading-7 text-ink-soft">
        Drawer, folder, leaf. Open a file to place it on the desk.
      </p>

      <div className="mt-8 space-y-7">
        {folders.map((folder) => {
          const contents = files.filter((file) => file.folder === folder);
          return (
            <section key={folder}>
              <div className="mb-3 flex items-end gap-3">
                <span className="inline-block rounded-t-md border border-b-0 border-ink/15 bg-manila px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink">
                  {folder}
                </span>
                <span className="mb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft">
                  {contents.length} {contents.length === 1 ? "file" : "files"}
                </span>
              </div>
              <ul className="divide-y divide-ink/10 border border-ink/10 bg-[#f7edd8]">
                {contents.map((file) => (
                  <li key={file.id}>
                    <button
                      type="button"
                      onClick={() => go(href.report(file.id))}
                      className="grid w-full grid-cols-1 gap-1 px-4 py-3 text-left transition hover:bg-[#efe2c4] sm:grid-cols-[6.5rem_1fr_auto] sm:items-center sm:gap-4"
                    >
                      <span className="font-mono text-[11px] text-ink-soft">{file.code}</span>
                      <span>
                        <span className="block font-serif text-lg leading-6 text-ink">
                          {file.title}
                        </span>
                        <span className="mt-1 block font-serif text-sm text-ink-soft">
                          {file.author} · {formatLongDate(file.date)}
                          {isPinned(file.id) ? " · pinned" : ""}
                        </span>
                      </span>
                      <StatusStamp status={file.status} />
                    </button>
                    <div className="px-4 pb-3">
                      <LeafTools section="reports" id={file.id} title={file.title} />
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </PaperSheet>
  );
}
