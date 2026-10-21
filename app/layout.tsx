import type { Metadata, Viewport } from "next";

import { ServiceWorkerRegistrar } from "@/components/layout/service-worker-registrar";
import { ThemeScript } from "@/components/layout/theme-toggle";
import { site } from "@/lib/copy";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${site.fullName} · 药物作用机制学习伴侣`,
    template: `%s · ${site.fullName}`,
  },
  description: site.description,
  applicationName: site.fullName,
  keywords: ["药理学", "药物机制", "间隔重复", "药师考试", "药枢"],
  authors: [{ name: site.fullName }],
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  // PWA：装到主屏幕后以独立窗口运行，没有浏览器地址栏
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: site.name,
    statusBarStyle: "default",
  },
  icons: {
    icon: [
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // 移动端优先：允许用户缩放，避免影响可访问性
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1e3a5f" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        {/* 在 React 水合前设置主题类，避免深色模式首屏闪白 */}
        <ThemeScript />
      </head>
      <body className="min-h-dvh bg-background font-sans">
        {children}
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}
