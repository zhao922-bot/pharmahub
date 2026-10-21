/**
 * 对比分组数据校验。
 *
 * 对比视图的价值完全依赖数据的完整性——一行缺值就会让表格出现空洞，
 * 一张卡片 id 写错就会让整组渲染失败。这类错误在 TypeScript 里查不出来
 * （drugIds 只是 string[]），所以必须用脚本校验。
 *
 * 校验项：
 * 1. 分组 id 唯一
 * 2. 每个 drugId 都存在于卡片库
 * 3. 每个 drugId 在本组内不重复
 * 4. 每个维度的 values 长度等于 drugIds 长度（最容易出错的一项）
 * 5. 维度名在本组内不重复
 * 6. takeaways 非空
 * 7. 分组至少 2 个药物、至少 2 个维度
 * 8. 同一组对比的药不能重复出现在别的组里（同一对药只该比一次）
 *
 * 运行：node scripts/check-compares.mjs
 */

import { register } from "node:module";
import { pathToFileURL } from "node:url";

// 复用项目的 @/ 别名解析
register("./ts-alias-resolver.mjs", pathToFileURL("./scripts/"));

const { COMPARE_GROUPS } = await import("../lib/data/compares.ts");
const { cardRepository } = await import("../lib/data/cards/index.ts");

const cards = await cardRepository.getAll();
const cardIds = new Set(cards.map((card) => card.id));

const issues = [];
const seenIds = new Set();
const seenPairs = new Map();

for (const group of COMPARE_GROUPS) {
  const where = `[${group.id}]`;

  // 1. id 唯一
  if (seenIds.has(group.id)) issues.push(`${where} 分组 id 重复`);
  seenIds.add(group.id);

  // 2. drugId 存在
  for (const drugId of group.drugIds) {
    if (!cardIds.has(drugId)) {
      issues.push(`${where} 引用了不存在的卡片 id: ${drugId}`);
    }
  }

  // 3. 组内不重复
  if (new Set(group.drugIds).size !== group.drugIds.length) {
    issues.push(`${where} drugIds 内有重复项`);
  }

  // 7. 数量下限
  if (group.drugIds.length < 2) {
    issues.push(`${where} 至少需要 2 个药物，实际 ${group.drugIds.length}`);
  }
  if (group.rows.length < 2) {
    issues.push(`${where} 至少需要 2 个维度，实际 ${group.rows.length}`);
  }

  // 4. values 长度匹配（最关键的一项）
  const seenLabels = new Set();
  const seenQuizIds = new Set();
  for (const row of group.rows) {
    if (row.quizId !== undefined) {
      if (!/^[a-z][a-z0-9-]*$/.test(row.quizId) || seenQuizIds.has(row.quizId)) {
        issues.push(`${where} 出题维度 id 无效或重复: ${row.quizId}`);
      }
      seenQuizIds.add(row.quizId);
      if (new Set(row.values.map((value) => value.trim())).size !== row.values.length) {
        issues.push(`${where} 出题维度「${row.label}」含共同描述，不能出单选题`);
      }
      if (group.sources && !row.quizExplanation?.trim()) {
        issues.push(`${where} 已附来源的出题维度「${row.label}」缺少辨析理由`);
      }
    }
    if (row.quizExplanation !== undefined && (!row.quizId || !row.quizExplanation.trim())) {
      issues.push(`${where} 维度「${row.label}」的解析为空或没有对应出题 id`);
    }
    if (row.values.length !== group.drugIds.length) {
      issues.push(
        `${where} 维度「${row.label}」有 ${row.values.length} 个值，但药物有 ${group.drugIds.length} 个`,
      );
    }
    // 5. 维度名不重复
    if (seenLabels.has(row.label)) {
      issues.push(`${where} 维度名「${row.label}」重复`);
    }
    seenLabels.add(row.label);
    // 空值检查
    for (const [index, value] of row.values.entries()) {
      if (!value || !value.trim()) {
        issues.push(`${where} 维度「${row.label}」第 ${index + 1} 个值为空`);
      }
    }
  }

  // 6. takeaways 非空
  if (group.takeaways.length === 0) {
    issues.push(`${where} 缺少 takeaways（关键差异点）`);
  }

  // 8. 同一对药只该比一次
  const pairKey = [...group.drugIds].sort().join("+");
  if (seenPairs.has(pairKey)) {
    issues.push(
      `${where} 与 [${seenPairs.get(pairKey)}] 对比的是同一组药物`,
    );
  }
  seenPairs.set(pairKey, group.id);

  if (group.sources !== undefined || group.sourcesCheckedOn !== undefined) {
    if (!group.sources?.length || !/^\d{4}-\d{2}-\d{2}$/.test(group.sourcesCheckedOn ?? "") ||
        Number.isNaN(Date.parse(group.sourcesCheckedOn))) {
      issues.push(`${where} 参考资料或核对日期不完整`);
    }
    const seenSources = new Set();
    for (const source of group.sources ?? []) {
      let validURL = false;
      try { validURL = new URL(source.url).protocol === "https:"; } catch { /* 下方统一报告 */ }
      if (!source.title.trim() || !source.sections.trim() || !validURL || seenSources.has(source.url)) {
        issues.push(`${where} 参考资料为空、地址无效或重复: ${source.url}`);
      }
      seenSources.add(source.url);
    }
  }
}

// 反向检查：有多少卡片参与了对比
const coveredCards = new Set(COMPARE_GROUPS.flatMap((group) => group.drugIds));

console.log(`共 ${COMPARE_GROUPS.length} 组对比，覆盖 ${coveredCards.size} 张卡片`);

if (issues.length) {
  console.log(`\n发现 ${issues.length} 个问题：`);
  issues.forEach((issue) => console.log("  " + issue));
  process.exit(1);
} else {
  console.log("对比数据校验全部通过");
}
