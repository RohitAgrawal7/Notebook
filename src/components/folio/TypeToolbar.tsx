"use client";

import {
  applyColor,
  applyFont,
  applyHighlight,
  applyRich,
  fontById,
  fontGroups,
  HIGHLIGHT_TINTS,
  imageToDataUrl,
  insertHtml,
  rememberSelection,
  TEXT_COLORS,
} from "@/lib/rich-text";
import type { SectionId } from "@/lib/types";
import { useRef, useState } from "react";

export function TypeToolbar({
  tone = "desk",
  section,
  onApplied,
}: {
  tone?: "desk" | "paper";
  section?: SectionId;
  onApplied?: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [face, setFace] = useState("");
  const btn = tone === "desk" ? "folio-desk-btn" : "folio-tiny";
  const groups = fontGroups(section);
  const current = fontById(face);

  function finish() {
    onApplied?.();
  }

  return (
    <div
      className={`type-toolbar type-toolbar-${tone}`}
      role="toolbar"
      aria-label="Text style"
      onMouseDownCapture={(event) => {
        rememberSelection();
        const target = event.target;
        if (target instanceof HTMLSelectElement || target instanceof HTMLInputElement) return;
        event.preventDefault();
      }}
    >
      <button type="button" className={btn} onClick={() => { applyRich("bold"); finish(); }} title="Bold selected text">
        <strong>B</strong>
      </button>
      <button type="button" className={btn} onClick={() => { applyRich("italic"); finish(); }} title="Italic selected text">
        <em>I</em>
      </button>
      <button type="button" className={btn} onClick={() => { applyRich("underline"); finish(); }} title="Underline selected text">
        <span className="type-u">U</span>
      </button>

      <span className="type-label">Color</span>
      <span className="ink-swatches" aria-label="Font colour">
        {TEXT_COLORS.map((swatch) => (
          <button
            key={swatch.id}
            type="button"
            className="ink-swatch"
            style={{ background: swatch.value }}
            title={`${swatch.label} text`}
            aria-label={`${swatch.label} text`}
            onClick={() => {
              applyColor(swatch.value);
              finish();
            }}
          />
        ))}
      </span>

      <span className="type-label">Highlight</span>
      <span className="ink-swatches" aria-label="Highlight">
        {HIGHLIGHT_TINTS.map((swatch) => (
          <button
            key={swatch.id}
            type="button"
            className="ink-swatch"
            style={{ background: swatch.value }}
            title={`${swatch.label} highlight`}
            aria-label={`${swatch.label} highlight`}
            onClick={() => {
              applyHighlight(swatch.value);
              finish();
            }}
          />
        ))}
      </span>

      <label className="type-font">
        <span className="type-label">Font</span>
        <select
          className={tone === "desk" ? "type-select-desk" : "type-select"}
          value={face}
          aria-label="Typeface"
          style={current ? { fontFamily: current.stack } : undefined}
          onChange={(event) => {
            const next = event.target.value;
            const font = fontById(next);
            if (!font) return;
            setFace(next);
            applyFont(font.label, font.stack);
            finish();
          }}
        >
          <option value="" disabled>
            Select family
          </option>
          {groups.map((group) => (
            <optgroup key={group.id} label={group.label}>
              {group.fonts.map((font) => (
                <option key={font.id} value={font.id} style={{ fontFamily: font.stack }}>
                  {font.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>

      <button
        type="button"
        className={btn}
        title="Paste or choose an image"
        onClick={() => {
          rememberSelection();
          fileRef.current?.click();
        }}
      >
        Image
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={async (event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (!file) return;
          try {
            const data = await imageToDataUrl(file);
            if (!data) return;
            insertHtml(`<img src="${data}" alt="Pasted image" />`);
            finish();
          } catch {
            /* ignore unreadable files */
          }
        }}
      />
    </div>
  );
}
