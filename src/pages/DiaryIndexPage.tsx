"use client";

import { JournalCover } from "@/components/catalog/LibraryCovers";
import { DeskFrame } from "@/components/layout/DeskFrame";
import { LibraryShelf } from "@/components/layout/LibraryShelf";
import { EmptyCabinet } from "@/components/catalog/EmptyCabinet";
import { catalogDiary, monthLabel } from "@/lib/catalog";
import { formatShortDate } from "@/lib/folio";
import { useFolio } from "@/lib/folio-context";
import { href } from "@/lib/routes";
import { useRouter } from "@/lib/router";
import { useMemo } from "react";

export function DiaryIndexPage() {
  const { diaryEntries, openComposer } = useFolio();
  const { go } = useRouter();
  const volumes = useMemo(() => catalogDiary(diaryEntries), [diaryEntries]);
  const months = useMemo(() => {
    const groups: { month: string; entries: typeof volumes }[] = [];
    for (const entry of volumes) {
      const month = monthLabel(entry.date);
      const last = groups[groups.length - 1];
      if (last && last.month === month) last.entries.push(entry);
      else groups.push({ month, entries: [entry] });
    }
    return groups;
  }, [volumes]);

  return (
    <DeskFrame
      kicker="Diarium"
      title="Diary"
        deck="Each day is its own lined volume. Open a title to write on the paper, turn leaves, and mark pages for PDF."
    >
      <LibraryShelf
        section="diary"
        latin="Diarium"
        title="The volumes"
        count={`${volumes.length} dated ${volumes.length === 1 ? "entry" : "entries"}`}
        onAdd={() => openComposer("diary", "create")}
      >
        {volumes.length === 0 ? (
          <EmptyCabinet label="The diary is still empty." />
        ) : (
          <div className="space-y-8">
            {months.map((group) => (
              <section key={group.month}>
                <h3 className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-gold/70">
                  {group.month}
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {group.entries.map((entry) => (
                    <JournalCover
                      key={entry.id}
                      title={entry.title}
                      subject={entry.place}
                      weekday={entry.weekday}
                      date={formatShortDate(entry.date)}
                      onOpen={() => go(href.diary(entry.id))}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </LibraryShelf>
    </DeskFrame>
  );
}
