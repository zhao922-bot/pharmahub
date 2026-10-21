/**
 * 导出数据的序列化。
 *
 * 为什么单独成文件：`lib/export/build.ts` 依赖 `server-only` 与数据库，
 * 单元测试无法导入。把「数据集 → CSV/JSON 文本」这段纯逻辑抽出来，
 * 就能脱离服务端环境直接测试。
 *
 * 架构上是这样的分工：
 *   build.ts    查数据库、把 id 翻译成中文名 → ExportDataset
 *   serialize.ts ExportDataset → 文本（本文件，纯函数）
 */

import { buildCsv } from "@/lib/export/csv";

/** 一列的定义：JSON 用 key，CSV 用 header */
export interface ExportColumn {
  key: string;
  header: string;
}

/** 一条导出记录。值只允许标量，保证两种格式都能无损表达 */
export type ExportRecord = Record<string, string | number | boolean | null>;

/** 结构化导出数据集 */
export interface ExportDataset {
  kind: string;
  /** 列顺序，决定 CSV 列序与 JSON 字段序 */
  columns: readonly ExportColumn[];
  records: readonly ExportRecord[];
}

/** 把数据集转成 CSV 文本 */
export function datasetToCsv(dataset: ExportDataset): string {
  const headers = dataset.columns.map((column) => column.header);
  const rows = dataset.records.map((record) =>
    dataset.columns.map((column) => {
      const value = record[column.key];
      if (value === null || value === undefined) return "";
      // 布尔值转成中文「是/否」更适合阅读
      if (typeof value === "boolean") return value ? "是" : "否";
      return value;
    }),
  );
  return buildCsv(headers, rows);
}

/**
 * 把数据集转成 JSON 文本。
 *
 * 结构：
 * ```json
 * {
 *   "exportedAt": "2026-10-19T02:30:00.000Z",
 *   "kind": "reviews",
 *   "count": 3,
 *   "columns": [{ "key": "reviewedAt", "header": "复习时刻" }],
 *   "records": [{ "reviewedAt": "...", "genericName": "美托洛尔" }]
 * }
 * ```
 *
 * 为什么带上 `columns`：脚本处理时需要知道字段的中文含义，否则只能靠猜。
 * 同时 `records` 里的 key 是稳定的英文标识，便于写代码。
 *
 * 缩进 2 空格：导出文件通常会被直接打开看一眼，可读性优先于体积。
 */
export function datasetToJson(dataset: ExportDataset, now: Date): string {
  const payload = {
    exportedAt: now.toISOString(),
    kind: dataset.kind,
    count: dataset.records.length,
    columns: dataset.columns,
    records: dataset.records,
  };
  return `${JSON.stringify(payload, null, 2)}\n`;
}
