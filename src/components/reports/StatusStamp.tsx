"use client";

import { REPORT_STATUS_LABEL } from "@/lib/reports";
import type { ReportStatus } from "@/lib/types";

export function StatusStamp({
  status,
  large = false,
}: {
  status: ReportStatus;
  large?: boolean;
}) {
  return (
    <span
      className={`report-stamp report-stamp-${status} inline-flex rotate-[-7deg] rounded-sm border-2 px-2 py-0.5 font-mono font-semibold uppercase tracking-[0.18em] ${
        large ? "text-xs" : "text-[10px]"
      }`}
    >
      {REPORT_STATUS_LABEL[status]}
    </span>
  );
}
