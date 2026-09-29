"use client";

import { SECTION_META } from "@/lib/folio";
import { useFolio } from "@/lib/folio-context";
import { hrefFor } from "@/lib/routes";
import { useRouter } from "@/lib/router";

export function PinnedRail() {
  const { pinRefs } = useFolio();
  const { go } = useRouter();

  return (
    <aside className="hidden w-[210px] shrink-0 flex-col lg:flex">
      <p className="px-1 font-mono text-[10px] uppercase tracking-[0.22em] text-gold/80">
        Spine pins
      </p>
      <p className="mt-1 px-1 text-[12px] leading-5 text-gold/65">
        A pin is a temporary claim. Pull one to open that leaf.
      </p>
      <ul className="mt-5 flex flex-col gap-3">
        {pinRefs.length === 0 ? (
          <li className="rounded-sm border border-dashed border-gold/25 px-3 py-4 text-[13px] leading-5 text-gold/60">
            Nothing is pinned. Use the margin tack on a leaf to keep it in reach.
          </li>
        ) : (
          pinRefs.map((pin, index) => (
            <li key={pin.id}>
              <button
                type="button"
                onClick={() => go(hrefFor(pin.section, pin.id))}
                className="group relative w-full rounded-r-sm border border-l-4 border-gold/35 border-l-stamp bg-[#3a2418] px-3 py-2.5 text-left shadow-[4px_6px_14px_rgba(0,0,0,0.28)] transition hover:-translate-y-0.5 hover:border-gold/60"
              >
                <span
                  aria-hidden
                  className="absolute -left-2 top-3 h-2 w-2 rounded-full bg-gold shadow-[0_0_0_3px_rgba(196,160,106,0.2)]"
                />
                <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-gold/70">
                  {SECTION_META[pin.section].label} · {pin.eyebrow}
                </span>
                <span className="mt-1 block font-serif text-[15px] leading-5 text-[#f6ead4] group-hover:text-white">
                  {pin.title}
                </span>
                <span className="mt-2 block font-mono text-[9px] uppercase tracking-[0.16em] text-gold/50">
                  Ribbon {String(index + 1).padStart(2, "0")}
                </span>
              </button>
            </li>
          ))
        )}
      </ul>
      <p className="mt-auto pt-8 font-mono text-[10px] leading-5 text-gold/45">
        Keys 1–3 open the three libraries. Arrows turn the open leaf.
      </p>
    </aside>
  );
}

export function PinnedStrip() {
  const { pinRefs } = useFolio();
  const { go } = useRouter();
  if (pinRefs.length === 0) return null;

  return (
    <div className="flex gap-2 overflow-x-auto px-0 pb-2 [-webkit-overflow-scrolling:touch] lg:hidden">
      {pinRefs.map((pin) => (
        <button
          key={pin.id}
          type="button"
          onClick={() => go(hrefFor(pin.section, pin.id))}
          className="min-h-11 shrink-0 rounded-sm border border-gold/30 bg-[#3a2418] px-3 py-2 text-left"
        >
          <span className="block font-mono text-[9px] uppercase tracking-[0.16em] text-gold/65">
            {SECTION_META[pin.section].label}
          </span>
          <span className="block max-w-[160px] truncate font-serif text-sm text-[#f6ead4]">
            {pin.title}
          </span>
        </button>
      ))}
    </div>
  );
}
