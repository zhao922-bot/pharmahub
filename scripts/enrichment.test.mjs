import { test } from "node:test";
import assert from "node:assert/strict";

import { clinicalTagLabels, enrichmentCopy } from "../lib/copy-enrichment.ts";
import { CARD_ENRICHMENTS } from "../lib/data/card-enrichment.ts";
import { cardRepository } from "../lib/data/cards/index.ts";
import { CLINICAL_TAG_IDS } from "../lib/types.ts";

const cards = await cardRepository.getAll();
const cardIds = new Set(cards.map((card) => card.id));
const validTags = new Set(CLINICAL_TAG_IDS);
const enrichmentEntries = Object.entries(CARD_ENRICHMENTS);

test("药代特征标签文案覆盖全部 8 类标签且非空", () => {
  for (const tagId of CLINICAL_TAG_IDS) {
    assert.equal(typeof clinicalTagLabels[tagId], "string", `缺少标签文案：${tagId}`);
    assert.ok(clinicalTagLabels[tagId].trim().length > 0, `标签文案为空：${tagId}`);
  }
  assert.ok(enrichmentCopy.interactionsTitle.trim().length > 0);
  assert.ok(enrichmentCopy.interactionsHint.trim().length > 0);
  assert.ok(enrichmentCopy.jumpCardCta.trim().length > 0);
});

test("CARD_ENRICHMENTS 覆盖不少于 25 张卡片且全部对应真实卡片 id", () => {
  assert.ok(
    enrichmentEntries.length >= 25,
    `当前仅覆盖 ${enrichmentEntries.length} 张卡片，应不少于 25 张`,
  );

  for (const [cardId, enrichment] of enrichmentEntries) {
    assert.ok(cardIds.has(cardId), `未知卡片 id：${cardId}`);
    assert.ok(enrichment, `条目内容为空：${cardId}`);
    const hasTags = (enrichment.clinicalTags?.length ?? 0) > 0;
    const hasInteractions = (enrichment.interactions?.length ?? 0) > 0;
    assert.ok(hasTags || hasInteractions, `${cardId} 既无标签也无相互作用`);
  }
});

test("所有 clinicalTags 均属于 CLINICAL_TAG_IDS 且无重复", () => {
  for (const [cardId, enrichment] of enrichmentEntries) {
    if (!enrichment?.clinicalTags) continue;
    const seen = new Set();
    for (const tag of enrichment.clinicalTags) {
      assert.ok(validTags.has(tag), `${cardId} 存在非法标签：${tag}`);
      assert.ok(!seen.has(tag), `${cardId} 存在重复标签：${tag}`);
      seen.add(tag);
    }
  }
});

test("所有 DDI 相互作用字段完整且 targetCardId 合法、不自引用", () => {
  for (const [cardId, enrichment] of enrichmentEntries) {
    if (!enrichment?.interactions) continue;
    assert.ok(
      enrichment.interactions.length >= 1,
      `${cardId} 的 interactions 不应为空数组`,
    );

    const seenPartners = new Set();
    for (const item of enrichment.interactions) {
      assert.equal(typeof item.partner, "string", `${cardId} 缺少 partner`);
      assert.ok(item.partner.trim().length > 0, `${cardId} partner 为空`);
      assert.ok(!seenPartners.has(item.partner), `${cardId} 重复的 partner：${item.partner}`);
      seenPartners.add(item.partner);

      assert.equal(typeof item.mechanism, "string", `${cardId} 缺少 mechanism`);
      assert.ok(item.mechanism.trim().length > 0, `${cardId} mechanism 为空`);

      assert.equal(typeof item.consequence, "string", `${cardId} 缺少 consequence`);
      assert.ok(item.consequence.trim().length > 0, `${cardId} consequence 为空`);

      if (item.targetCardId !== undefined) {
        assert.notEqual(
          item.targetCardId,
          cardId,
          `${cardId} 的 targetCardId 不能指向自身`,
        );
        assert.ok(
          cardIds.has(item.targetCardId),
          `${cardId} 的 targetCardId 不存在：${item.targetCardId}`,
        );
      }
    }
  }
});
