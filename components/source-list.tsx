import { detail } from "@/lib/copy";
import type { CaseQuestionSpec } from "@/lib/types";

export function SourceList({ sources, sourcesCheckedOn }: {
  sources: CaseQuestionSpec["sources"];
  sourcesCheckedOn?: string;
}) {
  return (
    <>
      <ul className="mt-3 space-y-3">
        {sources.map((source) => (
          <li key={source.url} className="rounded-lg border bg-card p-3.5">
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="break-words text-sm font-medium text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {source.title}
            </a>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">{source.sections}</p>
          </li>
        ))}
      </ul>
      {sourcesCheckedOn && (
        <p className="mt-2 text-xs text-muted-foreground">{detail.sourcesCheckedOn(sourcesCheckedOn)}</p>
      )}
    </>
  );
}
