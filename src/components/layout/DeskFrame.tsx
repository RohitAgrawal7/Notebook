"use client";

import { formatDeskNow } from "@/lib/folio";
import { href } from "@/lib/routes";
import { useRouter } from "@/lib/router";
import type { ReactNode } from "react";

export function DeskFrame({
  children,
  kicker,
  title,
  deck,
}: {
  children: ReactNode;
  kicker?: string;
  title?: string;
  deck?: string;
}) {
  const { go, path } = useRouter();

  return (
    <div className="desk-grain app-chrome min-h-full">
      <div className="mx-auto flex min-h-screen max-w-[1240px] flex-col px-4 py-5 sm:px-8 sm:py-8">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4 text-[#f3e6cf]">
          <button type="button" className="text-left" onClick={() => go(href.home)}>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-gold">
              {kicker ?? "Personal register"}
            </p>
            <h1 className="mt-1 font-serif text-3xl tracking-tight sm:text-4xl">
              {title ?? "The Folio"}
            </h1>
          </button>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold/70">
            {formatDeskNow()}
          </p>
        </header>

        <nav className="mb-6 flex flex-wrap gap-2" aria-label="Libraries">
          <NavChip label="Dashboard" to={href.home} active={path === "/"} go={go} />
          <NavChip
            label="Notebook"
            to={href.notebooks}
            active={path.startsWith("/notebook")}
            go={go}
          />
          <NavChip label="Diary" to={href.diaries} active={path.startsWith("/diary")} go={go} />
          <NavChip
            label="Reports"
            to={href.reports}
            active={path.startsWith("/reports")}
            go={go}
          />
        </nav>

        {deck ? (
          <p className="mb-6 max-w-2xl font-serif text-[#f3e6cf]/80 leading-7">{deck}</p>
        ) : null}

        {children}
      </div>
    </div>
  );
}

function NavChip({
  label,
  to,
  active,
  go,
}: {
  label: string;
  to: string;
  active: boolean;
  go: (to: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => go(to)}
      className={`rounded-sm border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] ${
        active
          ? "border-gold bg-gold/15 text-gold"
          : "border-gold/25 text-[#f3e6cf]/80 hover:border-gold/50"
      }`}
    >
      {label}
    </button>
  );
}
