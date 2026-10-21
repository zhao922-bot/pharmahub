import type { Metadata } from "next";
import { CompareSelector } from "@/components/quiz/compare-selector";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookX } from "lucide-react";

import { QuizRunner } from "@/components/quiz/quiz-runner";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { quiz as quizCopy } from "@/lib/copy";
import { CATEGORIES, cardRepository, getCategoryName, isCategoryId } from "@/lib/data";
import { quizRepository } from "@/lib/data/quiz";
import { compareRepository } from "@/lib/data/compare";
import { generateQuiz } from "@/lib/quiz/generator";
import { generateCompareQuiz } from "@/lib/quiz/compare-generator";
import { cn } from "@/lib/utils";
import type { CategoryId } from "@/lib/types";

export const metadata: Metadata = {
  title: quizCopy.pageTitle,
  description: quizCopy.pageBody,
};

export const dynamic = "force-dynamic";

/** 每组测验的题目数量 */
const QUESTIONS_PER_SET = 8;

/**
 * 把分类 id 映射成一个稳定的整数偏移量，用于参与种子计算。
 *
 * 用 FNV-1a：简单、无依赖、对短字符串分布均匀。
 * 只需要「不同分类得到不同数值」，不需要密码学强度。
 */
function hashCategoryId(id: string): number {
  let hash = 2166136261;
  for (let i = 0; i < id.length; i += 1) {
    hash ^= id.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

interface QuizPageProps {
  /** 可选：category 限定分类；seed 保证同一组题可复现 */
  searchParams: Promise<{ category?: string; compare?: string; seed?: string }>;
}

export default async function QuizPage({ searchParams }: QuizPageProps) {
  const today = new Date();
  const filters = await searchParams;

  const [allCards, stats, compareGroups] = await Promise.all([
    cardRepository.getAll(),
    quizRepository.getStats(today),
    compareRepository.getAll(),
  ]);

  const activeCompare = filters.compare !== undefined
    ? compareGroups.find((group) => group.id === filters.compare)
    : null;
  // 明确请求了对比组却不存在时返回 404，不能悄悄改考全部卡片。
  if (filters.compare !== undefined && !activeCompare) notFound();

  // 分类筛选：非法值一律回退为「全部」，与卡片库的行为保持一致
  const rawCategory = filters.category;
  const activeCategory: CategoryId | null =
    !activeCompare && rawCategory && isCategoryId(rawCategory) ? rawCategory : null;

  // 限定分类时，只有该分类的卡片参与出题；
  // 但**干扰项仍从全量卡片里取**——否则分类题只有 1 个选项，
  // 干扰项必须来自其他分类才有区分度。
  const quizCards = activeCategory
    ? allCards.filter((card) => card.category === activeCategory)
    : allCards;

  const activeCategoryName = activeCategory ? getCategoryName(activeCategory) : null;

  // 种子：URL 里带了就用，否则按「日期 + 小时」生成，
  // 这样同一天内刷新页面题目基本稳定，跨天则换新题。
  const seedParam = Number(filters.seed);
  const baseSeed =
    Number.isSafeInteger(seedParam) && seedParam > 0 && seedParam < Number.MAX_SAFE_INTEGER
      ? seedParam
      : Number(
          `${today.getFullYear()}${`${today.getMonth() + 1}`.padStart(2, "0")}${`${today.getDate()}`.padStart(2, "0")}${today.getHours()}`,
        );

  // 分类参与种子计算，避免切换分类后题目与「全部」高度重合
  const scopeId = activeCompare?.id ?? activeCategory;
  const seed = scopeId ? baseSeed + hashCategoryId(scopeId) : baseSeed;

  const categoryNames = new Map(CATEGORIES.map((category) => [category.id, category.name]));

  const questions = activeCompare ? generateCompareQuiz({
    group: activeCompare, allCards, count: QUESTIONS_PER_SET, seed,
  }) : generateQuiz({
    cards: quizCards,
    allCards,
    categoryNames,
    count: QUESTIONS_PER_SET,
    seed,
  });
  const scopeQuery = activeCompare
    ? `compare=${activeCompare.id}&`
    : activeCategory ? `category=${activeCategory}&` : "";
  const retryHref = `/quiz?${scopeQuery}seed=${baseSeed + 1}`;

  const accuracy =
    stats.answeredTotal > 0
      ? Math.round((stats.correctTotal / stats.answeredTotal) * 100)
      : 0;

  // 分类角标数量：直接复用卡片数据统计，避免再查一次数据库
  const categoryCounts = CATEGORIES.map((category) => ({
    category,
    count: allCards.filter((card) => card.category === category.id).length,
  }));

  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-content px-4 pb-4">
        <div className="pt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1 rounded-md text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            首页
          </Link>
          <h1 className="mt-2 text-[24px] font-semibold tracking-tight sm:text-[28px]">
            {quizCopy.pageTitle}
          </h1>
          <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
            {quizCopy.pageBody}
          </p>
        </div>

        {/* 分类筛选：用链接而不是客户端状态，保证 URL 可分享、刷新后仍在同一分类 */}
        <div
          role="group"
          aria-label={quizCopy.filterLabel}
          className="mt-4 -mx-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex w-max items-center gap-2">
            <CategoryChip
              href="/quiz"
              active={activeCategory === null && !activeCompare}
              label={quizCopy.filterAll}
              count={allCards.length}
            />
            {categoryCounts.map(({ category, count }) => (
              <CategoryChip
                key={category.id}
                href={`/quiz?category=${category.id}`}
                active={activeCategory === category.id}
                label={category.name}
                count={count}
              />
            ))}
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xs font-medium text-muted-foreground">{quizCopy.compareFilterLabel}</p>
          <CompareSelector
            groups={compareGroups.map(({ id, title }) => ({ id, title }))}
            activeId={activeCompare?.id}
          />
          <div
            role="group"
            aria-label={quizCopy.compareFilterLabel}
            className="mt-2 -mx-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="flex w-max items-center gap-2">
              {compareGroups.map((group) => (
                <CategoryChip
                  key={group.id}
                  href={`/quiz?compare=${group.id}`}
                  active={activeCompare?.id === group.id}
                  label={group.title}
                  count={group.drugIds.length}
                />
              ))}
            </div>
          </div>
        </div>

        {activeCompare ? (
          <Card className="mt-4 border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <p className="text-[11px] font-medium text-primary">{quizCopy.compareScope}</p>
              <h2 className="mt-1 text-base font-semibold">{activeCompare.title}</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {quizCopy.compareCountHint(activeCompare.drugIds.length, questions.length)}
              </p>
              <Link href={`/compare/${activeCompare.id}`} className="mt-2 inline-block text-xs text-primary hover:underline">
                {quizCopy.compareBack}
              </Link>
            </CardContent>
          </Card>
        ) : null}

        {activeCategoryName ? (
          <p className="mt-2 text-xs text-muted-foreground">
            {quizCopy.filterActive(activeCategoryName)} ·{" "}
            {quizCopy.filterCountHint(quizCards.length)}
          </p>
        ) : null}

        {/* 统计 */}
        <Card className="mt-5">
          <CardContent className="p-4">
            <dl className="grid grid-cols-3 gap-2">
              <div>
                <dt className="text-[11px] text-muted-foreground">{quizCopy.statsToday}</dt>
                <dd className="mt-1 text-xl font-semibold leading-none tabular-nums">
                  {stats.answeredToday}
                  <span className="ml-1 text-[11px] font-normal text-muted-foreground">
                    {quizCopy.statsUnitQuestion}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-[11px] text-muted-foreground">{quizCopy.statsAccuracy}</dt>
                <dd className="mt-1 text-xl font-semibold leading-none tabular-nums">
                  {accuracy}
                  <span className="ml-0.5 text-[11px] font-normal text-muted-foreground">%</span>
                </dd>
              </div>
              <div>
                <dt className="text-[11px] text-muted-foreground">{quizCopy.statsWrong}</dt>
                <dd className="mt-1 flex items-baseline gap-1 text-xl font-semibold leading-none tabular-nums">
                  {stats.wrongCount}
                  <Link
                    href="/wrong-book"
                    className="text-[11px] font-normal text-primary hover:underline"
                  >
                    {quizCopy.resultToWrongBook}
                  </Link>
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* 答题区 */}
        <div className="mt-5">
          {questions.length > 0 ? (
            <QuizRunner
              key={`${scopeId ?? "all"}:${seed}`}
              questions={questions}
              retryHref={retryHref}
              compareId={activeCompare?.id}
            />
          ) : (
            <Card>
              <CardContent className="px-4 py-10 text-center">
                <p className="text-sm font-medium">
                  {activeCompare ? quizCopy.compareEmptyTitle : quizCopy.filterEmptyTitle}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {activeCompare ? quizCopy.compareEmptyBody : quizCopy.filterEmptyBody}
                </p>
                <Button asChild variant="outline" size="sm" className="mt-4">
                  <Link href="/quiz">{quizCopy.filterClear}</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 错题重练入口 */}
        {stats.wrongCount > 0 ? (
          <div className="mt-6">
            <Card>
              <CardContent className="flex items-center justify-between gap-3 p-4">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-700">
                    <BookX className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{quizCopy.scopeWrong}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {quizCopy.statsWrong} {stats.wrongCount} {quizCopy.statsUnitItem}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <Button asChild variant="ghost" size="sm" className="h-8 px-2 text-xs">
                    <Link href="/wrong-book">{quizCopy.resultToWrongBook}</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href="/quiz/review">
                      {quizCopy.reviewRetry}
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {/* 提示 */}
        <div className="mt-6 rounded-lg border border-dashed border-border bg-muted/20 p-4">
          <div className="flex items-center gap-1.5">
            <Badge variant="secondary" className="text-[10px]">
              出题说明
            </Badge>
          </div>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            {activeCompare ? quizCopy.compareInstructions : <>
            靶点与用途题仅使用经核对的候选项；机制题仅考已单独梳理的上下游主线，
            不把正文段落自动当作时间顺序。每组最多 {QUESTIONS_PER_SET} 题，按可用题型出题。
            分类题指本库的学习分类。答错的题目会自动进入错题本。
            {activeCategory ? "选定分类时，干扰项仍限于各卡片的核对集合。" : ""}
            </>}
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

/** 分类筛选按钮。用链接实现，保证 URL 可分享、可收藏 */
function CategoryChip({
  href,
  active,
  label,
  count,
}: {
  href: string;
  active: boolean;
  label: string;
  count: number;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-foreground/80 hover:bg-accent hover:text-accent-foreground",
      )}
    >
      <span>{label}</span>
      <span
        className={cn(
          "text-[11px] tabular-nums",
          active ? "text-primary-foreground/70" : "text-muted-foreground",
        )}
      >
        {count}
      </span>
    </Link>
  );
}
