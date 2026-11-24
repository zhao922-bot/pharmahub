import Link from "next/link";
import { ArrowLeftRight, ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { clinicalTagLabels, enrichmentCopy } from "@/lib/copy-enrichment";
import type { ClinicalTagId, DrugInteraction } from "@/lib/types";
import { cn } from "@/lib/utils";

const CLINICAL_TAG_STYLES: Record<ClinicalTagId, string> = {
  prodrug:
    "border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-800/80 dark:bg-sky-950/60 dark:text-sky-200",
  "narrow-therapeutic-index":
    "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800/80 dark:bg-amber-950/60 dark:text-amber-200",
  "cyp-inhibitor":
    "border-indigo-200 bg-indigo-50 text-indigo-900 dark:border-indigo-800/80 dark:bg-indigo-950/60 dark:text-indigo-200",
  "cyp-inducer":
    "border-teal-200 bg-teal-50 text-teal-900 dark:border-teal-800/80 dark:bg-teal-950/60 dark:text-teal-200",
  "renal-adjustment":
    "border-border bg-muted/70 text-foreground/90 dark:border-border dark:bg-muted/60 dark:text-foreground",
  "hepatic-caution":
    "border-border bg-muted/70 text-foreground/90 dark:border-border dark:bg-muted/60 dark:text-foreground",
  "pregnancy-caution":
    "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-800/80 dark:bg-rose-950/60 dark:text-rose-200",
  "qt-prolongation":
    "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800/80 dark:bg-amber-950/60 dark:text-amber-200",
};

/**
 * 药代动力学与高风险用药特征标签组。
 * 在详情页标题区下方平铺展示，移动端自动换行不产生横向溢出。
 */
export function ClinicalTagBadges({ tags }: { tags?: ClinicalTagId[] }) {
  if (!tags || tags.length === 0) return null;

  return (
    <ul
      aria-label={enrichmentCopy.tagsAriaLabel}
      className="mt-2.5 flex flex-wrap items-center gap-1.5"
    >
      {tags.map((tag) => (
        <li key={tag} className="max-w-full">
          <Badge
            variant="outline"
            className={cn(
              "max-w-full whitespace-normal py-0.5 text-[11px] font-medium leading-4",
              CLINICAL_TAG_STYLES[tag],
            )}
          >
            {clinicalTagLabels[tag]}
          </Badge>
        </li>
      ))}
    </ul>
  );
}

/**
 * 代表性药物相互作用（DDI）互链区块。
 * 当相互作用对象已收录于本卡片库且提供合法 targetCardId 时，渲染可点击跳转链接。
 */
export function DrugInteractionsSection({
  interactions,
  cardLookup,
}: {
  interactions?: DrugInteraction[];
  cardLookup: ReadonlyMap<string, { id: string; genericName: string }>;
}) {
  if (!interactions || interactions.length === 0) return null;

  return (
    <section className="mt-8" aria-labelledby="interactions-heading">
      <div className="flex items-baseline justify-between gap-3">
        <h2
          id="interactions-heading"
          className="flex min-w-0 items-center gap-1.5 text-lg font-semibold tracking-tight"
        >
          <ArrowLeftRight className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <span className="break-words">{enrichmentCopy.interactionsTitle}</span>
        </h2>
        <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
          {enrichmentCopy.interactionCount(interactions.length)}
        </span>
      </div>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">
        {enrichmentCopy.interactionsHint}
      </p>

      <ul className="mt-3 space-y-2.5">
        {interactions.map((item) => {
          const targetCard = item.targetCardId
            ? cardLookup.get(item.targetCardId)
            : undefined;
          const jumpLabel = targetCard
            ? targetCard.genericName === item.partner
              ? enrichmentCopy.jumpCardCta
              : `${enrichmentCopy.jumpCardCta}（${targetCard.genericName}）`
            : null;

          return (
            <li
              key={item.partner}
              className="min-w-0 rounded-lg border border-border bg-card p-3.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="min-w-0 break-words text-sm font-semibold leading-6 text-foreground">
                  {item.partner}
                </p>
                {targetCard && jumpLabel ? (
                  <Link
                    href={`/cards/${targetCard.id}`}
                    aria-label={`${enrichmentCopy.jumpCardCta}：${targetCard.genericName}`}
                    className="inline-flex max-w-full shrink-0 items-center gap-1 rounded-full border border-primary/25 bg-primary/[0.06] px-2.5 py-0.5 text-xs font-medium text-primary transition-colors hover:border-primary/45 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <span className="truncate">{jumpLabel}</span>
                    <ArrowRight className="h-3 w-3 shrink-0" aria-hidden="true" />
                  </Link>
                ) : null}
              </div>

              <dl className="mt-2 space-y-1.5 text-sm leading-6">
                <div className="min-w-0">
                  <dt className="inline text-xs font-medium text-muted-foreground">
                    {enrichmentCopy.mechanismLabel}：
                  </dt>
                  <dd className="inline break-words text-foreground/85">{item.mechanism}</dd>
                </div>
                <div className="min-w-0">
                  <dt className="inline text-xs font-medium text-muted-foreground">
                    {enrichmentCopy.consequenceLabel}：
                  </dt>
                  <dd className="inline break-words text-foreground/85">{item.consequence}</dd>
                </div>
              </dl>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
