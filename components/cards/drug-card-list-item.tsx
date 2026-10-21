import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cards as cardsCopy } from "@/lib/copy";
import type { DrugCardSummary } from "@/lib/data/cards";
import type { SearchMatch } from "@/lib/search";
import { splitHighlighted } from "@/lib/search";

/**
 * 列表项卡片。移动端为整行可点击区域，桌面端保持同样的单列节奏，
 * 保证 720px 内容区内可读性最佳。
 *
 * 搜索命中时（match 非空）额外展示一条「命中摘要」：
 * 告诉用户在哪个字段、哪一步命中的，并把关键词高亮。
 * 这是搜索增强的关键——用户能立刻判断这张卡是不是自己要找的，
 * 而不用点进去再翻。
 */
export function DrugCardListItem({
  card,
  match,
}: {
  card: DrugCardSummary;
  /** 搜索命中信息；无关键词时为 undefined */
  match?: SearchMatch | null;
}) {
  return (
    <Link
      href={`/cards/${card.id}`}
      className="group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <Card className="transition-colors group-hover:border-primary/40 group-hover:bg-accent/40">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <h3 className="text-[17px] font-semibold tracking-tight">
                  {card.genericName}
                </h3>
                <span className="text-xs text-muted-foreground">{card.englishName}</span>
              </div>
              <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-foreground/75">
                <span className="text-muted-foreground">{cardsCopy.targetLabel}：</span>
                {card.target}
              </p>
            </div>
            <Badge variant="secondary" className="shrink-0 whitespace-nowrap">
              {card.categoryName}
            </Badge>
          </div>

          {match ? <MatchSnippet match={match} /> : null}

          {!match && card.primaryIndication ? (
            <p className="mt-2 line-clamp-1 text-xs text-muted-foreground">
              {cardsCopy.indicationsLabel}：{card.primaryIndication}
            </p>
          ) : null}

          <div className="mt-3 flex items-center gap-1 text-xs font-medium text-primary">
            {cardsCopy.detailCta}
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

/** 命中摘要：字段标签 + 高亮片段 */
function MatchSnippet({ match }: { match: SearchMatch }) {
  const { kind, stepIndex, itemIndex } = match.field;
  const fieldLabel = cardsCopy.matchIn[kind];

  // 机制与列表类字段带上序号，让用户知道具体是第几步 / 第几条
  const ordinal =
    kind === "mechanismStep" && stepIndex
      ? cardsCopy.matchStepLabel(stepIndex)
      : (kind === "indication" || kind === "adverseReaction" || kind === "brandName") && itemIndex
        ? cardsCopy.matchItemLabel(itemIndex)
        : null;

  const parts = splitHighlighted(match.snippet, match.ranges);

  return (
    <div className="mt-2 rounded-md border border-primary/15 bg-primary/[0.04] px-2.5 py-2">
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <span className="font-medium text-primary">{fieldLabel}</span>
        {ordinal ? <span>{ordinal}</span> : null}
        {match.otherMatchCount > 0 ? (
          <span className="ml-auto shrink-0 tabular-nums">
            {cardsCopy.otherMatches(match.otherMatchCount)}
          </span>
        ) : null}
      </div>
      <p className="mt-1 text-xs leading-5 text-foreground/80">
        {parts.map((part, index) =>
          part.highlighted ? (
            <mark
              key={index}
              className="rounded-sm bg-amber-200/70 px-0.5 text-foreground dark:bg-amber-400/25"
            >
              {part.text}
            </mark>
          ) : (
            <span key={index}>{part.text}</span>
          ),
        )}
      </p>
    </div>
  );
}
