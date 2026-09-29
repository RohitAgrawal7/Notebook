"use client";

import { applyRich, imageToDataUrl, insertHtml, sanitizeHtml } from "@/lib/rich-text";
import { useEffect, useRef, type ClipboardEvent, type KeyboardEvent, type RefObject } from "react";

export function FolioEditor({
  html,
  className,
  ariaLabel,
  editorRef,
  onChange,
  onSubmitPage,
}: {
  html: string;
  className: string;
  ariaLabel: string;
  editorRef: RefObject<HTMLDivElement | null>;
  onChange: (html: string) => void;
  onSubmitPage?: () => void;
}) {
  const localRef = useRef<HTMLDivElement | null>(null);

  function setRef(node: HTMLDivElement | null) {
    localRef.current = node;
    if (typeof editorRef === "object") editorRef.current = node;
  }

  useEffect(() => {
    const node = localRef.current;
    if (!node) return;
    if (document.activeElement === node) return;
    const next = sanitizeHtml(html || "");
    if (node.innerHTML !== next) node.innerHTML = next;
  }, [html]);

  function emit() {
    const node = localRef.current;
    if (!node) return;
    onChange(sanitizeHtml(node.innerHTML));
  }

  async function onPaste(event: ClipboardEvent<HTMLDivElement>) {
    const files = [...event.clipboardData.files];
    const fromItems = [...event.clipboardData.items]
      .map((item) => item.getAsFile())
      .filter((file): file is File => Boolean(file));
    const image = [...files, ...fromItems].find((file) => file.type.startsWith("image/"));
    if (image) {
      event.preventDefault();
      try {
        const data = await imageToDataUrl(image);
        if (data) {
          insertHtml(`<img src="${data}" alt="Pasted image" />`);
          emit();
        }
      } catch {
        /* ignore unreadable images */
      }
      return;
    }
    const htmlClip = event.clipboardData.getData("text/html");
    if (htmlClip) {
      event.preventDefault();
      insertHtml(sanitizeHtml(htmlClip));
      emit();
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const key = event.key.toLowerCase();
    if ((event.metaKey || event.ctrlKey) && key === "b") {
      event.preventDefault();
      applyRich("bold");
      emit();
      return;
    }
    if ((event.metaKey || event.ctrlKey) && key === "i") {
      event.preventDefault();
      applyRich("italic");
      emit();
      return;
    }
    if ((event.metaKey || event.ctrlKey) && key === "u") {
      event.preventDefault();
      applyRich("underline");
      emit();
      return;
    }
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      onSubmitPage?.();
    }
  }

  return (
    <div
      ref={setRef}
      className={className}
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      aria-multiline="true"
      aria-label={ariaLabel}
      spellCheck
      autoCapitalize="sentences"
      autoCorrect="on"
      onInput={emit}
      onBlur={emit}
      onPaste={onPaste}
      onKeyDown={onKeyDown}
    />
  );
}
