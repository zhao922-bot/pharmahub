"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

import { install } from "@/lib/copy";

const STORAGE_KEY = "pharmahub-install-dismissed";

/**
 * 「装到主屏幕」引导。
 *
 * 为什么要这个组件：
 * 安卓 Chrome 会在满足 PWA 条件时自动弹出安装提示，但 iOS Safari **永远不会**——
 * 苹果只提供手动「添加到主屏幕」的路径。所以在 iPhone 上，
 * 用户如果不知道这个操作，就永远用不上离线能力。
 *
 * 显示策略：
 * - 只在移动端显示（桌面端浏览器有地址栏安装图标，不需要引导）
 * - 已经以独立窗口运行（standalone）时不显示
 * - 用户关掉后不再打扰（localStorage 记住）
 * - 用 useEffect 读取 localStorage，避免服务端渲染时访问 window
 */
export function InstallPrompt() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 已经是独立窗口（装过了），不显示
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // iOS Safari 的私有属性
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    if (standalone) return;

    // 用户之前关过
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") return;
    } catch {
      // 隐私模式下 localStorage 可能抛错，忽略即可
    }

    // 只在移动端显示
    const isMobile = window.matchMedia("(max-width: 640px)").matches;
    if (!isMobile) return;

    setVisible(true);
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // 忽略
    }
  };

  if (!visible) return null;

  const isIOS =
    typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent);

  const steps = isIOS ? install.iosSteps : install.androidSteps;

  return (
    <section
      aria-labelledby="install-heading"
      className="mt-6 rounded-lg border border-primary/25 bg-primary/[0.04] p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Download className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <h2 id="install-heading" className="text-sm font-semibold">
            {install.title}
          </h2>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label={install.dismiss}
          className="-m-1 rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <p className="mt-1.5 text-xs leading-5 text-muted-foreground">{install.body}</p>

      <ol className="mt-2.5 space-y-1.5">
        {steps.map((step, index) => (
          <li key={step} className="flex gap-2 text-[13px] leading-6 text-foreground/85">
            <span
              aria-hidden="true"
              className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary"
            >
              {index + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
