import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  Flame,
  Layers,
  ListChecks,
  Sparkles,
} from "lucide-react";

import { DrugCardListItem } from "@/components/cards/drug-card-list-item";
import { InstallPrompt } from "@/components/layout/install-prompt";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { StudyHeatmap } from "@/components/review/study-heatmap";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { home, site } from "@/lib/copy";
import { CATEGORIES, cardRepository } from "@/lib/data";
import { getCategoryName } from "@/lib/data/categories";
import { studyRepository } from "@/lib/data/study";
import { quizRepository } from "@/lib/data/quiz";

/**
 * 首页需要读取 云端数据库 中的复习进度，因此必须动态渲染。
 * 数据量很小（20 张卡片），单次请求的数据库开销可以忽略。
 */
export const dynamic = "force-dynamic";

/** 热力图显示多少周（约半年） */
const HEATMAP_WEEKS = 26;

export default async function HomePage() {
  const today = new Date();

  const [counts, featured, progress, dueIds, quizStats] = await Promise.all([
    cardRepository.getCategoryCounts(),
    cardRepository.getFeatured(3),
    studyRepository.getProgress(today),
    studyRepository.getDueCardIds(today),
    quizRepository.getStats(today),
  ]);

  // 热力图只关心近半年，多查一天避免边界误差
  const heatmapSince = new Date(today);
  heatmapSince.setDate(heatmapSince.getDate() - HEATMAP_WEEKS * 7 - 1);
  const dailyCounts = await studyRepository.getDailyReviewCounts(heatmapSince);

  // 今日待复习的前 5 张，给出可以直接点进去的入口
  const dueCards = await Promise.all(
    dueIds.slice(0, 5).map((id) => cardRepository.getById(id)),
  );
  const validDueCards = dueCards.filter((card) => card !== null);

  const totalCards = Object.values(counts).reduce((sum, n) => sum + n, 0);
  const dueCount = dueIds.length;

  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-content px-4 pb-4">
        {/* Hero */}
        <section className="pt-8 sm:pt-10">
          <div className="flex items-center gap-2">
            <Badge variant="accent" className="gap-1">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              {site.stageBadge}
            </Badge>
            <span className="text-xs text-muted-foreground">{home.heroEyebrow}</span>
          </div>
          <h1 className="mt-3 text-[26px] font-semibold leading-[1.25] tracking-tight sm:text-[32px]">
            {home.heroTitle}
          </h1>
          <p className="mt-3 text-[15px] leading-7 text-foreground/75">{home.heroBody}</p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/cards">
                {home.primaryCta}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
              <Link href="#method">{home.secondaryCta}</Link>
            </Button>
          </div>
        </section>

        {/* 装到主屏幕引导：仅移动端、仅未安装时出现 */}
        <InstallPrompt />

        {/* 今日待复习 + 进度看板 */}
        <section className="mt-8 grid gap-3 sm:grid-cols-2" aria-label={home.reviewCardTitle}>
          <Card className="border-primary/15 bg-gradient-to-br from-accent/60 to-background">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-primary" aria-hidden="true" />
                  <CardTitle>{home.reviewCardTitle}</CardTitle>
                </div>
                {dueCount === 0 ? (
                  <Badge variant="secondary" className="gap-1">
                    <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                    {home.reviewDoneBadge}
                  </Badge>
                ) : null}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold tabular-nums tracking-tight">
                {dueCount}
                <span className="ml-1 text-sm font-normal text-muted-foreground">
                  {home.reviewUnit}
                </span>
              </p>
              <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                {dueCount === 0
                  ? progress.learnedCount === 0
                    ? home.reviewEmptyBody
                    : home.reviewAllDoneBody
                  : home.reviewDueBody}
              </p>

              {validDueCards.length > 0 ? (
                <ul className="mt-3 space-y-1.5">
                  {validDueCards.map((card) => (
                    <li key={card.id}>
                      <Link
                        href={`/cards/${card.id}`}
                        className="group flex items-center justify-between gap-2 rounded-md px-2 py-1.5 -mx-2 text-sm transition-colors hover:bg-accent/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <span className="truncate font-medium">{card.genericName}</span>
                        <ArrowRight
                          className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  ))}
                  {dueCount > validDueCards.length ? (
                    <li className="px-2 text-[11px] text-muted-foreground">
                      {home.reviewMore(dueCount - validDueCards.length)}
                    </li>
                  ) : null}
                </ul>
              ) : (
                <Button asChild variant="ghost" size="sm" className="-ml-2 mt-2 h-8 text-xs">
                  <Link href="/cards">
                    {home.reviewCardCta}
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>{home.progressTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-3 gap-2">
                <ProgressStat
                  icon={<BookOpen className="h-3.5 w-3.5" aria-hidden="true" />}
                  label={home.progressLearned}
                  value={progress.learnedCount}
                  total={totalCards}
                  unit={home.progressUnit}
                />
                <ProgressStat
                  icon={<Layers className="h-3.5 w-3.5" aria-hidden="true" />}
                  label={home.progressToday}
                  value={progress.reviewedTodayCount}
                  unit={home.progressUnit}
                />
                <ProgressStat
                  icon={<Flame className="h-3.5 w-3.5" aria-hidden="true" />}
                  label={home.progressStreak}
                  value={progress.streakDays}
                  unit={home.progressStreakUnit}
                />
              </dl>

              {/* 学习进度条：已学 / 总卡片 */}
              <div className="mt-3">
                <div
                  className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
                  role="progressbar"
                  aria-valuenow={progress.learnedCount}
                  aria-valuemin={0}
                  aria-valuemax={totalCards}
                  aria-label={home.progressLearned}
                >
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{
                      width: `${totalCards === 0 ? 0 : Math.min(100, (progress.learnedCount / totalCards) * 100)}%`,
                    }}
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  {home.progressCoverage(progress.learnedCount, totalCards)}
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 学习热力图 */}
        <section className="mt-8">
          <Card>
            <CardContent className="p-4">
              <StudyHeatmap
                dailyCounts={dailyCounts}
                today={today}
                weeks={HEATMAP_WEEKS}
              />
            </CardContent>
          </Card>
        </section>

        {/* 测验入口 */}
        <section className="mt-8" aria-labelledby="quiz-entry-heading">
          <Card className="border-primary/15">
            <CardContent className="flex items-center justify-between gap-3 p-4">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ListChecks className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <h2 id="quiz-entry-heading" className="text-[15px] font-semibold">
                    {home.quizEntryTitle}
                  </h2>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {home.quizEntryBody(quizStats.answeredToday, quizStats.wrongCount)}
                  </p>
                </div>
              </div>
              <Button asChild size="sm" className="shrink-0">
                <Link href="/quiz">
                  {home.quizEntryCta}
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* 分类入口 */}
        <section className="mt-10" aria-labelledby="categories-heading">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 id="categories-heading" className="text-lg font-semibold tracking-tight">
                {home.categoriesTitle}
              </h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {home.categoriesBody}
              </p>
            </div>
            <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
              {home.totalCountLabel(totalCards)}
            </span>
          </div>

          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {CATEGORIES.map((category) => (
              // min-w-0 必不可少：grid 子项默认 min-width:auto，长摘要会把整行撑出视口
              <li key={category.id} className="min-w-0">
                <Link
                  href={`/cards?category=${category.id}`}
                  className="group flex w-full items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3 transition-colors hover:border-primary/40 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-medium">{category.name}</span>
                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                      {category.summary}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1 whitespace-nowrap text-xs tabular-nums text-muted-foreground">
                    {home.categoriesCardCount(counts[category.id])}
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* 推荐卡片 */}
        <section className="mt-10" aria-labelledby="featured-heading">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 id="featured-heading" className="text-lg font-semibold tracking-tight">
                {home.featuredTitle}
              </h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {home.featuredBody}
              </p>
            </div>
            <Button asChild variant="ghost" size="sm" className="h-8 shrink-0 px-2 text-xs">
              <Link href="/cards">
                {home.viewAll}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </Button>
          </div>
          <ul className="mt-4 space-y-3">
            {featured.map((card) => (
              <li key={card.id}>
                <DrugCardListItem
                  card={{
                    id: card.id,
                    genericName: card.genericName,
                    englishName: card.englishName,
                    brandNames: [...card.brandNames],
                    category: card.category,
                    categoryName: getCategoryName(card.category),
                    target: card.target,
                    primaryIndication: card.indications[0] ?? "",
                    indications: [...card.indications],
                    mechanismSteps: card.mechanismSteps.map((step) => ({
                      title: step.title,
                      detail: step.detail,
                    })),
                    adverseReactions: [...card.adverseReactions],
                    memoryTip: card.memoryTip,
                  }}
                />
              </li>
            ))}
          </ul>
        </section>

        {/* 使用方法 */}
        <section id="method" className="mt-10 scroll-mt-20" aria-labelledby="method-heading">
          <h2 id="method-heading" className="text-lg font-semibold tracking-tight">
            {home.methodTitle}
          </h2>
          <ol className="mt-4 space-y-3">
            {home.methodSteps.map((step, index) => (
              <li key={step.title} className="flex gap-3 rounded-lg border bg-card p-4">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold tabular-nums text-primary">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-[15px] font-medium">{step.title}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function ProgressStat({
  icon,
  label,
  value,
  total,
  unit,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  total?: number;
  unit: string;
}) {
  return (
    <div>
      <dt className="flex items-center gap-1 text-[11px] text-muted-foreground">
        {icon}
        <span className="truncate">{label}</span>
      </dt>
      <dd className="mt-1 text-xl font-semibold leading-none tabular-nums">
        {value}
        {total !== undefined ? (
          <span className="text-xs font-normal text-muted-foreground">/{total}</span>
        ) : null}
        <span className="ml-1 text-[11px] font-normal text-muted-foreground">{unit}</span>
      </dd>
    </div>
  );
}
