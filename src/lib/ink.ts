import type { InkKind, InkPoint, InkStroke } from "./types";

export type MarkTool = "write" | InkKind | "italic";

export const PEN_COLORS = ["#2a2118", "#b55242", "#1e4d8c", "#2f4a3a", "#6b3fa0"] as const;
export const HIGHLIGHT_COLORS = ["#f5d76e", "#f4a6c8", "#9ee6b0", "#9ec9f0"] as const;

export function defaultColor(tool: MarkTool) {
  if (tool === "highlighter") return HIGHLIGHT_COLORS[0];
  if (tool === "pencil") return "#6a6258";
  if (tool === "underline") return "#b55242";
  return PEN_COLORS[0];
}

export function strokeSize(tool: MarkTool) {
  if (tool === "highlighter") return 18;
  if (tool === "pencil") return 1.6;
  if (tool === "underline") return 2.2;
  if (tool === "eraser") return 22;
  return 2.4;
}

export function newStrokeId() {
  return `ink-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;
}

export function pointsToPath(points: InkPoint[]) {
  if (points.length === 0) return "";
  const [first, ...rest] = points;
  return `M ${first.x} ${first.y}` + rest.map((point) => ` L ${point.x} ${point.y}`).join("");
}

export function eraseStrokes(strokes: InkStroke[], point: InkPoint, radius: number) {
  const r2 = radius * radius;
  return strokes.filter((stroke) => !stroke.points.some((item) => {
    const dx = item.x - point.x;
    const dy = item.y - point.y;
    return dx * dx + dy * dy <= r2;
  }));
}

export function snapUnderline(points: InkPoint[]): InkPoint[] {
  if (points.length < 2) return points;
  const start = points[0];
  const end = points[points.length - 1];
  return [start, { x: end.x, y: start.y }];
}
