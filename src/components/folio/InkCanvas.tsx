"use client";

import { InkMarks } from "@/components/folio/InkMarks";
import { eraseStrokes, newStrokeId, snapUnderline, strokeSize } from "@/lib/ink";
import { useInk } from "@/lib/ink-context";
import type { InkPoint, InkStroke } from "@/lib/types";
import { useEffect, useRef, useState } from "react";

export function InkCanvas({
  strokes,
  onChange,
}: {
  strokes: InkStroke[];
  onChange: (next: InkStroke[]) => void;
}) {
  const { tool, color } = useInk();
  const wrapRef = useRef<HTMLDivElement>(null);
  const liveId = useRef<string | null>(null);
  const local = useRef(strokes);
  const onChangeRef = useRef(onChange);
  const toolRef = useRef(tool);
  const colorRef = useRef(color);
  const [draft, setDraft] = useState(strokes);
  onChangeRef.current = onChange;
  toolRef.current = tool;
  colorRef.current = color;
  const drawing = tool === "pen" || tool === "highlighter" || tool === "pencil" || tool === "eraser" || tool === "underline";

  useEffect(() => {
    if (liveId.current) return;
    local.current = strokes;
    setDraft(strokes);
  }, [strokes]);

  useEffect(() => {
    function pointFromEvent(event: PointerEvent): InkPoint | null {
      const box = wrapRef.current?.getBoundingClientRect();
      if (!box || box.width < 8 || box.height < 8) return null;
      return {
        x: Math.min(1, Math.max(0, (event.clientX - box.left) / box.width)),
        y: Math.min(1, Math.max(0, (event.clientY - box.top) / box.height)),
      };
    }

    function paint(next: InkStroke[]) {
      local.current = next;
      setDraft(next);
    }

    function onDown(event: PointerEvent) {
      const currentTool = toolRef.current;
      if (currentTool === "write" || currentTool === "italic") return;
      const point = pointFromEvent(event);
      if (!point) return;
      event.preventDefault();
      wrapRef.current?.setPointerCapture(event.pointerId);
      if (currentTool === "eraser") {
        liveId.current = "erase";
        paint(eraseStrokes(local.current, point, 0.028));
        return;
      }
      const stroke: InkStroke = {
        id: newStrokeId(),
        tool: currentTool === "highlighter" || currentTool === "pencil" || currentTool === "underline" ? currentTool : "pen",
        color: colorRef.current,
        size: strokeSize(currentTool),
        points: [point],
      };
      liveId.current = stroke.id;
      paint([...local.current, stroke]);
    }

    function onMove(event: PointerEvent) {
      if (!liveId.current) return;
      const point = pointFromEvent(event);
      if (!point) return;
      event.preventDefault();
      const currentTool = toolRef.current;
      if (currentTool === "eraser") {
        paint(eraseStrokes(local.current, point, 0.028));
        return;
      }
      const id = liveId.current;
      paint(
        local.current.map((stroke) => {
          if (stroke.id !== id) return stroke;
          const points =
            currentTool === "underline" ? snapUnderline([...stroke.points, point]) : [...stroke.points, point];
          return { ...stroke, points };
        }),
      );
    }

    function onUp() {
      if (liveId.current) onChangeRef.current(local.current);
      liveId.current = null;
    }

    const node = wrapRef.current;
    if (!node) return;
    node.addEventListener("pointerdown", onDown);
    node.addEventListener("pointermove", onMove);
    node.addEventListener("pointerup", onUp);
    node.addEventListener("pointercancel", onUp);
    return () => {
      node.removeEventListener("pointerdown", onDown);
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerup", onUp);
      node.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className={`ink-canvas ${drawing ? "is-draw" : "is-idle"} ink-canvas-${tool}`}
    >
      <InkMarks strokes={draft} />
    </div>
  );
}
