import { toDateKey } from "@/lib/review/sm2";
/**
 * CSV 生成。
 *
 * 纯函数、无依赖，便于单元测试。导出的数据要能在 Excel / Numbers /
 * LibreOffice 里正确打开，有两个细节必须处理：
 *
 * 1. **BOM**：Excel 在 Windows 上默认按 GBK 解析 CSV，没有 BOM 时中文会乱码。
 *    在文件开头加 UTF-8 BOM（\uFEFF）是兼容性最好的做法。
 * 2. **转义**：字段里含逗号、双引号或换行时必须用双引号包裹，
 *    且内部的双引号要写成两个双引号（RFC 4180）。
 *    药品名里出现逗号的机会不多，但不良反应描述里常有。
 */

/** UTF-8 BOM。Excel 靠它识别编码 */
export const UTF8_BOM = "\uFEFF";

/** CRLF 换行：RFC 4180 规定，也是 Excel 最稳的选择 */
const CRLF = "\r\n";

/**
 * 转义单个字段。
 *
 * 规则：
 * - 含逗号、双引号、CR 或 LF → 用双引号包裹，内部双引号翻倍
 * - 其余原样输出
 * - null / undefined → 空字符串
 */
export function escapeCsvField(value: unknown): string {
  if (value === null || value === undefined) return "";

  const text = String(value);
  // 前置的 = + - @ 会被 Excel 当成公式执行，加一个前导单引号阻断（CSV 注入防护）
  const needsFormulaGuard = /^[=+\-@]/.test(text);
  const guarded = needsFormulaGuard ? `'${text}` : text;

  if (/[",\r\n]/.test(guarded)) {
    return `"${guarded.replace(/"/g, '""')}"`;
  }
  return guarded;
}

/**
 * 把表头与行数据拼成完整 CSV 文本（含 BOM）。
 *
 * 行长度不齐时以表头长度为准补空，避免产生错位的表格。
 */
export function buildCsv(
  headers: readonly string[],
  rows: ReadonlyArray<ReadonlyArray<unknown>>,
): string {
  const lines: string[] = [];

  lines.push(headers.map(escapeCsvField).join(","));

  for (const row of rows) {
    const cells: string[] = [];
    for (let i = 0; i < headers.length; i += 1) {
      cells.push(escapeCsvField(row[i]));
    }
    lines.push(cells.join(","));
  }

  return UTF8_BOM + lines.join(CRLF) + CRLF;
}

/**
 * 生成下载文件名。
 *
 * 用纯 ASCII（项目名 + 类型 + 日期 + 扩展名），避免 Content-Disposition 里的
 * 非 ASCII 字符在不同浏览器/代理下表现不一致。日期让文件不会互相覆盖。
 *
 * 扩展名由调用方给出（csv / json），这样同一个 kind 导出两种格式时文件名不冲突。
 */
export function buildExportFilename(kind: string, date: Date, extension = "csv"): string {
  return `pharmahub-${kind}-${toDateKey(date).replaceAll("-", "")}.${extension}`;
}
