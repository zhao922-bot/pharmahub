import { fileURLToPath } from "node:url";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: fileURLToPath(new URL(".", import.meta.url)),
  // 阶段三引入 better-sqlite3 时，仅需在服务端适配层中使用；
  // 页面与数据访问层均不直接依赖 Node 专属 API，便于后续迁移到 Cloudflare。
  poweredByHeader: false,
};

export default nextConfig;
