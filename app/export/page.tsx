import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Braces, Download, FileDown, Table2 } from "lucide-react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { exportCopy, nav } from "@/lib/copy";
import { getExportCounts, type ExportKind } from "@/lib/export/build";

export const metadata: Metadata = {
  title: exportCopy.pageTitle,
  description: exportCopy.pageBody,
};

export const dynamic = "force-dynamic";

interface ExportItem {
  kind: ExportKind;
  title: string;
  body: string;
}

const ITEMS: readonly ExportItem[] = [
  { kind: "reviews", title: exportCopy.reviewsTitle, body: exportCopy.reviewsBody },
  { kind: "quiz", title: exportCopy.quizTitle, body: exportCopy.quizBody },
  { kind: "wrong-book", title: exportCopy.wrongBookTitle, body: exportCopy.wrongBookBody },
  { kind: "favorites", title: exportCopy.favoritesTitle, body: exportCopy.favoritesBody },
];

export default async function ExportPage() {
  const counts = await getExportCounts();
  const total = Object.values(counts).reduce((sum, value) => sum + value, 0);

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
            {exportCopy.pageTitle}
          </h1>
          <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
            {exportCopy.pageBody}
          </p>
        </div>

        {total === 0 ? (
          <Card className="mt-6">
            <CardContent className="px-4 py-12 text-center">
              <FileDown
                className="mx-auto h-8 w-8 text-muted-foreground/50"
                aria-hidden="true"
              />
              <p className="mt-3 text-sm font-medium">{exportCopy.emptyAllTitle}</p>
              <p className="mt-1 text-xs text-muted-foreground">{exportCopy.emptyAllBody}</p>
              <div className="mt-5 flex flex-col gap-2">
                <Button asChild>
                  <Link href="/cards">
                    {exportCopy.goCards}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/quiz">{exportCopy.goQuiz}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* 格式说明：两种格式的用途不同，先说清楚再让人选 */}
            <div className="mt-5 rounded-lg border border-dashed border-border bg-muted/20 p-3.5">
              <p className="text-xs font-medium">{exportCopy.formatTitle}</p>
              <ul className="mt-1.5 space-y-1 text-xs leading-5 text-muted-foreground">
                <li>
                  <span className="font-medium text-foreground/80">
                    {exportCopy.formatCsvName}
                  </span>
                  {exportCopy.formatCsvHint}
                </li>
                <li>
                  <span className="font-medium text-foreground/80">
                    {exportCopy.formatJsonName}
                  </span>
                  {exportCopy.formatJsonHint}
                </li>
              </ul>
            </div>

            <ul className="mt-4 space-y-3">
              {ITEMS.map((item) => {
                const count = counts[item.kind];
                const disabled = count === 0;
                return (
                  <li key={item.kind}>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h2 className="text-[15px] font-semibold">{item.title}</h2>
                            <p className="mt-1 text-xs leading-5 text-muted-foreground">
                              {item.body}
                            </p>
                          </div>
                          <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[11px] tabular-nums text-muted-foreground">
                            {disabled ? exportCopy.empty : exportCopy.rowCount(count)}
                          </span>
                        </div>

                        {disabled ? (
                          <p className="mt-3 text-xs text-muted-foreground">
                            {exportCopy.empty}
                          </p>
                        ) : (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {/* 用普通链接触发下载：浏览器原生识别 attachment 响应头 */}
                            <Button asChild size="sm">
                              <a href={`/api/export/${item.kind}?format=csv`} download>
                                <Table2 className="h-3.5 w-3.5" aria-hidden="true" />
                                {exportCopy.downloadCsv}
                              </a>
                            </Button>
                            <Button asChild size="sm" variant="outline">
                              <a href={`/api/export/${item.kind}?format=json`} download>
                                <Braces className="h-3.5 w-3.5" aria-hidden="true" />
                                {exportCopy.downloadJson}
                              </a>
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </li>
                );
              })}
            </ul>
          </>
        )}

        <div className="mt-6 rounded-lg border border-dashed border-border bg-muted/20 p-4">
          <p className="text-xs font-medium">{exportCopy.noteTitle}</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {exportCopy.noteBody}
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
