#!/usr/bin/env node
/**
 * 同步 main 仓库的共享药物内容与纯逻辑到 online checkout。
 *
 * 默认以 --dry-run 运行，仅输出差异清单；传入 --apply 才会实际写入目标目录。
 * 明确排除与运行环境强绑定的文件（lib/db/**、app/chatgpt-auth.ts、db/**、worker/**、.openai/**、data/** 等）。
 *
 * 用法：
 *   node scripts/sync-online-content.mjs --target ../pharmahub-online
 *   node scripts/sync-online-content.mjs --target ../pharmahub-online --apply
 */

import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_SOURCE = fileURLToPath(new URL("..", import.meta.url));

/** 明确纳入同步的共享目录 */
const SYNC_DIRS = [
  "lib/data/cards",
  "lib/quiz",
  "lib/diagram",
  "lib/search",
  "lib/export",
  "components",
];

/** 明确纳入同步的单个文件 */
const SYNC_FILES = [
  "lib/data/compares.ts",
  "lib/data/compare.ts",
  "lib/data/categories.ts",
  "lib/data/card-enrichment.ts",
  "lib/data/cases.ts",
  "lib/types.ts",
  "lib/utils.ts",
];

/** 匹配 lib/copy*.ts（lib/copy.ts 在下方显式排除） */
const COPY_FILE_PATTERN = /^lib\/copy[^/]*\.ts$/;

/** 明确排除的路径前缀，防止误覆盖 online 环境专属文件 */
const EXCLUDED_PREFIXES = [
  "lib/db/",
  "lib/review/",
  "lib/export/import.ts",
  "lib/copy.ts",
  "lib/data/study.ts",
  "lib/data/quiz.ts",
  "lib/data/export.ts",
  "lib/data/index.ts",
  "app/chatgpt-auth.ts",
  "db/",
  "worker/",
  ".openai/",
  "data/",
  "node_modules/",
  ".next/",
  ".git/",
];

function toPosix(relPath) {
  return relPath.replace(/\\/g, "/");
}

function isExcluded(relPosix) {
  return EXCLUDED_PREFIXES.some(
    (prefix) => relPosix === prefix.replace(/\/$/, "") || relPosix.startsWith(prefix),
  );
}

function walkDir(rootDir, currentDir, results) {
  if (!existsSync(currentDir)) return;
  const entries = readdirSync(currentDir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(currentDir, entry.name);
    const relPosix = toPosix(relative(rootDir, fullPath));
    if (isExcluded(relPosix)) continue;
    if (entry.isDirectory()) {
      walkDir(rootDir, fullPath, results);
    } else if (entry.isFile()) {
      results.push(relPosix);
    }
  }
}

function collectSharedFiles(rootDir) {
  const files = new Set();

  for (const rel of SYNC_FILES) {
    if (!isExcluded(rel) && existsSync(join(rootDir, rel))) {
      files.add(rel);
    }
  }

  const libDir = join(rootDir, "lib");
  if (existsSync(libDir)) {
    for (const entry of readdirSync(libDir, { withFileTypes: true })) {
      if (!entry.isFile()) continue;
      const relPosix = `lib/${entry.name}`;
      if (COPY_FILE_PATTERN.test(relPosix) && !isExcluded(relPosix)) {
        files.add(relPosix);
      }
    }
  }

  for (const dirRel of SYNC_DIRS) {
    const collected = [];
    walkDir(rootDir, join(rootDir, dirRel), collected);
    for (const rel of collected) {
      files.add(rel);
    }
  }

  return [...files].sort();
}

function printHelp() {
  console.log(`用法：
  node scripts/sync-online-content.mjs --target <online目录路径> [--apply] [--delete-extra] [--source <main目录>]

选项：
  --target <path>   目标 online 仓库根目录（必填）
  --source <path>   源 main 仓库根目录（默认当前仓库根目录）
  --dry-run         仅对比差异，不写入文件（默认行为）
  --apply           将新增与变更文件实际写入目标仓库
  --delete-extra    配合 --apply 使用，删除目标共享目录中多余的旧文件
  -h, --help        显示帮助
`);
}

function parseArgs(argv) {
  let target = null;
  let source = DEFAULT_SOURCE;
  let apply = false;
  let deleteExtra = false;
  let help = false;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      help = true;
    } else if (arg === "--apply") {
      apply = true;
    } else if (arg === "--dry-run") {
      apply = false;
    } else if (arg === "--delete-extra") {
      deleteExtra = true;
    } else if (arg === "--target") {
      target = argv[i + 1] ?? null;
      i += 1;
    } else if (arg.startsWith("--target=")) {
      target = arg.slice("--target=".length);
    } else if (arg === "--source") {
      source = argv[i + 1] ?? source;
      i += 1;
    } else if (arg.startsWith("--source=")) {
      source = arg.slice("--source=".length);
    } else {
      throw new Error(`未知参数: ${arg}`);
    }
  }

  return { target, source, apply, deleteExtra, help };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    process.exit(0);
  }

  if (!args.target) {
    console.error("错误：必须通过 --target <path> 指定 online 仓库路径。\n");
    printHelp();
    process.exit(1);
  }

  const sourceRoot = resolve(args.source);
  const targetRoot = resolve(args.target);

  if (!existsSync(sourceRoot) || !statSync(sourceRoot).isDirectory()) {
    console.error(`错误：源目录不存在：${sourceRoot}`);
    process.exit(1);
  }
  if (!existsSync(targetRoot) || !statSync(targetRoot).isDirectory()) {
    console.error(`错误：目标目录不存在：${targetRoot}`);
    process.exit(1);
  }
  if (sourceRoot === targetRoot) {
    console.error("错误：源目录与目标目录不能相同。");
    process.exit(1);
  }

  const sourceFiles = collectSharedFiles(sourceRoot);
  const sourceSet = new Set(sourceFiles);
  const targetFiles = collectSharedFiles(targetRoot);

  const toAdd = [];
  const toUpdate = [];
  const same = [];
  const extra = targetFiles.filter((rel) => !sourceSet.has(rel));

  for (const rel of sourceFiles) {
    const srcPath = join(sourceRoot, rel);
    const dstPath = join(targetRoot, rel);
    if (!existsSync(dstPath)) {
      toAdd.push(rel);
      continue;
    }
    const srcBuf = readFileSync(srcPath);
    const dstBuf = readFileSync(dstPath);
    if (Buffer.compare(srcBuf, dstBuf) === 0) {
      same.push(rel);
    } else {
      toUpdate.push(rel);
    }
  }

  console.log(`同步模式：${args.apply ? "APPLY（实际写入）" : "DRY-RUN（仅预演）"}`);
  console.log(`源仓库：${sourceRoot}`);
  console.log(`目标仓库：${targetRoot}\n`);

  for (const rel of toAdd) console.log(`[ADD]    ${rel}`);
  for (const rel of toUpdate) console.log(`[UPDATE] ${rel}`);
  for (const rel of extra) console.log(`[EXTRA]  ${rel}`);

  console.log(
    `\n汇总：新增 ${toAdd.length}，更新 ${toUpdate.length}，一致 ${same.length}，目标多余 ${extra.length}。`,
  );

  if (!args.apply) {
    if (toAdd.length > 0 || toUpdate.length > 0) {
      console.log("当前为预演模式，未修改任何文件。确认无误后请追加 --apply 执行同步。");
    }
    return;
  }

  for (const rel of [...toAdd, ...toUpdate]) {
    const srcPath = join(sourceRoot, rel);
    const dstPath = join(targetRoot, rel);
    mkdirSync(dirname(dstPath), { recursive: true });
    copyFileSync(srcPath, dstPath);
  }

  if (args.deleteExtra && extra.length > 0) {
    for (const rel of extra) {
      rmSync(join(targetRoot, rel), { force: true });
    }
    console.log(`已清理目标多余文件 ${extra.length} 个。`);
  }

  console.log(`已完成同步：写入 ${toAdd.length + toUpdate.length} 个文件。`);
}

main();
