import type { SectionId } from "./types";

export const TEXT_COLORS = [
  { id: "ink", label: "Ink", value: "#2a2118" },
  { id: "red", label: "Red", value: "#c43c2c" },
  { id: "green", label: "Green", value: "#2d6a45" },
  { id: "navy", label: "Navy", value: "#1e4d8c" },
  { id: "gold", label: "Gold", value: "#8a6a32" },
] as const;

export const HIGHLIGHT_TINTS = [
  { id: "yellow", label: "Yellow", value: "#f5d76e" },
  { id: "green", label: "Green", value: "#9ee6b0" },
  { id: "pink", label: "Pink", value: "#f4a6c8" },
  { id: "blue", label: "Blue", value: "#9ec9f0" },
  { id: "amber", label: "Amber", value: "#f3c77a" },
] as const;

export const PAGE_FONTS = [
  { id: "leaf", label: "Leaf", section: "notebook", stack: '"Palatino Linotype", Palatino, "Iowan Old Style", "Book Antiqua", serif' },
  { id: "ruled", label: "Ruled", section: "notebook", stack: '"Iowan Old Style", Palatino, Georgia, serif' },
  { id: "field", label: "Field", section: "notebook", stack: '"American Typewriter", "Courier New", ui-monospace, monospace' },
  { id: "margin", label: "Margin", section: "notebook", stack: 'Menlo, Monaco, Consolas, "Courier New", monospace' },
  { id: "sketch", label: "Sketch", section: "notebook", stack: 'Noteworthy, "Segoe Script", "Comic Sans MS", cursive' },
  { id: "journal", label: "Journal", section: "diary", stack: 'Georgia, "Iowan Old Style", serif' },
  { id: "letter", label: "Letter", section: "diary", stack: '"Hoefler Text", Palatino, Georgia, serif' },
  { id: "quiet", label: "Quiet", section: "diary", stack: 'Baskerville, "Times New Roman", serif' },
  { id: "day", label: "Day", section: "diary", stack: 'Garamond, "Palatino Linotype", Palatino, serif' },
  { id: "hand", label: "Hand", section: "diary", stack: '"Snell Roundhand", "Segoe Script", "Apple Chancery", cursive' },
  { id: "record", label: "Record", section: "reports", stack: '"Times New Roman", Times, serif' },
  { id: "filing", label: "Filing", section: "reports", stack: 'Cambria, Georgia, "Times New Roman", serif' },
  { id: "brief", label: "Brief", section: "reports", stack: '"Helvetica Neue", Helvetica, Arial, sans-serif' },
  { id: "office", label: "Office", section: "reports", stack: 'Calibri, Candara, Arial, sans-serif' },
  { id: "statement", label: "Statement", section: "reports", stack: 'Didot, "Bodoni MT", "Times New Roman", serif' },
] as const;

export type PageFont = (typeof PAGE_FONTS)[number];

const SECTION_FONT_LABEL: Record<SectionId, string> = {
  notebook: "Notebook",
  diary: "Diary",
  reports: "Report",
};

export function fontsFor(section?: SectionId) {
  if (!section) return [...PAGE_FONTS];
  return [
    ...PAGE_FONTS.filter((font) => font.section === section),
    ...PAGE_FONTS.filter((font) => font.section !== section),
  ];
}

export function fontGroups(section?: SectionId) {
  const order: SectionId[] = section
    ? [section, ...(["notebook", "diary", "reports"] as const).filter((item) => item !== section)]
    : ["notebook", "diary", "reports"];
  return order.map((id) => ({
    id,
    label: SECTION_FONT_LABEL[id],
    fonts: PAGE_FONTS.filter((font) => font.section === id),
  }));
}

export function fontById(id: string) {
  return PAGE_FONTS.find((font) => font.id === id);
}

let savedRange: Range | null = null;

export function htmlToPlain(source: string) {
  if (!source) return "";
  if (!looksLikeHtml(source)) return source;
  return source
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(div|p)>/gi, "\n")
    .replace(/<img[^>]*>/gi, " [image] ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+\n/g, "\n")
    .trim();
}

export function looksLikeHtml(source: string) {
  return /<\/?[a-z][\s\S]*>/i.test(source);
}

export function folioEditor(): HTMLElement | null {
  const active = document.activeElement;
  if (active instanceof HTMLElement && active.isContentEditable && active.classList.contains("folio-editor")) {
    return active;
  }
  const node = document.querySelector(".folio-editor[contenteditable]");
  return node instanceof HTMLElement ? node : null;
}

export function rememberSelection() {
  const selection = document.getSelection();
  if (!selection || selection.rangeCount === 0) return;
  const range = selection.getRangeAt(0);
  const editor = folioEditor();
  if (editor && editor.contains(range.commonAncestorContainer)) {
    savedRange = range.cloneRange();
  }
}

export function restoreSelection() {
  const editor = folioEditor();
  const selection = document.getSelection();
  const live =
    Boolean(editor) &&
    document.activeElement === editor &&
    Boolean(selection && selection.rangeCount > 0 && editor?.contains(selection.anchorNode));
  if (live) return;
  editor?.focus();
  if (!savedRange || !selection) return;
  selection.removeAllRanges();
  try {
    selection.addRange(savedRange);
  } catch {
    savedRange = null;
  }
}

export function applyRich(command: string, value?: string) {
  restoreSelection();
  const editor = folioEditor();
  if (!editor) return false;
  editor.focus();
  document.execCommand("styleWithCSS", false, "true");
  const ok = document.execCommand(command, false, value ?? "");
  pingEditor(editor);
  rememberSelection();
  return ok;
}

export function applyColor(color: string) {
  const ok = applyRich("foreColor", color);
  if (!ok) wrapSelection({ color });
  return true;
}

export function applyHighlight(color: string) {
  restoreSelection();
  const editor = folioEditor();
  if (!editor) return false;
  editor.focus();
  document.execCommand("styleWithCSS", false, "true");
  const painted = document.execCommand("hiliteColor", false, color) || document.execCommand("backColor", false, color);
  if (!painted) wrapSelection({ backgroundColor: color });
  pingEditor(editor);
  rememberSelection();
  return true;
}

export function applyFont(family: string, stack?: string) {
  restoreSelection();
  const editor = folioEditor();
  if (!editor) return false;
  editor.focus();
  wrapSelection({ fontFamily: stack || family });
  pingEditor(editor);
  rememberSelection();
  return true;
}

export function insertHtml(html: string) {
  restoreSelection();
  const editor = folioEditor();
  if (!editor) return;
  editor.focus();
  document.execCommand("styleWithCSS", false, "true");
  const ok = document.execCommand("insertHTML", false, html);
  if (!ok) {
    const selection = document.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      const holder = document.createElement("div");
      holder.innerHTML = html;
      const fragment = document.createDocumentFragment();
      while (holder.firstChild) fragment.appendChild(holder.firstChild);
      range.insertNode(fragment);
    } else {
      editor.insertAdjacentHTML("beforeend", html);
    }
  }
  pingEditor(editor);
  rememberSelection();
}

export function sanitizeHtml(dirty: string) {
  if (!dirty) return "";
  if (!looksLikeHtml(dirty)) return escapeText(dirty).replace(/\n/g, "<br>");
  const root = document.createElement("div");
  root.innerHTML = dirty;
  cleanNode(root);
  return root.innerHTML;
}

export function escapeText(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function imageToDataUrl(file: File) {
  const bitmap = await blobToImage(file);
  const max = 720;
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height, 1));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.72);
}

export function splitOverflowHtml(el: HTMLElement) {
  if (el.scrollHeight <= el.clientHeight + 2) {
    return { keep: el.innerHTML, rest: "" };
  }
  const original = el.innerHTML;
  const rest: string[] = [];
  while (el.scrollHeight > el.clientHeight + 2 && el.lastChild) {
    rest.unshift(takeLast(el));
  }
  const keep = el.innerHTML;
  el.innerHTML = original;
  return { keep, rest: rest.join("") };
}

function pingEditor(editor: HTMLElement) {
  editor.dispatchEvent(new Event("input", { bubbles: true }));
}

function wrapSelection(style: { color?: string; backgroundColor?: string; fontFamily?: string }) {
  const selection = document.getSelection();
  if (!selection || selection.rangeCount === 0) return;
  const range = selection.getRangeAt(0);
  const span = document.createElement("span");
  if (style.color) span.style.color = style.color;
  if (style.backgroundColor) span.style.backgroundColor = style.backgroundColor;
  if (style.fontFamily) span.style.fontFamily = style.fontFamily;
  if (range.collapsed) {
    span.appendChild(document.createTextNode("\u200b"));
    range.insertNode(span);
    const next = document.createRange();
    next.selectNodeContents(span);
    next.collapse(false);
    selection.removeAllRanges();
    selection.addRange(next);
    pingEditor(folioEditor() ?? span);
    return;
  }
  try {
    range.surroundContents(span);
  } catch {
    const contents = range.extractContents();
    span.appendChild(contents);
    range.insertNode(span);
  }
  const next = document.createRange();
  next.selectNodeContents(span);
  selection.removeAllRanges();
  selection.addRange(next);
  pingEditor(folioEditor() ?? span);
}

function takeLast(el: HTMLElement) {
  const last = el.lastChild;
  if (!last) return "";
  if (last.nodeType === Node.TEXT_NODE) {
    const value = last.textContent ?? "";
    if (value.length > 40) {
      const cut = Math.max(1, Math.round(value.length * 0.55));
      const next = value.slice(cut);
      last.textContent = value.slice(0, cut);
      if (el.scrollHeight <= el.clientHeight + 2) return escapeText(next);
      last.textContent = value;
    }
    el.removeChild(last);
    return escapeText(value);
  }
  const html = last instanceof HTMLElement ? last.outerHTML : last.textContent ?? "";
  el.removeChild(last);
  return html;
}

function blobToImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read image"));
    };
    image.src = url;
  });
}

function cleanNode(node: Node) {
  const children = Array.from(node.childNodes);
  for (const child of children) {
    if (child.nodeType === Node.COMMENT_NODE) {
      child.remove();
      continue;
    }
    if (child.nodeType === Node.ELEMENT_NODE) {
      const el = child as HTMLElement;
      const tag = el.tagName;
      if (tag === "SCRIPT" || tag === "STYLE" || tag === "IFRAME") {
        el.remove();
        continue;
      }
      if (tag === "IMG") {
        const src = el.getAttribute("src") ?? "";
        if (!src.startsWith("data:image/")) {
          el.remove();
          continue;
        }
        for (const name of Array.from(el.attributes)) {
          if (name.name !== "src" && name.name !== "alt") el.removeAttribute(name.name);
        }
        el.setAttribute("alt", el.getAttribute("alt") || "Pasted image");
        continue;
      }
      if (!ALLOWED.has(tag)) {
        const parent = el.parentNode;
        while (el.firstChild) parent?.insertBefore(el.firstChild, el);
        el.remove();
        continue;
      }
      stripAttrs(el);
      cleanNode(el);
    }
  }
}

const ALLOWED = new Set(["B", "I", "U", "STRONG", "EM", "SPAN", "BR", "DIV", "P", "IMG", "FONT", "MARK"]);

function stripAttrs(el: HTMLElement) {
  for (const attr of Array.from(el.attributes)) {
    const name = attr.name.toLowerCase();
    if (name === "style") {
      el.setAttribute("style", safeStyle(attr.value));
      continue;
    }
    if (name === "face" && el.tagName === "FONT") continue;
    if (name === "color" && el.tagName === "FONT") continue;
    if (name.startsWith("on") || name === "src" || name === "href") el.removeAttribute(attr.name);
    else if (name !== "alt") el.removeAttribute(attr.name);
  }
}

function safeStyle(value: string) {
  const allowed = [
    "color",
    "background",
    "background-color",
    "font-family",
    "font-style",
    "font-weight",
    "text-decoration",
    "text-decoration-line",
    "text-decoration-color",
    "text-decoration-style",
    "text-decoration-thickness",
  ];
  return value
    .split(";")
    .map((part) => part.trim())
    .filter((part) => {
      const key = part.split(":")[0]?.trim().toLowerCase();
      return Boolean(key && allowed.includes(key) && !/expression|url\(/i.test(part));
    })
    .join("; ");
}
