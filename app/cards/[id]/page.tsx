import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowLeft, ArrowRight, Columns2, Info, Lightbulb, Target } from "lucide-react";

import { MechanismDiagram } from "@/components/diagram/mechanism-diagram";
import { ReviewPanel } from "@/components/review/review-panel";
import { FavoriteButton } from "@/components/review/favorite-button";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { detail, nav, compare as compareCopy } from "@/lib/copy";
import { cardRepository, getCategoryName } from "@/lib/data";
import { compareRepository } from "@/lib/data/compare";
import { studyRepository } from "@/lib/data/study";
import { isDue } from "@/lib/review/sm2";
import type { DrugCard } from "@/lib/types";

interface CardDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * 详情页必须动态渲染。
 *
 * 卡片内容本身是静态种子数据，但页面还要读取 SQLite 里的复习记录
 * （是否到期、已复习几轮），这份数据随用户操作实时变化。
 * 若继续预生成静态页，用户复习后刷新页面会看到过期状态。
 *
 * 代价：失去静态预渲染。但卡片内容仍由内存中的种子数据提供，
 * 每次请求只有一次轻量 SQLite 查询，响应仍然很快。
 */

export async function generateMetadata({
  params,
}: CardDetailPageProps): Promise<Metadata> {
  const card = await cardRepository.getById((await params).id);
  if (!card) {
    return { title: detail.notFoundTitle };
  }
  return {
    title: `${card.genericName}（${card.englishName}）`,
    description: `${card.genericName}的作用靶点：${card.target}。含分步机制讲解、适应症与不良反应。`,
  };
}

export default async function CardDetailPage({ params }: CardDetailPageProps) {
  const card = await cardRepository.getById((await params).id);
  if (!card) notFound();

  const allCards = await cardRepository.getAll();
  const index = allCards.findIndex((item) => item.id === card.id);
  const prevCard = index > 0 ? allCards[index - 1] : undefined;
  const nextCard = index >= 0 && index < allCards.length - 1 ? allCards[index + 1] : undefined;

  // 复习记录与收藏状态来自 SQLite，需要动态渲染
  const today = new Date();
  const [reviewLog, favorited, compares] = await Promise.all([
    studyRepository.getReviewLog(card.id),
    studyRepository.isFavorite(card.id),
    compareRepository.getByDrugId(card.id),
  ]);

  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-content px-4 pb-4">
        <div className="pt-6">
          <Link
            href="/cards"
            className="inline-flex items-center gap-1 rounded-md text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            {nav.backToCards}
          </Link>
        </div>

        <CardHeaderBlock
          card={card}
          cardPosition={index + 1}
          totalCards={allCards.length}
          favorited={favorited}
        />

        {/* 机制讲解：第一视觉重点 */}
        <section className="mt-6" aria-labelledby="mechanism-heading">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="mechanism-heading" className="text-lg font-semibold tracking-tight">
              {detail.mechanismTitle}
            </h2>
            <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
              {detail.stepCounter(card.mechanismSteps.length)}
            </span>
          </div>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">{detail.mechanismHint}</p>

          <ol className="mt-4 space-y-0">
            {card.mechanismSteps.map((step, stepIndex) => {
              const isLast = stepIndex === card.mechanismSteps.length - 1;
              return (
                <li key={step.title} className="relative flex gap-3 pb-5 last:pb-0">
                  {/* 时间轴竖线与序号圆点 */}
                  {!isLast ? (
                    <span
                      aria-hidden="true"
                      className="absolute left-[13px] top-7 h-[calc(100%-1rem)] w-px bg-border"
                    />
                  ) : null}
                  <span className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-[11px] font-semibold tabular-nums text-primary">
                    {stepIndex + 1}
                  </span>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="text-[15px] font-semibold leading-6">{step.title}</p>
                    <p className="prose-pharma mt-1 text-foreground/80">{step.detail}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        {/* 机制示意图 */}
        <section className="mt-8" aria-labelledby="diagram-heading">
          <h2 id="diagram-heading" className="text-lg font-semibold tracking-tight">
            {detail.diagramTitle}
          </h2>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">{detail.diagramHint}</p>
          <div className="mt-3">
            <MechanismDiagram spec={card.diagram} />
          </div>
        </section>

        {/* 适应症 */}
        <section className="mt-8" aria-labelledby="indications-heading">
          <h2 id="indications-heading" className="text-lg font-semibold tracking-tight">
            {detail.indicationsTitle}
          </h2>
          <ul className="mt-3 space-y-2">
            {card.indications.map((item) => (
              <li key={item} className="flex gap-2 text-[15px] leading-7">
                <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 同类药对比入口：只在参与对比时出现 */}
        {compares.length > 0 ? (
          <section className="mt-8" aria-labelledby="compare-entry-heading">
            <h2
              id="compare-entry-heading"
              className="flex items-center gap-1.5 text-sm font-semibold tracking-tight"
            >
              <Columns2 className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              {compareCopy.entryTitle}
            </h2>
            <ul className="mt-2.5 space-y-2">
              {compares.map((group) => (
                <li key={group.id}>
                  <Link
                    href={`/compare/${group.id}`}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-3.5 py-3 transition-colors hover:border-primary/40 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{group.title}</p>
                      <p className="mt-0.5 text-[11px] leading-5 text-muted-foreground">
                        {group.summary}
                      </p>
                    </div>
                    <ArrowRight
                      className="h-4 w-4 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* 不良反应：可折叠，避免喧宾夺主 */}
        <section className="mt-8" aria-labelledby="adverse-heading">
          <Accordion type="single" collapsible defaultValue="adverse">
            <AccordionItem value="adverse" className="rounded-lg border bg-card px-4">
              <AccordionTrigger>
                <span className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" aria-hidden="true" />
                  <span id="adverse-heading">{detail.adverseTitle}</span>
                  <span className="text-[11px] font-normal text-muted-foreground">
                    {card.adverseReactions.length} 条
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <p className="mb-2 text-xs text-muted-foreground">{detail.adverseHint}</p>
                <ul className="space-y-2">
                  {card.adverseReactions.map((item) => (
                    <li key={item} className="flex gap-2 text-sm leading-6 text-foreground/85">
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500/70"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            {card.needsVerification ? (
              <AccordionItem value="verification" className="mt-2 rounded-lg border bg-card px-4">
                <AccordionTrigger>
                  <span className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <span>{detail.verificationLabel}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {card.verificationNote}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ) : null}
          </Accordion>
        </section>

        {/* 记忆要点 */}
        <section className="mt-8" aria-labelledby="memory-heading">
          <Card className="border-primary/15 bg-gradient-to-br from-accent/70 to-background">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-primary" aria-hidden="true" />
                <h2 id="memory-heading" className="text-sm font-semibold">
                  {detail.memoryTitle}
                </h2>
              </div>
              <p className="mt-2 text-[15px] font-medium leading-7">{card.memoryTip}</p>
            </CardContent>
          </Card>
        </section>

        {card.sources && card.sources.length > 0 ? (
          <section className="mt-8" aria-labelledby="sources-heading">
            <h2 id="sources-heading" className="text-lg font-semibold tracking-tight">
              {detail.sourcesTitle}
            </h2>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{detail.sourcesHint}</p>
            <ul className="mt-3 space-y-3">
              {card.sources.map((source) => (
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
            {card.sourcesCheckedOn ? (
              <p className="mt-2 text-xs text-muted-foreground">
                {detail.sourcesCheckedOn(card.sourcesCheckedOn)}
              </p>
            ) : null}
          </section>
        ) : null}

        {/* 掌握程度自评（阶段三：接入 SM-2 与 SQLite） */}
        <ReviewPanel
          cardId={card.id}
          existing={
            reviewLog
              ? {
                  repetitions: reviewLog.repetitions,
                  intervalDays: reviewLog.intervalDays,
                  nextReviewAt: reviewLog.nextReviewAt,
                }
              : null
          }
          isDue={reviewLog ? isDue(reviewLog, today) : true}
        />

        {/* 上一张 / 下一张 */}
        <nav className="mt-10 grid grid-cols-2 gap-3 border-t border-border/70 pt-5" aria-label="卡片导航">
          {prevCard ? (
            <Link
              href={`/cards/${prevCard.id}`}
              className="group flex min-w-0 flex-col rounded-lg border bg-card px-3 py-2.5 transition-colors hover:border-primary/40 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <ArrowLeft className="h-3 w-3" aria-hidden="true" />
                {detail.prevCard}
              </span>
              <span className="mt-0.5 truncate text-sm font-medium">{prevCard.genericName}</span>
            </Link>
          ) : (
            <span aria-hidden="true" />
          )}
          {nextCard ? (
            <Link
              href={`/cards/${nextCard.id}`}
              className="group flex min-w-0 flex-col items-end rounded-lg border bg-card px-3 py-2.5 text-right transition-colors hover:border-primary/40 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                {detail.nextCard}
                <ArrowRight className="h-3 w-3" aria-hidden="true" />
              </span>
              <span className="mt-0.5 truncate text-sm font-medium">{nextCard.genericName}</span>
            </Link>
          ) : (
            <span aria-hidden="true" />
          )}
        </nav>
      </main>
      <SiteFooter />
    </>
  );
}

function CardHeaderBlock({
  card,
  cardPosition,
  totalCards,
  favorited,
}: {
  card: DrugCard;
  cardPosition: number;
  totalCards: number;
  favorited: boolean;
}) {
  return (
    <header className="mt-3">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{getCategoryName(card.category)}</Badge>
        {card.needsVerification ? <Badge variant="warning">{detail.verificationBadge}</Badge> : null}
        <span className="ml-auto flex items-center gap-2">
          <span className="text-[11px] tabular-nums text-muted-foreground">
            {detail.cardPosition(cardPosition, totalCards)}
          </span>
          <FavoriteButton cardId={card.id} initialFavorited={favorited} />
        </span>
      </div>

      <h1 className="mt-2 text-[26px] font-semibold leading-tight tracking-tight sm:text-[30px]">
        {card.genericName}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {card.englishName}
        {card.brandNames.length > 0 ? ` · ${card.brandNames.join("、")}` : ""}
      </p>

      <div className="mt-4 rounded-lg border border-primary/15 bg-primary/[0.04] p-4">
        <div className="flex items-center gap-1.5">
          <Target className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          <span className="text-[11px] font-medium uppercase tracking-wide text-primary">
            {detail.targetTitle}
          </span>
        </div>
        <p className="mt-1.5 text-[15px] font-medium leading-7">{card.target}</p>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        <div className="min-w-0">
          <dt className="text-[11px] text-muted-foreground">{detail.genericNameLabel}</dt>
          <dd className="mt-0.5 truncate font-medium">{card.genericName}</dd>
        </div>
        <div className="min-w-0">
          <dt className="text-[11px] text-muted-foreground">{detail.englishNameLabel}</dt>
          <dd className="mt-0.5 truncate font-medium">{card.englishName}</dd>
        </div>
        <div className="min-w-0">
          <dt className="text-[11px] text-muted-foreground">{detail.brandNamesLabel}</dt>
          <dd className="mt-0.5 truncate font-medium">
            {card.brandNames.length > 0 ? card.brandNames.join("、") : "—"}
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="text-[11px] text-muted-foreground">{detail.categoryLabel}</dt>
          <dd className="mt-0.5 truncate font-medium">{getCategoryName(card.category)}</dd>
        </div>
      </dl>
    </header>
  );
}
