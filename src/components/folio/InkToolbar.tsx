"use client";

import { HIGHLIGHT_COLORS, PEN_COLORS, type MarkTool } from "@/lib/ink";
import { useInk } from "@/lib/ink-context";

const DRAW_TOOLS: { id: MarkTool; label: string }[] = [
  { id: "write", label: "Write" },
  { id: "pen", label: "Pen" },
  { id: "highlighter", label: "Highlighter" },
  { id: "pencil", label: "Pencil" },
  { id: "eraser", label: "Eraser" },
  { id: "underline", label: "Underline" },
  { id: "italic", label: "Italic" },
];

export function InkToolbar({
  tone = "desk",
  italic = false,
  onItalic,
}: {
  tone?: "desk" | "paper";
  italic?: boolean;
  onItalic?: () => void;
}) {
  const { tool, color, setTool, setColor } = useInk();
  const swatches = tool === "highlighter" ? HIGHLIGHT_COLORS : PEN_COLORS;
  const showColor = tool === "pen" || tool === "highlighter" || tool === "underline";
  const btn = tone === "desk" ? "folio-desk-btn" : "folio-tiny";

  return (
    <div className="ink-toolbar" role="toolbar" aria-label="Page marks">
      {DRAW_TOOLS.map((item) => {
        const active = item.id === "italic" ? italic : tool === item.id;
        return (
          <button
            key={item.id}
            type="button"
            className={`${btn} ${active ? "is-ink-active" : ""}`}
            aria-pressed={active}
            onClick={() => {
              if (item.id === "italic") {
                onItalic?.();
                setTool("write");
                return;
              }
              setTool(item.id);
            }}
          >
            {item.label}
          </button>
        );
      })}
      {showColor ? (
        <span className="ink-swatches" aria-label="Ink colour">
          {swatches.map((swatch) => (
            <button
              key={swatch}
              type="button"
              className={`ink-swatch ${color === swatch ? "is-ink-active" : ""}`}
              style={{ background: swatch }}
              aria-label={`Colour ${swatch}`}
              onClick={() => setColor(swatch)}
            />
          ))}
        </span>
      ) : null}
    </div>
  );
}
