"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";

import { theme } from "@/lib/copy";
import { cn } from "@/lib/utils";

type ThemeMode = "light" | "dark" | "system";

const STORAGE_KEY = "pharmahub-theme";

/**
 * 主题切换按钮。
 *
 * 实现要点：
 * 1. 三态循环：浅色 → 深色 → 跟随系统。移动端用户常希望跟随系统。
 * 2. 首屏闪烁问题：初始渲染时读 localStorage 会在 hydration 后闪一下。
 *    这里用一个内联脚本在 <head> 里提前设置 class（见 ThemeScript），
 *    本组件只负责读当前状态和响应点击。
 * 3. 切换「跟随系统」时监听 prefers-color-scheme 变化。
 */
export function ThemeToggle({ className }: { className?: string }) {
  const [mode, setMode] = useState<ThemeMode>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "light" || stored === "dark" || stored === "system") setMode(stored);
    } catch {
      // 存储被禁用时仍允许本次会话切换主题。
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    function apply() {
      const shouldDark = mode === "dark" || (mode === "system" && media.matches);
      root.classList.toggle("dark", shouldDark);
      root.style.colorScheme = shouldDark ? "dark" : "light";
    }

    apply();
    try { window.localStorage.setItem(STORAGE_KEY, mode); } catch { /* 本次会话继续生效 */ }

    // 仅「跟随系统」时需要监听系统主题变化
    if (mode === "system") {
      media.addEventListener("change", apply);
      return () => media.removeEventListener("change", apply);
    }
    return undefined;
  }, [mode, mounted]);

  const nextMode: ThemeMode = mode === "light" ? "dark" : mode === "dark" ? "system" : "light";

  const Icon = mode === "light" ? Sun : mode === "dark" ? Moon : Monitor;
  const label =
    mode === "light" ? theme.light : mode === "dark" ? theme.dark : theme.system;

  return (
    <button
      type="button"
      onClick={() => setMode(nextMode)}
      aria-label={`${theme.toggleLabel}（当前：${label}）`}
      title={label}
      className={cn(
        "inline-flex h-8 items-center gap-1 rounded-md px-2 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
        className,
      )}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {/* 未挂载前不显示文字，避免服务端与客户端渲染不一致 */}
      <span className="hidden sm:inline">{mounted ? label : ""}</span>
    </button>
  );
}

/**
 * 首屏防闪烁脚本。
 *
 * 在 <head> 中同步执行，早于 React hydration，因此不会出现
 * 「先白后黑」的闪烁。必须内联，不能放到外部文件（否则是异步加载）。
 */
export function ThemeScript() {
  const script = `
(function() {
  try {
    var stored = null;
    try { stored = localStorage.getItem('${STORAGE_KEY}'); } catch (e) {}
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var dark = stored === 'dark' || (stored !== 'light' && stored !== 'dark' && prefersDark);
    if (dark) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.style.colorScheme = 'light';
    }
  } catch (e) {}
})();
`.trim();

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
