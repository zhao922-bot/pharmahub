#!/usr/bin/env node
/**
 * 繁体字自查脚本。
 *
 * 项目硬性要求：界面文案与卡片内容必须全部使用简体中文，禁止出现繁体字。
 * 本脚本扫描 app/ components/ lib/ data/ 下的源码与数据文件，逐字比对
 * 「繁体专用字 → 简体字」对照表，命中即报错并指出文件与行号。
 *
 * 对照表来自 `lib/search/traditional.ts`——搜索归一化也用同一张表，
 * 两处共用一份数据，避免「自查用的表」和「搜索用的表」各写一遍后逐渐漂移。
 *
 * 用法：pnpm check:zh
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, extname } from "node:path";
import { fileURLToPath } from "node:url";

import { TRADITIONAL_TO_SIMPLIFIED_PAIRS } from "../lib/search/traditional.ts";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SCAN_DIRS = ["app", "components", "lib", "data"];
const SCAN_EXTS = new Set([".ts", ".tsx", ".json", ".mdx", ".css"]);
const SKIP_DIRS = new Set(["node_modules", ".next", ".git", "dist", "out"]);

/**
 * 跳过列表：这些文件里「本来就该有繁体字」。
 * - lib/search/traditional.ts 是繁简对照表本身，全是繁体字，扫描它必然全红。
 */
const SKIP_FILES = new Set([join("lib", "search", "traditional.ts")]);

/** 建索引：繁 → 简 */
const DICT = new Map();
for (const pair of TRADITIONAL_TO_SIMPLIFIED_PAIRS) {
  // 每项必须是两个字符且繁简不同，否则跳过（防止把简繁同形字配错）
  if (pair.length !== 2) continue;
  const [trad, simp] = pair;
  if (!trad || !simp || trad === simp) continue;
  DICT.set(trad, simp);
}

function* walk(dir) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      yield* walk(full);
    } else if (SCAN_EXTS.has(extname(entry))) {
      yield full;
    }
  }
}

const problems = [];
let scannedFiles = 0;

for (const dir of SCAN_DIRS) {
  for (const file of walk(join(ROOT, dir))) {
    if (SKIP_FILES.has(relative(ROOT, file))) continue;
    scannedFiles += 1;
    const lines = readFileSync(file, "utf8").split(/\r?\n/);
    lines.forEach((line, lineIndex) => {
      for (const char of line) {
        const suggestion = DICT.get(char);
        if (suggestion) {
          problems.push({
            file: relative(ROOT, file),
            line: lineIndex + 1,
            char,
            suggestion,
            context: line.trim().slice(0, 80),
          });
        }
      }
    });
  }
}

if (problems.length === 0) {
  console.log(
    `简体中文自查通过：扫描 ${scannedFiles} 个文件，未发现繁体字（对照表 ${DICT.size} 个繁体专用字）。`,
  );
  process.exit(0);
}

console.error(`发现 ${problems.length} 处疑似繁体字：`);
for (const p of problems) {
  console.error(`  ${p.file}:${p.line}  「${p.char}」应为「${p.suggestion}」`);
  console.error(`    ${p.context}`);
}
process.exit(1);
