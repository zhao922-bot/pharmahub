import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { cardRepository } from "@/lib/data/cards";
import { getDatabase } from "@/lib/db/sqlite";
import {
  importLearningDataset,
  ImportValidationError,
} from "@/lib/export/import";

export const dynamic = "force-dynamic";

const MAX_IMPORT_BYTES = 2 * 1024 * 1024;

export async function POST(request: Request) {
  const contentLength = request.headers.get("content-length");
  if (contentLength !== null) {
    const size = Number(contentLength);
    if (Number.isFinite(size) && size > MAX_IMPORT_BYTES) {
      return NextResponse.json(
        { ok: false, message: "导入文件不能超过 2 MB。" },
        { status: 400 },
      );
    }
  }

  let rawText: string;
  try {
    rawText = await request.text();
  } catch {
    return NextResponse.json(
      { ok: false, message: "读取请求内容失败。" },
      { status: 400 },
    );
  }

  if (Buffer.byteLength(rawText, "utf8") > MAX_IMPORT_BYTES) {
    return NextResponse.json(
      { ok: false, message: "导入文件不能超过 2 MB。" },
      { status: 400 },
    );
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(rawText);
  } catch {
    return NextResponse.json(
      { ok: false, message: "文件内容不是合法的 JSON 格式。" },
      { status: 400 },
    );
  }

  try {
    const cards = await cardRepository.getAll();
    const validCardIds = new Set(cards.map((card) => card.id));
    const summary = await importLearningDataset(parsedJson, {
      db: getDatabase(),
      validCardIds,
    });

    revalidatePath("/");
    revalidatePath("/cards");
    revalidatePath("/review");
    revalidatePath("/quiz");
    revalidatePath("/wrong-book");
    revalidatePath("/export");

    return NextResponse.json({ ok: true, ...summary }, { status: 200 });
  } catch (error) {
    if (error instanceof ImportValidationError) {
      return NextResponse.json(
        { ok: false, message: error.message },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { ok: false, message: "导入失败，请稍后重试。" },
      { status: 500 },
    );
  }
}
