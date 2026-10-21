// 内容质量校验：步骤数、因果链完整性、必填字段
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const dir = join(process.cwd(), "lib", "data", "cards");
const issues = [];
let total = 0;

for (const file of readdirSync(dir)) {
  if (!file.endsWith(".ts") || file === "index.ts") continue;
  const src = readFileSync(join(dir, file), "utf8");

  // 按卡片切块
  const blocks = src.split(/(?=^    id: ")/m).slice(1);
  for (const block of blocks) {
    total += 1;
    const id = block.match(/^    id: "([^"]+)"/)?.[1] ?? "?";

    // 机制步骤数
    const steps = (block.match(/\n      \{\n        title:/g) || []).length;
    if (steps < 3) issues.push(`${id}: 机制步骤只有 ${steps} 步（应 ≥3）`);

    // 适应症数
    const indSection = block.match(/indications: \[([\s\S]*?)\],/)?.[1] ?? "";
    const indCount = (indSection.match(/^\s+"[^"]+",?$/gm) || []).length;
    if (indCount === 0) issues.push(`${id}: 缺适应症`);

    // 不良反应数
    const advSection = block.match(/adverseReactions: \[([\s\S]*?)\],/)?.[1] ?? "";
    const advCount = (advSection.match(/^\s+"[^"]+",?$/gm) || []).length;
    if (advCount === 0) issues.push(`${id}: 缺不良反应`);

    // 记忆提示
    if (!/memoryTip: "[^"]+"/.test(block)) issues.push(`${id}: 缺记忆提示`);

    // 机制图节点与连线
    const nodes = (block.match(/\{ id: "[^"]+", label: "[^"]+", role:/g) || []).length;
    const edges = (block.match(/\{ from: "[^"]+", to: "[^"]+"/g) || []).length;
    if (nodes === 0) issues.push(`${id}: 机制图无节点`);
    if (edges === 0) issues.push(`${id}: 机制图无连线`);
    if (edges > 0 && nodes > 0 && edges < nodes - 1) {
      issues.push(`${id}: 连线 ${edges} 少于节点 ${nodes}-1，图可能不连通`);
    }

    // 空商品名用 [] 表示，检查是否误写成 [""]
    if (/brandNames: \[""\]/.test(block)) issues.push(`${id}: brandNames 有空字符串`);
  }
}

console.log(`共 ${total} 张卡片`);
if (issues.length) { console.log(`\n发现 ${issues.length} 个问题：`); issues.forEach(i => console.log("  " + i)); process.exitCode = 1; }
else console.log("内容结构检查全部通过");
