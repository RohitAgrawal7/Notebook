import type { NotePage, ReportStatus } from "./types";
import { htmlToPlain } from "./rich-text";

export const REPORT_STATUS_LABEL: Record<ReportStatus, string> = {
  draft: "Draft",
  review: "In review",
  filed: "Filed",
};

export function isReportHeading(part: string) {
  const line = part.trim();
  return /^\d+\.\s+\S/.test(line) && !line.includes("\n") && line.length < 80;
}

export function collectReportHeadings(pages: Array<Pick<NotePage, "text">>) {
  const headings: string[] = [];
  for (const page of pages) {
    for (const part of htmlToPlain(page.text).split(/\n{2,}/)) {
      if (isReportHeading(part)) headings.push(part.trim());
    }
  }
  return headings;
}
