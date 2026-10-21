import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Circle } from "lucide-react";

import { WrongBookList } from "@/components/quiz/wrong-book-list";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { wrongBook } from "@/lib/copy";
import { cardRepository } from "@/lib/data";
import { quizRepository } from "@/lib/data/quiz";
import { compareRepository } from "@/lib/data/compare";
import { buildCompareQuestion } from "@/lib/quiz/compare-generator";

export const metadata: Metadata = {
  title: wrongBook.pageTitle,
  description: wrongBook.pageBody,
};

export const dynamic = "force-dynamic";

export default async function WrongBookPage() {
  const [wrongQuestions, allCards, compareGroups] = await Promise.all([
    quizRepository.getWrongQuestions(),
    cardRepository.getAll(),
    compareRepository.getAll(),
  ]);

  const cardById = new Map(allCards.map((card) => [card.id, card]));

  // 把错题与卡片信息合并，供列表展示
  const items = wrongQuestions
    .map((record) => {
      const card = cardById.get(record.cardId);
      if (!card) return null;
      return {
        questionId: record.questionId,
        cardId: record.cardId,
        genericName: card.genericName,
        englishName: card.englishName,
        kind: record.kind,
        comparison: record.kind === "compare"
          ? buildCompareQuestion(record.questionId, compareGroups, allCards)?.comparison
          : undefined,
        wrongCount: record.wrongCount,
        mastered: record.lastCorrectAt !== null,
      };
    })
    .filter((item) => item !== null);

  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-content px-4 pb-4">
        <div className="pt-6">
          <Link
            href="/quiz"
            className="inline-flex items-center gap-1 rounded-md text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            测验
          </Link>
          <h1 className="mt-2 text-[24px] font-semibold tracking-tight sm:text-[28px]">
            {wrongBook.pageTitle}
          </h1>
          <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
            {wrongBook.pageBody}
          </p>
        </div>

        {items.length === 0 ? (
          <Card className="mt-6">
            <CardContent className="px-4 py-12 text-center">
              <CheckCircle2
                className="mx-auto h-8 w-8 text-emerald-500/70"
                aria-hidden="true"
              />
              <p className="mt-3 text-sm font-medium">{wrongBook.emptyTitle}</p>
              <p className="mt-1 text-xs text-muted-foreground">{wrongBook.emptyBody}</p>
              <Button asChild className="mt-5">
                <Link href="/quiz">
                  {wrongBook.goQuiz}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="mt-5">
            <WrongBookList items={items} />
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
