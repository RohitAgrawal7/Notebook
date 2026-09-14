"use client";

import { pointsToPath } from "@/lib/ink";
import type { InkStroke } from "@/lib/types";

export function InkMarks({ strokes }: { strokes: InkStroke[] }) {
  if (!strokes.length) return null;
  return (
    <svg className="ink-marks" viewBox="0 0 1 1" preserveAspectRatio="none" aria-hidden>
      {strokes.map((stroke) => (
        <path
          key={stroke.id}
          d={pointsToPath(stroke.points)}
          className={`ink-stroke ink-stroke-${stroke.tool}`}
          stroke={stroke.color}
          strokeWidth={stroke.size / 220}
          fill="none"
          strokeLinecap={stroke.tool === "underline" ? "butt" : "round"}
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}
