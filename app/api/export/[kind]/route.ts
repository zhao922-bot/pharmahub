import { NextResponse } from "next/server";
import { getChatGPTUser } from "@/app/chatgpt-auth";

import {
  buildExport,
  isExportFormat,
  isExportKind,
  type ExportFormat,
} from "@/lib/export/build";

/**
 * 学习数据下载端点。
 *
 * 路径：/api/export/{kind}?format=csv|json
 *
 * 为什么用 Route Handler 而不是 Server Action：Server Action 无法触发浏览器下载，
 * 只能返回数据再由客户端造 Blob。用 GET + Content-Disposition 更直接，
 * 也能被浏览器原生的「链接另存为」识别。
 *
 * 格式选择用 query 参数而不是独立路径：
 * `/api/export/reviews?format=json` 比 `/api/export-json/reviews` 更好记，
 * 也让「同一份数据的不同序列化」在语义上保持在一起。
 *
 * 响应头要点：
 * - Content-Type 带 charset=utf-8；CSV 另带 BOM，双重保证中文不乱码
 * - Content-Disposition 用 attachment 触发下载，文件名保持纯 ASCII
 * - Cache-Control: no-store，避免代理缓存个人学习数据
 */
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ kind: string }> },
) {
  if (!await getChatGPTUser()) return NextResponse.json({ ok: false, message: "请先登录" }, { status: 401, headers: { "Cache-Control": "no-store" } });
  const { kind } = await params;

  if (!isExportKind(kind)) {
    return NextResponse.json({ ok: false, message: "未知的导出类型" }, { status: 404 });
  }

  const rawFormat = new URL(request.url).searchParams.get("format") ?? "csv";
  if (!isExportFormat(rawFormat)) {
    return NextResponse.json({ ok: false, message: "未知的导出格式" }, { status: 400 });
  }

  const format: ExportFormat = rawFormat;
  const file = await buildExport(kind, format, new Date());

  return new NextResponse(file.content, {
    status: 200,
    headers: {
      "Content-Type": file.contentType,
      "Content-Disposition": `attachment; filename="${file.filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
