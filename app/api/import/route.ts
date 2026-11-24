import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { getChatGPTUser } from "@/app/chatgpt-auth";
import { cardRepository } from "@/lib/data/cards";
import { importRepository } from "@/lib/data/import";
import {
  ImportValidationError,
  parseImportDataset,
} from "@/lib/export/import";

export const dynamic = "force-dynamic";

const MAX_IMPORT_BYTES = 2 * 1024 * 1024;
const NO_STORE_HEADERS = { "Cache-Control": "no-store" } as const;

export async function POST(request: Request) {
  if (!(await getChatGPTUser())) {
    return NextResponse.json(
      { ok: false, message: "请先登录" },
      { status: 401, headers: NO_STORE_HEADERS },
    );
  }

  const contentLength = request.headers.get("content-length");
  if (contentLength !== null) {
    const size = Number(contentLength);
    if (Number.isFinite(size) && size > MAX_IMPORT_BYTES) {
      return NextResponse.json(
        { ok: false, message: "导入文件不能超过 2 MB。" },
        { status: 400, headers: NO_STORE_HEADERS },
      );
    }
  }

  let rawText: string;
  try {
    rawText = await request.text();
  } catch {
    return NextResponse.json(
      { ok: false, message: "读取请求内容失败。" },
      { status: 400, headers: NO_STORE_HEADERS },
    );
  }

  if (new TextEncoder().encode(rawText).byteLength > MAX_IMPORT_BYTES) {
    return NextResponse.json(
      { ok: false, message: "导入文件不能超过 2 MB。" },
      { status: 400, headers: NO_STORE_HEADERS },
    );
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(rawText);
  } catch {
    return NextResponse.json(
      { ok: false, message: "文件内容不是合法的 JSON 格式。" },
      { status: 400, headers: NO_STORE_HEADERS },
    );
  }

  try {
    const cards = await cardRepository.getAll();
    const validCardIds = new Set(cards.map((card) => card.id));
    const dataset = parseImportDataset(parsedJson, validCardIds);
    const summary = await importRepository.mergeDataset(dataset);

    revalidatePath("/");
    revalidatePath("/cards");
    revalidatePath("/review");
    revalidatePath("/quiz");
    revalidatePath("/wrong-book");
    revalidatePath("/export");

    return NextResponse.json(
      { ok: true, ...summary },
      { status: 200, headers: NO_STORE_HEADERS },
    );
  } catch (error) {
    if (error instanceof ImportValidationError) {
      return NextResponse.json(
        { ok: false, message: error.message },
        { status: 400, headers: NO_STORE_HEADERS },
      );
    }
    return NextResponse.json(
      { ok: false, message: "导入失败，请稍后重试。" },
      { status: 500, headers: NO_STORE_HEADERS },
    );
  }
}
