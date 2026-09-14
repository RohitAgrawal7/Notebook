"use client";

type CategoryChipProps = {
  label: string;
  active?: boolean;
  onClick?: () => void;
  as?: "button" | "span";
};

export function CategoryChip({
  label,
  active = false,
  onClick,
  as = "button",
}: CategoryChipProps) {
  const className = `inline-flex items-center rounded-sm border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] ${
    active
      ? "border-margin-red/50 bg-margin-red/10 text-margin-red"
      : "border-ink/15 bg-paper/70 text-ink-soft"
  }`;

  if (as === "span") {
    return <span className={className}>{label}</span>;
  }

  return (
    <button type="button" onClick={onClick} className={`${className} transition hover:border-ink/35`}>
      {label}
    </button>
  );
}
