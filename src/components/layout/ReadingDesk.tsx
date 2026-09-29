"use client";

import { RegisterBar } from "@/components/folio/RegisterBar";
import { href } from "@/lib/routes";
import { useRouter } from "@/lib/router";
import type { SectionId } from "@/lib/types";
import type { ReactNode } from "react";

export function ReadingDesk({
  children,
  section,
  currentId,
  indexHref,
  indexLabel,
  hideSpine = false,
}: {
  children: ReactNode;
  section: SectionId;
  currentId?: string;
  indexHref: string;
  indexLabel: string;
  hideSpine?: boolean;
}) {
  const { go } = useRouter();

  return (
    <div className="flex flex-1 flex-col gap-6 lg:flex-row">
      {hideSpine ? null : <Spine />}
      <div className="min-w-0 flex-1">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => go(indexHref)}
            className="font-mono text-[10px] uppercase tracking-[0.16em] text-gold/80 underline decoration-gold/30 underline-offset-4 hover:text-gold"
          >
            ← {indexLabel}
          </button>
          <button
            type="button"
            onClick={() => go(href.home)}
            className="font-mono text-[10px] uppercase tracking-[0.16em] text-gold/55 hover:text-gold"
          >
            Desk
          </button>
        </div>
        <RegisterBar sectionHint={section} currentId={currentId} />
        <div className="relative rounded-b-[6px] rounded-tr-[6px] border border-[#c4a06a]/15 bg-[#2a1810]/50 p-2 shadow-[0_28px_70px_rgba(0,0,0,0.4)] sm:p-6">
          {children}
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
