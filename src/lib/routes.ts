export type AppRoute =
  | { name: "home" }
  | { name: "notebook-index" }
  | { name: "notebook-read"; id: string }
  | { name: "diary-index" }
  | { name: "diary-read"; id: string }
  | { name: "reports-index" }
  | { name: "report-read"; id: string };

export const href = {
  home: "/",
  notebooks: "/notebook",
  notebook: (id: string) => `/notebook/${encodeURIComponent(id)}`,
  diaries: "/diary",
  diary: (id: string) => `/diary/${encodeURIComponent(id)}`,
  reports: "/reports",
  report: (id: string) => `/reports/${encodeURIComponent(id)}`,
};

export function parsePath(pathname: string): AppRoute {
  const parts = pathname.replace(/\/+$/, "").split("/").filter(Boolean);
  if (parts.length === 0) return { name: "home" };
  if (parts[0] === "notebook" && parts[1]) {
    return { name: "notebook-read", id: decodeURIComponent(parts[1]) };
  }
  if (parts[0] === "notebook") return { name: "notebook-index" };
  if (parts[0] === "diary" && parts[1]) {
    return { name: "diary-read", id: decodeURIComponent(parts[1]) };
  }
  if (parts[0] === "diary") return { name: "diary-index" };
  if (parts[0] === "reports" && parts[1]) {
    return { name: "report-read", id: decodeURIComponent(parts[1]) };
  }
  if (parts[0] === "reports") return { name: "reports-index" };
  return { name: "home" };
}

export function hrefFor(section: "notebook" | "diary" | "reports", id?: string) {
  if (section === "notebook") return id ? href.notebook(id) : href.notebooks;
  if (section === "diary") return id ? href.diary(id) : href.diaries;
  return id ? href.report(id) : href.reports;
}
