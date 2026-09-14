"use client";

import { DiaryBook } from "@/components/diary/DiaryBook";
import { MissingLeaf } from "@/components/folio/MissingLeaf";
import { DeskFrame } from "@/components/layout/DeskFrame";
import { ReadingDesk } from "@/components/layout/ReadingDesk";
import { useFolio } from "@/lib/folio-context";
import { href } from "@/lib/routes";
import { useMemo } from "react";

export function DiaryReaderPage({ id }: { id: string }) {
  const { diaryEntries } = useFolio();
  const item = useMemo(
    () => diaryEntries.find((entry) => entry.id === id),
    [diaryEntries, id],
  );

  return (
    <DeskFrame kicker="Diarium" title="Diary">
      <ReadingDesk
        section="diary"
        currentId={item?.id}
        indexHref={href.diaries}
        indexLabel="All diaries"
        hideSpine
      >
        {item ? (
          <DiaryBook entry={item} />
        ) : (
          <MissingLeaf backHref={href.diaries} backLabel="Return to diaries" kind="diary" />
        )}
      </ReadingDesk>
    </DeskFrame>
  );
}
