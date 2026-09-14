"use client";

import { PaperSheet } from "@/components/folio/PaperSheet";
import { useRouter } from "@/lib/router";

export function MissingLeaf({
  backHref,
  backLabel,
  kind,
}: {
  backHref: string;
  backLabel: string;
  kind: string;
}) {
  const { go } = useRouter();

  return (
    <PaperSheet eyebrow="Missing leaf" title="This page is not in the register" paper="plain">
      <p className="max-w-prose font-serif text-lg leading-7 text-ink-soft">
        That {kind} is no longer on the desk. It may have been deleted, or the address is
        incomplete.
      </p>
      <button
        type="button"
        className="folio-solid mt-8"
        onClick={() => go(backHref)}
      >
        {backLabel}
      </button>
    </PaperSheet>
  );
}
