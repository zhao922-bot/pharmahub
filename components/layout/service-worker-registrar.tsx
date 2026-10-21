"use client";

import { useEffect } from "react";

/**
 * 注册 Service Worker。
 *
 * 只在生产环境注册：开发模式下 SW 会缓存 `_next/static` 里的旧 chunk，
 * 导致改了代码刷新看不到效果，是 Next.js + SW 最常见的坑。
 *
 * 这里不做「有新版本请刷新」的提示条。理由：本项目内容更新频率低，
 * 且数据都在服务端，刷新与否不影响数据正确性；加提示条反而打扰。
 * SW 用 skipWaiting + clients.claim，新版本会在下次导航时自然生效。
 */
export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;

    // 等页面加载完再注册，避免与首屏渲染抢带宽
    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // 注册失败不影响正常使用，静默忽略
      });
    };

    if (document.readyState === "complete") {
      register();
    } else {
      window.addEventListener("load", register, { once: true });
      return () => window.removeEventListener("load", register);
    }
  }, []);

  return null;
}
