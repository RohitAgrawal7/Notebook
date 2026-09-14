"use client";

type PinToggleProps = {
  pressed: boolean;
  onToggle: () => void;
  label: string;
  compact?: boolean;
};

export function PinToggle({ pressed, onToggle, label, compact = false }: PinToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={pressed}
      aria-label={label}
      title={pressed ? "Unpin" : "Pin to the spine"}
      className={`inline-flex items-center gap-1.5 rounded-full border transition ${
        pressed
          ? "border-stamp/40 bg-stamp/10 text-stamp"
          : "border-ink/15 bg-paper/60 text-ink-soft hover:border-ink/30 hover:text-ink"
      } ${compact ? "px-2 py-1 text-[10px]" : "px-2.5 py-1 text-[11px]"} font-mono tracking-[0.14em] uppercase`}
    >
      <span aria-hidden className={pressed ? "text-stamp" : "text-gold"}>
        {pressed ? "◆" : "◇"}
      </span>
      {pressed ? "Pinned" : "Pin"}
    </button>
  );
}
