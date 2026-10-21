import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { CardBrowser } from "@/components/cards/card-browser";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { cards as cardsCopy, nav } from "@/lib/copy";
import { CATEGORIES, cardRepository, isCategoryId } from "@/lib/data";
import type { CategoryId } from "@/lib/types";

export const metadata: Metadata = {
  title: cardsCopy.pageTitle,
  description: cardsCopy.pageBody,
};

interface CardsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function CardsPage({ searchParams }: CardsPageProps) {
  const [summaries, counts] = await Promise.all([
    cardRepository.getSummaries({}),
    cardRepository.getCategoryCounts(),
  ]);

  const totalCount = summaries.length;

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
          <h1 className="mt-2 text-[24px] font-semibold tracking-tight sm:text-[28px]">
            {cardsCopy.pageTitle}
          </h1>
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
          />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
