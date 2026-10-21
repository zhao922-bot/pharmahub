import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Columns2 } from "lucide-react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { compare as compareCopy, nav } from "@/lib/copy";
import { cardRepository } from "@/lib/data";
import { compareRepository } from "@/lib/data/compare";

export const metadata: Metadata = {
  title: compareCopy.pageTitle,
  description: compareCopy.pageBody,
};

export const dynamic = "force-dynamic";

export default async function ComparePage() {
  const [groups, cards] = await Promise.all([
    compareRepository.getAll(),
    cardRepository.getAll(),
  ]);

  const cardById = new Map(cards.map((card) => [card.id, card]));

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
            {compareCopy.pageTitle}
          </h1>
          <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
            {compareCopy.pageBody}
          </p>
        </div>

        {groups.length === 0 ? (
          <Card className="mt-6">
            <CardContent className="px-4 py-12 text-center">
              <Columns2
                className="mx-auto h-8 w-8 text-muted-foreground/50"
                aria-hidden="true"
              />
              <p className="mt-3 text-sm font-medium">{compareCopy.emptyTitle}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {compareCopy.emptyBody}
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <p className="mt-5 text-xs text-muted-foreground">
              {compareCopy.groupCount(groups.length)}
            </p>

            <ul className="mt-2 space-y-3">
              {groups.map((group) => {
                // 组内药物名，用于卡片上的一行摘要
                const names = group.drugIds
                  .map((id) => cardById.get(id)?.genericName ?? id)
                  .filter(Boolean);

                return (
                  <li key={group.id}>
                    <Link
                      href={`/compare/${group.id}`}
                      className="block rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h2 className="text-[15px] font-semibold leading-snug">
                            {group.title}
                          </h2>
                          <p className="mt-1 text-xs leading-5 text-muted-foreground">
                            {group.summary}
                          </p>
                        </div>
                        <ArrowRight
                          className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
                          aria-hidden="true"
                        />
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-1.5">
                        {names.map((name) => (
                          <Badge key={name} variant="secondary" className="text-[11px]">
                            {name}
                          </Badge>
                        ))}
                        <span className="text-[11px] text-muted-foreground">
                          {compareCopy.drugCountLabel(group.drugIds.length)}
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
