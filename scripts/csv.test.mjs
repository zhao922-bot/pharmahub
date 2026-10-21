/**
 * CSV 生成单元测试。
 *
 * 直接 import 真实源码。重点验证：
 * 1. RFC 4180 转义（逗号、双引号、换行）
 * 2. UTF-8 BOM（Excel 中文不乱码的关键）
 * 3. CSV 注入防护（防止 Excel 把单元格当公式执行）
 * 4. 文件名格式
 *
 * 运行：pnpm test
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  buildCsv,
  buildExportFilename,
  escapeCsvField,
  UTF8_BOM,
} from "../lib/export/csv.ts";

// ---- 字段转义 ----

test("普通字段原样输出", () => {
  assert.equal(escapeCsvField("美托洛尔"), "美托洛尔");
  assert.equal(escapeCsvField("metoprolol"), "metoprolol");
  assert.equal(escapeCsvField(123), "123");
});

test("含逗号的字段用双引号包裹", () => {
  assert.equal(escapeCsvField("高血压,心绞痛"), '"高血压,心绞痛"');
});

test("含双引号的字段转义为两个双引号", () => {
  assert.equal(escapeCsvField('他说"你好"'), '"他说""你好"""');
});

test("含换行的字段用双引号包裹", () => {
  assert.equal(escapeCsvField("第一行\n第二行"), '"第一行\n第二行"');
  assert.equal(escapeCsvField("第一行\r\n第二行"), '"第一行\r\n第二行"');
});

test("null 与 undefined 输出空字符串", () => {
  assert.equal(escapeCsvField(null), "");
  assert.equal(escapeCsvField(undefined), "");
});

test("布尔值转成字符串", () => {
  assert.equal(escapeCsvField(true), "true");
  assert.equal(escapeCsvField(false), "false");
});

// ---- CSV 注入防护 ----

test("以等号开头的字段加前导单引号（防公式注入）", () => {
  // Excel 会把 =1+1 当成公式执行，加单引号可阻断
  assert.equal(escapeCsvField("=1+1"), "'=1+1");
  // 不含逗号/引号时不需要额外包裹，只在前面加单引号
  assert.equal(escapeCsvField("=cmd|'/c calc'!A0"), "'=cmd|'/c calc'!A0");
  // 同时含逗号时，先加单引号再按 RFC 4180 包裹
  assert.equal(escapeCsvField("=SUM(A1,B1)"), `"'=SUM(A1,B1)"`);
});

test("以加号、减号、@ 开头的字段也被防护", () => {
  assert.equal(escapeCsvField("+86"), "'+86");
  assert.equal(escapeCsvField("-5"), "'-5");
  assert.equal(escapeCsvField("@user"), "'@user");
});

test("正常中文与字母不会被误加单引号", () => {
  assert.equal(escapeCsvField("高血压"), "高血压");
  assert.equal(escapeCsvField("Aspirin"), "Aspirin");
});

// ---- 整体结构 ----

test("CSV 以 BOM 开头", () => {
  const csv = buildCsv(["A"], [["1"]]);
  assert.ok(csv.startsWith(UTF8_BOM), "应带 UTF-8 BOM，否则 Excel 中文乱码");
});

test("CSV 使用 CRLF 换行", () => {
  const csv = buildCsv(["A", "B"], [["1", "2"]]);
  const withoutBom = csv.slice(UTF8_BOM.length);
  assert.ok(withoutBom.includes("\r\n"), "应使用 CRLF");
  assert.ok(!/[^\r]\n/.test(withoutBom), "不应出现裸 LF");
});

test("表头与数据行数量正确", () => {
  const csv = buildCsv(["姓名", "年龄"], [
    ["张三", 30],
    ["李四", 25],
  ]);
  const lines = csv.slice(UTF8_BOM.length).trimEnd().split("\r\n");
  assert.equal(lines.length, 3, "1 行表头 + 2 行数据");
  assert.equal(lines[0], "姓名,年龄");
  assert.equal(lines[1], "张三,30");
});

test("行长度不足时按表头补齐", () => {
  const csv = buildCsv(["A", "B", "C"], [["1"]]);
  const lines = csv.slice(UTF8_BOM.length).trimEnd().split("\r\n");
  assert.equal(lines[1], "1,,", "缺的列应补空");
});

test("空数据只有表头", () => {
  const csv = buildCsv(["A", "B"], []);
  const lines = csv.slice(UTF8_BOM.length).trimEnd().split("\r\n");
  assert.equal(lines.length, 1);
});

test("含特殊字符的整行能正确生成", () => {
  const csv = buildCsv(["药名", "适应症"], [["阿司匹林", "解热,镇痛"]]);
  const lines = csv.slice(UTF8_BOM.length).trimEnd().split("\r\n");
  assert.equal(lines[1], '阿司匹林,"解热,镇痛"');
});

// ---- 文件名 ----

test("文件名含日期且为纯 ASCII", () => {
  const filename = buildExportFilename("reviews", new Date("2026-10-19T00:00:00+08:00"));
  assert.equal(filename, "pharmahub-reviews-20261019.csv");
  // 纯 ASCII：避免 Content-Disposition 里的编码问题
  assert.ok(/^[\x20-\x7e]+$/.test(filename), "文件名应只含 ASCII 字符");
});

test("月份日期补零", () => {
  const filename = buildExportFilename("quiz", new Date("2026-01-05T00:00:00+08:00"));
  assert.equal(filename, "pharmahub-quiz-20260105.csv");
});

test("不同类型文件名不同", () => {
  const date = new Date("2026-10-19T00:00:00+08:00");
  const a = buildExportFilename("reviews", date);
  const b = buildExportFilename("quiz", date);
  assert.notEqual(a, b);
});
