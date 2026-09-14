"use client";

import { MissingLeaf } from "@/components/folio/MissingLeaf";
import { DeskFrame } from "@/components/layout/DeskFrame";
import { ReadingDesk } from "@/components/layout/ReadingDesk";
import { ReportBook } from "@/components/reports/ReportBook";
import { useFolio } from "@/lib/folio-context";
import { href } from "@/lib/routes";
import { useMemo } from "react";

export function ReportReaderPage({ id }: { id: string }) {
  const { reports } = useFolio();
  const item = useMemo(() => reports.find((file) => file.id === id), [id, reports]);

  return (
    <DeskFrame kicker="Acta" title="Reports">
      <ReadingDesk
        section="reports"
        currentId={item?.id}
        indexHref={href.reports}
        indexLabel="All reports"
        hideSpine
      >
        {item ? (
          <ReportBook file={item} />
        ) : (
          <MissingLeaf backHref={href.reports} backLabel="Return to reports" kind="report" />
        )}
      </ReadingDesk>
    </DeskFrame>
  );
}
