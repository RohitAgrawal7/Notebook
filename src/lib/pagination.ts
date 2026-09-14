export function chunk<T>(items: T[], size: number): T[][] {
  if (items.length === 0) return [[]];
  const pages: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    pages.push(items.slice(i, i + size));
  }
  return pages;
}

export function clampPage(page: number, pageCount: number) {
  if (pageCount < 1) return 1;
  return Math.min(Math.max(1, page), pageCount);
}

export function formatPageLabel(page: number, pageCount: number) {
  return `Leaf ${page} of ${pageCount}`;
}

export function byDateDesc<T extends { date: string }>(a: T, b: T) {
  return b.date.localeCompare(a.date);
}

export function byDateAsc<T extends { date: string }>(a: T, b: T) {
  return a.date.localeCompare(b.date);
}
