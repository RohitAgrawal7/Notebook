"use client";

export function CoverCard({
  kicker,
  title,
  subject,
  date,
  onOpen,
  tone = "book",
  mark,
}: {
  kicker: string;
  title: string;
  subject: string;
  date: string;
  onOpen: () => void;
  tone?: "book" | "journal" | "file";
  mark?: string;
}) {
  const skin =
    tone === "journal"
      ? "bg-[#f3d9c4] border-[#c9a07a]"
      : tone === "file"
        ? "bg-manila border-[#c4a06a]"
        : "bg-[#efe2c6] border-[#d4c3a0]";

  return (
    <button
      type="button"
      onClick={onOpen}
      className={`cover-card ${skin} w-full rounded-sm border p-4 text-left shadow-[6px_8px_0_rgba(0,0,0,0.12)] transition hover:-translate-y-0.5`}
    >
      <p className="flex items-start justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">
        <span>{kicker}</span>
        {mark ? <span className="text-stamp">{mark}</span> : null}
      </p>
      <h3 className="mt-2 font-serif text-xl leading-snug text-ink">{title}</h3>
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-margin-red">Subject</p>
      <p className="mt-1 font-serif text-sm leading-6 text-ink-soft">{subject}</p>
      <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft">{date}</p>
    </button>
  );
}
