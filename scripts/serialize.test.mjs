/**
 * 导出序列化单元测试。
 *
 * 直接 import 真实源码（lib/export/serialize.ts 是纯函数，无 server-only 依赖）。
 * 重点验证：
 * 1. CSV 与 JSON 两种格式对同一份数据保持一致
 * 2. JSON 结构（含 columns 对照表）
 * 3. 布尔值在 CSV 里转中文、在 JSON 里保持布尔
 * 4. null 的处理
 *
 * 运行：pnpm test
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import { datasetToCsv, datasetToJson } from "../lib/export/serialize.ts";
import { UTF8_BOM } from "../lib/export/csv.ts";

/** 测试用数据集 */
const DATASET = {
  kind: "reviews",
  columns: [
    { key: "date", header: "日期" },
    { key: "name", header: "药名" },
    { key: "count", header: "次数" },
    { key: "ok", header: "是否" },
  ],
  records: [
    { date: "2026-10-19", name: "美托洛尔", count: 3, ok: true },
    { date: "2026-10-18", name: "阿司匹林", count: 1, ok: false },
  ],
};

// ---- CSV ----

test("CSV 含 BOM", () => {
  const csv = datasetToCsv(DATASET);
  assert.ok(csv.startsWith(UTF8_BOM));
});

test("CSV 表头取自 columns.header", () => {
  const csv = datasetToCsv(DATASET);
  const header = csv.slice(UTF8_BOM.length).split("\r\n")[0];
  assert.equal(header, "日期,药名,次数,是否");
});

test("CSV 数据行按 columns 顺序取值", () => {
  const csv = datasetToCsv(DATASET);
  const lines = csv.slice(UTF8_BOM.length).trimEnd().split("\r\n");
  assert.equal(lines[1], "2026-10-19,美托洛尔,3,是");
});

test("CSV 里布尔值转成中文", () => {
  const csv = datasetToCsv(DATASET);
  const lines = csv.slice(UTF8_BOM.length).trimEnd().split("\r\n");
  assert.ok(lines[1].endsWith("是"));
  assert.ok(lines[2].endsWith("否"));
});

test("CSV 里 null 输出为空", () => {
  const dataset = {
    kind: "t",
    columns: [
      { key: "a", header: "A" },
      { key: "b", header: "B" },
    ],
    records: [{ a: null, b: "x" }],
  };
  const csv = datasetToCsv(dataset);
  const lines = csv.slice(UTF8_BOM.length).trimEnd().split("\r\n");
  assert.equal(lines[1], ",x");
});

test("CSV 里缺失的 key 输出为空", () => {
  const dataset = {
    kind: "t",
    columns: [
      { key: "a", header: "A" },
      { key: "missing", header: "B" },
    ],
    records: [{ a: "1" }],
  };
  const csv = datasetToCsv(dataset);
  const lines = csv.slice(UTF8_BOM.length).trimEnd().split("\r\n");
  assert.equal(lines[1], "1,");
});

test("CSV 只输出 columns 里定义的字段", () => {
  const dataset = {
    kind: "t",
    columns: [{ key: "a", header: "A" }],
    records: [{ a: "1", extra: "不该出现" }],
  };
  const csv = datasetToCsv(dataset);
  assert.ok(!csv.includes("不该出现"));
});

// ---- JSON ----

test("JSON 可被解析", () => {
  const json = datasetToJson(DATASET, new Date("2026-10-19T02:30:00Z"));
  assert.doesNotThrow(() => JSON.parse(json));
});

test("JSON 含 exportedAt 与 kind", () => {
  const json = JSON.parse(datasetToJson(DATASET, new Date("2026-10-19T02:30:00Z")));
  assert.equal(json.exportedAt, "2026-10-19T02:30:00.000Z");
  assert.equal(json.kind, "reviews");
});

test("JSON 含 count 等于记录数", () => {
  const json = JSON.parse(datasetToJson(DATASET, new Date()));
  assert.equal(json.count, 2);
  assert.equal(json.records.length, 2);
});

test("JSON 含 columns 对照表", () => {
  const json = JSON.parse(datasetToJson(DATASET, new Date()));
  assert.equal(json.columns.length, 4);
  assert.deepEqual(json.columns[0], { key: "date", header: "日期" });
});

test("JSON 记录保留英文 key", () => {
  const json = JSON.parse(datasetToJson(DATASET, new Date()));
  assert.equal(json.records[0].date, "2026-10-19");
  assert.equal(json.records[0].name, "美托洛尔");
});

test("JSON 里布尔值保持布尔类型", () => {
  const json = JSON.parse(datasetToJson(DATASET, new Date()));
  assert.equal(typeof json.records[0].ok, "boolean");
  assert.equal(json.records[0].ok, true);
  assert.equal(json.records[1].ok, false);
});

test("JSON 里数字保持数字类型", () => {
  const json = JSON.parse(datasetToJson(DATASET, new Date()));
  assert.equal(typeof json.records[0].count, "number");
});

test("JSON 里 null 保持 null", () => {
  const dataset = {
    kind: "t",
    columns: [{ key: "a", header: "A" }],
    records: [{ a: null }],
  };
  const json = JSON.parse(datasetToJson(dataset, new Date()));
  assert.equal(json.records[0].a, null);
});

test("JSON 使用 2 空格缩进", () => {
  const json = datasetToJson(DATASET, new Date());
  assert.ok(json.includes('\n  "kind"'), "应缩进 2 空格");
});

test("JSON 以换行结尾", () => {
  const json = datasetToJson(DATASET, new Date());
  assert.ok(json.endsWith("\n"));
});

test("空记录集也能生成合法 JSON", () => {
  const dataset = { kind: "t", columns: [{ key: "a", header: "A" }], records: [] };
  const json = JSON.parse(datasetToJson(dataset, new Date()));
  assert.equal(json.count, 0);
  assert.deepEqual(json.records, []);
});

// ---- 一致性 ----

test("CSV 与 JSON 的记录数一致", () => {
  const csv = datasetToCsv(DATASET);
  const json = JSON.parse(datasetToJson(DATASET, new Date()));
  const csvLines = csv.slice(UTF8_BOM.length).trimEnd().split("\r\n");
  // CSV：1 行表头 + N 行数据
  assert.equal(csvLines.length - 1, json.records.length);
});

test("CSV 与 JSON 的字段数一致", () => {
  const csv = datasetToCsv(DATASET);
  const json = JSON.parse(datasetToJson(DATASET, new Date()));
  const headerCount = csv.slice(UTF8_BOM.length).split("\r\n")[0].split(",").length;
  assert.equal(headerCount, json.columns.length);
  assert.equal(headerCount, Object.keys(json.records[0]).length);
});
