import type { Metadata } from "next";
import Link from "next/link";
import { WifiOff } from "lucide-react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { offline } from "@/lib/copy";

export const metadata: Metadata = {
  title: offline.title,
  description: offline.body,
  // 离线页不该被搜索引擎收录
  robots: { index: false, follow: false },
};

/**
 * 离线兜底页。
 *
 * 由 Service Worker 预缓存，断网且页面未缓存时展示。
 *
 * 这里要说清一件事：**复习记录存在电脑上，手机上断网就写不进去**。
 * 与其让用户以为数据丢了，不如直接说明哪些能用、哪些不能。
 */
export default function OfflinePage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-content px-4 pb-4">
        <div className="flex flex-col items-center pt-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <WifiOff className="h-7 w-7 text-muted-foreground" aria-hidden="true" />
          </span>
          <h1 className="mt-5 text-[22px] font-semibold tracking-tight">{offline.title}</h1>
          <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
            {offline.body}
          </p>
        </div>

        <section className="mt-8" aria-labelledby="offline-detail">
          <h2 id="offline-detail" className="text-sm font-semibold tracking-tight">
            {offline.detailTitle}
          </h2>
          <ul className="mt-2.5 space-y-2">
            {offline.details.map((item) => (
              <li
                key={item}
                className="rounded-lg border border-border bg-card px-3.5 py-2.5 text-[13px] leading-6 text-foreground/85"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-8 flex flex-col gap-2 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {offline.retry}
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
