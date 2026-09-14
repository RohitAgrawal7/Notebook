"use client";

import { Composer, ConfirmDialog } from "@/components/folio/Composer";
import { PdfPrintRoot, PdfStudio } from "@/components/folio/PdfStudio";
import { FolioProvider } from "@/lib/folio-context";
import { InkProvider } from "@/lib/ink-context";
import { parseSection } from "@/lib/folio";
import { hrefFor, type AppRoute } from "@/lib/routes";
import { RouterProvider, useRouter } from "@/lib/router";
import { DashboardPage } from "@/pages/DashboardPage";
import { DiaryIndexPage } from "@/pages/DiaryIndexPage";
import { DiaryReaderPage } from "@/pages/DiaryReaderPage";
import { NotebookIndexPage } from "@/pages/NotebookIndexPage";
import { NotebookReaderPage } from "@/pages/NotebookReaderPage";
import { ReportReaderPage } from "@/pages/ReportReaderPage";
import { ReportsIndexPage } from "@/pages/ReportsIndexPage";
import { useEffect } from "react";

export function FolioApp() {
  return (
    <RouterProvider>
      <RoutedFolio />
    </RouterProvider>
  );
}

function RoutedFolio() {
  const { go, route } = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get("section");
    if (!fromQuery) return;
    go(hrefFor(parseSection(fromQuery)));
  }, [go]);

  return (
    <FolioProvider initialSection="notebook" initialPage={1} navigate={go}>
      <InkProvider>
        <AppRoutes route={route} />
        <Composer />
        <ConfirmDialog />
        <PdfStudio />
        <PdfPrintRoot />
      </InkProvider>
    </FolioProvider>
  );
}

function AppRoutes({ route }: { route: AppRoute }) {
  if (route.name === "notebook-index") return <NotebookIndexPage />;
  if (route.name === "notebook-read") return <NotebookReaderPage id={route.id} />;
  if (route.name === "diary-index") return <DiaryIndexPage />;
  if (route.name === "diary-read") return <DiaryReaderPage id={route.id} />;
  if (route.name === "reports-index") return <ReportsIndexPage />;
  if (route.name === "report-read") return <ReportReaderPage id={route.id} />;
  return <DashboardPage />;
}
