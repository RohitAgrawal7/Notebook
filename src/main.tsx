import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { FolioApp } from "@/components/folio/FolioApp";
import "@/app/globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <FolioApp />
  </StrictMode>,
);
