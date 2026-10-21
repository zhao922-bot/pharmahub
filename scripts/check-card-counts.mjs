/**
 * 卡片数量一致性检查。
 *
 * 背景：每个分类文件的文件头注释里写了「N 张卡片」，但注释不会被编译期
 * 或运行期校验。卡片从 20 张扩到 42 张、再到 49 张的过程中，这些注释
 * 全部变成了假话（心血管写 5 实际 8、消化写 1 实际 6）。
 *
 * 假注释的危害不只是「不好看」：维护者会按注释判断现状，
 * 比如以为消化系统只有 1 张卡片，从而做出错误的决策。
 * 所以这里用脚本把注释和实际数量对齐校验。
 *
 * 运行：node scripts/check-card-counts.mjs
 */

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const dir = join(process.cwd(), "lib", "data", "cards");
const issues = [];
let checked = 0;

for (const file of readdirSync(dir)) {
  if (!file.endsWith(".ts") || file === "index.ts") continue;

  const src = readFileSync(join(dir, file), "utf8");

  // 实际卡片数：按顶层卡片对象的 id 字段计数
  const actual = (src.match(/^    id: "[^"]+",$/gm) || []).length;

  // 注释里声明的数量：「· N 张卡片」
  const declared = src.match(/·\s*(\d+)\s*张卡片/)?.[1];

  checked += 1;

  if (declared === undefined) {
    issues.push(`${file}: 文件头缺少「N 张卡片」说明`);
    continue;
  }

  if (Number(declared) !== actual) {
    issues.push(`${file}: 注释写 ${declared} 张，实际 ${actual} 张`);
  }
}

// index.ts 里的总体积估算也带数字，单独校验
const indexSrc = readFileSync(join(dir, "index.ts"), "utf8");
const totalDeclared = indexSrc.match(/(\d+)\s*张卡片全量摘要/)?.[1];
const totalActual = readdirSync(dir)
  .filter((f) => f.endsWith(".ts") && f !== "index.ts")
  .reduce((sum, f) => {
    const src = readFileSync(join(dir, f), "utf8");
    return sum + (src.match(/^    id: "[^"]+",$/gm) || []).length;
  }, 0);

if (totalDeclared !== undefined && Number(totalDeclared) !== totalActual) {
  issues.push(`index.ts: 注释写 ${totalDeclared} 张，实际 ${totalActual} 张`);
}

console.log(`已检查 ${checked} 个分类文件，共 ${totalActual} 张卡片`);

if (issues.length) {
  console.log(`\n发现 ${issues.length} 个问题：`);
  issues.forEach((issue) => console.log("  " + issue));
  process.exit(1);
} else {
  console.log("卡片数量与注释一致");
}
