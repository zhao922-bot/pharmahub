import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";

import { QuizRunner } from "@/components/quiz/quiz-runner";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { quiz as quizCopy } from "@/lib/copy";
import { CATEGORIES, cardRepository } from "@/lib/data";
import { quizRepository } from "@/lib/data/quiz";
import { compareRepository } from "@/lib/data/compare";
import { generateWrongBookQuiz } from "@/lib/quiz/generator";

export const metadata: Metadata = {
  title: quizCopy.reviewPageTitle,
  description: quizCopy.reviewPageBody,
};

export const dynamic = "force-dynamic";

export default async function QuizReviewPage() {
  const [allCards, wrongQuestions, compareGroups] = await Promise.all([
    cardRepository.getAll(),
    quizRepository.getWrongQuestions(),
    compareRepository.getAll(),
  ]);

  const categoryNames = new Map(CATEGORIES.map((category) => [category.id, category.name]));

  // 错题本已按「错误次数降序、最近答错时间降序」排好，
  // 这里直接沿用该顺序——错得最多的最该练。
  const questions = generateWrongBookQuiz({
    wrongQuestions,
    allCards,
    categoryNames,
    compareGroups,
  });

  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-content px-4 pb-4">
        <div className="pt-6">
          <Link
            href="/wrong-book"
            className="inline-flex items-center gap-1 rounded-md text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            {quizCopy.reviewBackToWrongBook}
          </Link>
          <h1 className="mt-2 text-[24px] font-semibold tracking-tight sm:text-[28px]">
            {quizCopy.reviewPageTitle}
          </h1>
          <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
            {quizCopy.reviewPageBody}
          </p>
        </div>

        {questions.length > 0 ? (
          <>
            <div className="mt-5 flex items-center justify-between gap-3">
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                {quizCopy.reviewCount(questions.length)}
              </p>
              <p className="text-[11px] text-muted-foreground">{quizCopy.reviewStartHint}</p>
            </div>

            <div className="mt-3">
              <QuizRunner questions={questions} mode="review" />
            </div>
          </>
        ) : (
          <Card className="mt-6">
            <CardContent className="px-4 py-12 text-center">
              <RotateCcw className="mx-auto h-8 w-8 text-muted-foreground/50" aria-hidden="true" />
              <p className="mt-3 text-sm font-medium">{quizCopy.reviewEmptyTitle}</p>
              <p className="mt-1 text-xs text-muted-foreground">{quizCopy.reviewEmptyBody}</p>
              <Button asChild className="mt-5">
                <Link href="/quiz">
                  {quizCopy.reviewEmptyCta}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
