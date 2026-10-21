"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Pill } from "lucide-react";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { nav, site } from "@/lib/copy";
import { cn } from "@/lib/utils";

/**
 * 顶部导航。移动端优先：左侧品牌标识，右侧入口，
 * 内容区最大宽度 720px 居中（桌面端）。
 *
 * 宽度适配（这一块踩过坑，记录一下）：
 *
 * 导航有 4 项（首页/卡片库/对比/测验）+ 主题按钮，右侧固定占约 230px。
 * 最初英文名用 min-[400px]:inline 显示，结果 412px 宽（Pixel、多数国产
 * 安卓的默认宽度）下品牌从 73px 涨到 160px，正好把导航挤出去 2px。
 * 320px 小屏也会溢出 7px。
 *
 * 教训：用「像素断点」控制显示，一旦旁边的内容变多（比如加了「对比」），
 * 断点就不再安全。改成按 Tailwind 语义断点（sm = 640px）控制，
 * 手机上一律只显示中文品牌名，桌面端（内容区 720px）显示英文名。
 *
 * 同时把导航项在最小屏上收紧一档内边距与字号，保证 320px 不溢出。
 */
export function SiteHeader({ className }: { className?: string }) {
  const pathname = usePathname();

  const items = [
    { href: "/", label: nav.home },
    { href: "/cards", label: nav.cards },
    { href: "/compare", label: nav.compare },
    { href: "/quiz", label: nav.quiz },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70",
        className,
      )}
    >
      <div className="mx-auto flex h-14 w-full max-w-content items-center justify-between gap-2 px-4">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Pill className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
          <span className="flex items-baseline gap-1.5 whitespace-nowrap">
            <span className="text-[17px] font-semibold tracking-tight">{site.name}</span>
            <span className="hidden text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground sm:inline">
              {site.nameEn}
            </span>
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-0.5">
          <nav aria-label="主导航" className="flex items-center gap-0.5">
            {items.map((item) => {
              const active =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "whitespace-nowrap rounded-md px-1.5 py-1.5 text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-2 sm:text-sm",
                    active
                      ? "font-medium text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
