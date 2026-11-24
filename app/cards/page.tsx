import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { CardBrowser } from "@/components/cards/card-browser";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { cards as cardsCopy, nav } from "@/lib/copy";
import { cardFilterCopy } from "@/lib/copy-features";
import { CATEGORIES, cardRepository, isCategoryId, studyRepository } from "@/lib/data";
import type { CategoryId } from "@/lib/types";

export const metadata: Metadata = {
  title: cardsCopy.pageTitle,
  description: cardsCopy.pageBody,
};

export const dynamic = "force-dynamic";

interface CardsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function CardsPage({ searchParams }: CardsPageProps) {
  const today = new Date();
  const [summaries, counts, favoriteIds, dueIds, reviewLogs] = await Promise.all([
    cardRepository.getSummaries({}),
    cardRepository.getCategoryCounts(),
    studyRepository.getFavoriteCardIds(),
    studyRepository.getDueCardIds(today),
    studyRepository.getAllReviewLogs(),
  ]);

  const totalCount = summaries.length;
  const learnedIds = reviewLogs.map((log) => log.cardId);

  // 从首页分类入口跳转时带上 category 参数；非法值一律回退为「全部」
  const rawCategory = (await searchParams).category;
  const initialCategory: CategoryId | null =
    rawCategory && isCategoryId(rawCategory) ? rawCategory : null;

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
            {nav.home}
          </Link>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-[24px] font-semibold tracking-tight sm:text-[28px]">
              {cardsCopy.pageTitle}
            </h1>
            <Button asChild size="sm" variant={dueIds.length > 0 ? "default" : "outline"} className="h-8 text-xs">
              <Link href="/review">
                {cardFilterCopy.reviewQueueCta}
                {dueIds.length > 0 ? (
                  <span className="rounded-full bg-primary-foreground/20 px-1.5 py-0.5 text-[10px] tabular-nums">
                    {dueIds.length}
                  </span>
                ) : null}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </Button>
          </div>
          <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
            {cardsCopy.pageBody}
          </p>
        </div>

        <div className="mt-5">
          <CardBrowser
            cards={summaries}
            categories={CATEGORIES}
            categoryCounts={counts}
            totalCount={totalCount}
            initialCategory={initialCategory}
            favoriteIds={favoriteIds}
            dueIds={dueIds}
            learnedIds={learnedIds}
          />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
