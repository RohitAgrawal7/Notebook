"use client";

import { defaultColor, type MarkTool } from "@/lib/ink";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type InkContextValue = {
  tool: MarkTool;
  color: string;
  setTool: (tool: MarkTool) => void;
  setColor: (color: string) => void;
};

const InkContext = createContext<InkContextValue | null>(null);

export function InkProvider({ children }: { children: ReactNode }) {
  const [tool, setToolState] = useState<MarkTool>("write");
  const [color, setColorState] = useState(defaultColor("pen"));

  const setTool = useCallback((next: MarkTool) => {
    setToolState(next);
    if (next === "pen" || next === "highlighter" || next === "underline" || next === "pencil") {
      setColorState((current) => {
        if (next === "highlighter") return defaultColor("highlighter");
        if (next === "pencil") return defaultColor("pencil");
        if (next === "underline") return current || defaultColor("underline");
        return PEN_SAFE(current);
      });
    }
  }, []);

  const setColor = useCallback((next: string) => setColorState(next), []);

  const value = useMemo(() => ({ tool, color, setTool, setColor }), [color, setColor, setTool, tool]);
  return <InkContext.Provider value={value}>{children}</InkContext.Provider>;
}

function PEN_SAFE(current: string) {
  if (current === defaultColor("highlighter") || current === defaultColor("pencil")) {
    return defaultColor("pen");
  }
  return current || defaultColor("pen");
}

export function useInk() {
  const context = useContext(InkContext);
  if (!context) throw new Error("useInk must be used within InkProvider");
  return context;
}

export function useInkOptional() {
  return useContext(InkContext);
}
