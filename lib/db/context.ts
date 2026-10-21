import "server-only";
import { env } from "cloudflare:workers";
import { cache } from "react";
import { requireChatGPTUser } from "@/app/chatgpt-auth";
import type { DataContext } from "./types";

// React cache is request-scoped. Never put visitor IDs or D1 sessions in a process-global variable.
export const getDataContext = cache(async (): Promise<DataContext> => {
  const user = await requireChatGPTUser("/");
  if (!env.DB) throw new Error("云端数据库尚未就绪，请稍后重试。");
  return { userId: user.userId, db: env.DB.withSession("first-primary") };
});
