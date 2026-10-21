import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
const dir = join(process.cwd(), "lib", "data", "cards");
const ids = [];
for (const file of readdirSync(dir)) {
  if (!file.endsWith(".ts") || file === "index.ts") continue;
  const src = readFileSync(join(dir, file), "utf8");
  for (const m of src.matchAll(/^    id: "([^"]+)",$/gm)) ids.push({ id: m[1], file });
}
const seen = new Map();
const dupes = [];
for (const { id, file } of ids) {
  if (seen.has(id)) dupes.push(`${id} 在 ${seen.get(id)} 与 ${file} 重复`);
  else seen.set(id, file);
}
console.log("卡片总数:", ids.length, "| 唯一 id:", seen.size);
if (dupes.length) { console.log("重复:"); dupes.forEach(d => console.log("  " + d)); }
else console.log("id 全部唯一 ✓");

// 检查 index.ts 是否 import 了所有文件
const indexSrc = readFileSync(join(dir, "index.ts"), "utf8");
const files = readdirSync(dir).filter(f => f.endsWith(".ts") && f !== "index.ts");
const missing = files.filter(f => !indexSrc.includes(f.replace(".ts", "")));
console.log(missing.length ? "index.ts 未引入: " + missing.join(", ") : "index.ts 已引入全部文件 ✓");
