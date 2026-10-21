import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Lightbulb, Stethoscope } from "lucide-react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { compare as compareCopy, detail, nav } from "@/lib/copy";
import { cardRepository } from "@/lib/data";
import { compareRepository } from "@/lib/data/compare";

/**
 * 对比详情页。
 *
 * 移动端的关键设计：**不用 <table>**。
 *
 * 3 个药 × 8 个维度在 375px 下无法做成传统表格——每列只有 90px，
 * 药名稍长就会换行成三四行，整张表失去可读性。
 *
 * 改为「按维度分组」的卡片流：每个维度一张小卡，卡内纵向列出各药取值。
 * 这样每个取值都能拿到整行宽度，药名与内容都不会被挤压。
 *
 * 代价是失去「横向扫视一列」的能力。为了补偿，每个取值前加了药名标签，
 * 并且用不同的左边框色区分药物——扫视时靠颜色定位，比靠位置更快。
 */

/**
 * 药物配色：按索引循环，帮助扫视时快速定位。
 *
 * 注意这里用**绝对定位的色条**而不是 border-left。
 * 原因：父级 <ul> 用了 divide-y divide-border/60，Tailwind 的 divide-*
 * 会设置子元素的 border-color，优先级与 border-l-amber-500 相同但后声明，
 * 结果把彩色左边框覆盖成灰色——看起来像没生效，实际是被 divide 吃掉了。
 * 换成独立的色条元素就绕开了这个冲突。
 */
const DRUG_ACCENTS = [
  { bar: "bg-primary", badge: "bg-primary/10 text-primary" },
  { bar: "bg-amber-500", badge: "bg-amber-500/10 text-amber-700 dark:text-amber-400" },
  { bar: "bg-emerald-600", badge: "bg-emerald-600/10 text-emerald-700 dark:text-emerald-400" },
  { bar: "bg-violet-500", badge: "bg-violet-500/10 text-violet-700 dark:text-violet-400" },
] as const;

/**
 * 按索引取配色。
 *
 * 项目开了 noUncheckedIndexedAccess，数组下标访问返回 T | undefined。
 * 这里用取模保证索引始终落在范围内，但 TypeScript 不知道这点，
 * 所以用一个兜底值消除类型错误——比到处写非空断言更干净。
 */
function accentAt(index: number): (typeof DRUG_ACCENTS)[number] {
  return DRUG_ACCENTS[index % DRUG_ACCENTS.length] ?? DRUG_ACCENTS[0];
}

interface CompareDetailProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: CompareDetailProps): Promise<Metadata> {
  const group = await compareRepository.getById((await params).id);
  if (!group) return { title: compareCopy.pageTitle };
  return { title: group.title, description: group.summary };
}

export default async function CompareDetailPage({ params }: CompareDetailProps) {
  const [group, cards] = await Promise.all([
    compareRepository.getById((await params).id),
    cardRepository.getAll(),
  ]);

  if (!group) notFound();

  const cardById = new Map(cards.map((card) => [card.id, card]));
  // 保持 drugIds 的顺序，缺失的卡片过滤掉（数据校验脚本会保证不会缺失）
  const drugs = group.drugIds
    .map((id) => cardById.get(id))
    .filter((card): card is NonNullable<typeof card> => card !== undefined);

  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-content px-4 pb-4">
        <div className="pt-6">
          <Link
            href="/compare"
            className="inline-flex items-center gap-1 rounded-md text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            {compareCopy.backToList}
          </Link>
          <h1 className="mt-2 text-[24px] font-semibold leading-tight tracking-tight sm:text-[28px]">
            {group.title}
          </h1>
          <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
            {group.summary}
          </p>
        </div>

        {/* 参与对比的药物：顶部横向列出，作为「列头」的替代 */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {drugs.map((drug, index) => {
            const accent = accentAt(index);
            return (
              <Link
                key={drug.id}
                href={`/cards/${drug.id}`}
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ${accent.badge}`}
              >
                <span
                  aria-hidden="true"
                  className={`h-1.5 w-1.5 rounded-full ${accent.bar}`}
                />
                {drug.genericName}
              </Link>
            );
          })}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button asChild>
            <Link href={`/quiz?compare=${group.id}`}>
              {compareCopy.startQuiz}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground">{compareCopy.quizHint}</p>
        </div>

        {/* 对比维度：每个维度一张卡 */}
        <section className="mt-6" aria-labelledby="dimensions-heading">
          <h2 id="dimensions-heading" className="text-sm font-semibold tracking-tight">
            {compareCopy.dimensionHeader}
          </h2>

          <div className="mt-3 space-y-2.5">
            {group.rows.map((row) => (
              <div
                key={row.label}
                className="overflow-hidden rounded-lg border border-border bg-card"
              >
                <p className="border-b border-border/70 bg-muted/40 px-3.5 py-2 text-[13px] font-medium">
                  {row.label}
                </p>
                <ul className="divide-y divide-border/60">
                  {row.values.map((value, index) => {
                    const drug = drugs[index];
                    const accent = accentAt(index);
                    return (
                      <li
                        key={`${row.label}-${index}`}
                        className="relative flex gap-2.5 py-2.5 pl-4 pr-3.5"
                      >
                        {/* 药物色条：用绝对定位元素而非 border，避开 divide-* 的 border-color 覆盖 */}
                        <span
                          aria-hidden="true"
                          className={`absolute inset-y-0 left-0 w-[3px] ${accent.bar}`}
                        />
                        <span className="w-[4.5rem] shrink-0 pt-px text-[11px] font-medium text-muted-foreground">
                          {drug?.genericName ?? "—"}
                        </span>
                        <span className="min-w-0 flex-1 text-[13px] leading-6 text-foreground/85">
                          {value}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 关键差异：本视图的核心价值 */}
        <section className="mt-6" aria-labelledby="takeaways-heading">
          <div className="flex items-baseline justify-between gap-2">
            <h2
              id="takeaways-heading"
              className="flex items-center gap-1.5 text-sm font-semibold tracking-tight"
            >
              <Lightbulb className="h-4 w-4 text-amber-600" aria-hidden="true" />
              {compareCopy.takeawaysTitle}
            </h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {compareCopy.takeawaysHint}
          </p>

          <ul className="mt-2.5 space-y-2">
            {group.takeaways.map((takeaway) => (
              <li
                key={takeaway}
                className="flex gap-2 rounded-lg border border-amber-500/25 bg-amber-500/[0.06] px-3.5 py-2.5"
              >
                <Check
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600"
                  aria-hidden="true"
                />
                <span className="text-[13px] leading-6 text-foreground/85">
                  {takeaway}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* 选药场景 */}
        {group.scenarios && group.scenarios.length > 0 ? (
          <section className="mt-6" aria-labelledby="scenarios-heading">
            <h2
              id="scenarios-heading"
              className="flex items-center gap-1.5 text-sm font-semibold tracking-tight"
            >
              <Stethoscope className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              {compareCopy.scenariosTitle}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {compareCopy.scenariosHint}
            </p>

            <ul className="mt-2.5 space-y-2">
              {group.scenarios.map((scenario) => (
                <li
                  key={scenario}
                  className="rounded-lg border border-border bg-card px-3.5 py-2.5 text-[13px] leading-6 text-foreground/85"
                >
                  {scenario}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* 涉及的卡片 */}
        <section className="mt-6" aria-labelledby="cards-heading">
          <h2 id="cards-heading" className="text-sm font-semibold tracking-tight">
            {compareCopy.cardsTitle}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">{compareCopy.cardsHint}</p>

          <ul className="mt-2.5 space-y-2">
            {drugs.map((drug) => (
              <li key={drug.id}>
                <Link
                  href={`/cards/${drug.id}`}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-3.5 py-3 transition-colors hover:border-primary/40 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{drug.genericName}</p>
                    <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                      {drug.englishName} · {drug.target}
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

        {group.sources && group.sources.length > 0 ? (
          <section className="mt-6" aria-labelledby="sources-heading">
            <h2 id="sources-heading" className="text-sm font-semibold tracking-tight">
              {compareCopy.sourcesTitle}
            </h2>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {compareCopy.sourcesHint}
            </p>
            <ul className="mt-2.5 space-y-2">
              {group.sources.map((source) => (
                <li key={source.url} className="rounded-lg border border-border bg-card px-3.5 py-2.5">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-words text-[13px] font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {source.title}
                  </a>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{source.sections}</p>
                </li>
              ))}
            </ul>
            {group.sourcesCheckedOn ? (
              <p className="mt-2 text-xs text-muted-foreground">
                {compareCopy.sourcesCheckedOn(group.sourcesCheckedOn)}
              </p>
            ) : null}
          </section>
        ) : null}

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Link
            href="/compare"
            className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border bg-background px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {compareCopy.backToList}
          </Link>
          <Link
            href="/cards"
            className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border bg-background px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {nav.cards}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
