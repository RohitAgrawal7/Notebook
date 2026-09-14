"use client";

import { formatDeskNow } from "@/lib/folio";
import type { ReactNode } from "react";
import { PageControls } from "./PageControls";
import { PinnedRail, PinnedStrip } from "./PinnedRail";
import { RegisterBar } from "./RegisterBar";
import { SectionTabs } from "./SectionTabs";

export function FolioShell({ children }: { children: ReactNode }) {
  return (
    <div className="desk-grain app-chrome min-h-full">
      <div className="mx-auto flex min-h-screen max-w-[1280px] flex-col px-3 py-4 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4 px-1 text-[#f3e6cf]">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-gold">
              Personal register · Vol. I
            </p>
            <h1 className="mt-1 font-serif text-3xl tracking-tight sm:text-[2.5rem]">
              The Folio
            </h1>
          </div>
          <div className="max-w-sm text-right">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold/70">
              {formatDeskNow()}
            </p>
            <p className="mt-2 font-serif text-sm leading-6 text-gold/75">
              Notebook, diary, and report files on one spine. Turn the leaf.
              File the finished thought.
            </p>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 lg:flex-row">
          <Spine />
          <PinnedRail />
          <div className="min-w-0 flex-1">
            <RegisterBar />
            <PinnedStrip />
            <SectionTabs />
            <div className="relative rounded-b-[6px] rounded-tr-[6px] border border-[#c4a06a]/15 bg-[#2a1810]/50 p-3 shadow-[0_28px_70px_rgba(0,0,0,0.4)] sm:p-6">
              {children}
              <PageControls />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Spine() {
  return (
    <div className="spine-leather relative hidden w-16 shrink-0 overflow-hidden rounded-sm border border-black/40 shadow-[8px_0_22px_rgba(0,0,0,0.4)] xl:block">
      <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-r from-black/50 to-transparent" />
      <div className="flex h-full flex-col items-center justify-between py-8">
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-gold/70 [writing-mode:vertical-rl] rotate-180">
          Folio 2026
        </span>
        <div className="flex flex-col gap-10">
          {[0, 1, 2].map((ring) => (
            <span
              key={ring}
              className="block h-5 w-5 rounded-full border border-[#c4a06a]/45 bg-[radial-gradient(circle_at_30%_30%,#d9b57a,#5a3d20_62%,#1a100a)] shadow-[0_2px_4px_rgba(0,0,0,0.45)]"
            />
          ))}
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-gold/50 [writing-mode:vertical-rl] rotate-180">
          Vol. I
        </span>
      </div>
    </div>
  );
}
