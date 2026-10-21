import { TRADITIONAL_TO_SIMPLIFIED_PAIRS } from "@/lib/search/traditional";

/**
 * 卡片全文搜索。
 *
 * 设计要点：
 *
 * 1. **纯函数、零依赖**：不引入服务端 API，也不依赖 React。
 *    客户端组件与服务端 `cardRepository.query()` 共用同一套逻辑，
 *    保证「本地过滤」与「服务端查询」结果完全一致——否则两处行为漂移是迟早的事。
 *
 * 2. **归一化而非直接 includes**：真实使用中用户会输入繁体、全角字母、
 *    希腊字母的英文写法（β / beta）、带空格的短语。先把两边都归一化再比，
 *    才能让「β1 受体」「beta1受体」以及繁体写法的「受体」搜到同一张卡。 *
 * 3. **字段加权 + 命中定位**：不只是「命中/未命中」，而是告诉用户
 *    **在哪一段命中的**（靶点？机制第 3 步？不良反应？）。
 *    这是本次搜索增强的核心——搜索结果要能解释自己为什么被搜出来。
 */

/** 可检索的字段种类 */
export type SearchFieldKind =
  | "genericName"
  | "englishName"
  | "brandName"
  | "categoryName"
  | "target"
  | "indication"
  | "mechanismStep"
  | "adverseReaction"
  | "memoryTip";

/**
 * 字段权重。
 *
 * 数值来自「用户输入这个词时最可能想找什么」：
 * 输药名显然是要找那张卡；输「β1」多半是想找靶点；输「便秘」更可能是想找
 * 哪张卡的不良反应里有它。药名远高于其他字段，避免靶点里提到别的药名时排序混乱。
 */
const FIELD_WEIGHTS: Record<SearchFieldKind, number> = {
  genericName: 100,
  englishName: 90,
  brandName: 85,
  target: 60,
  indication: 50,
  mechanismStep: 40,
  categoryName: 30,
  adverseReaction: 25,
  memoryTip: 20,
};

/** 命中强度加成：完全相等 > 前缀命中 > 中间命中 */
const MATCH_EXACT_BONUS = 0.8;
const MATCH_PREFIX_BONUS = 0.4;
const MATCH_PARTIAL_BONUS = 0.2;

/** 一个可被搜索的字段（已归一化） */
interface IndexedField {
  kind: SearchFieldKind;
  /** 原始文本，用于生成摘要片段 */
  raw: string;
  /** 归一化文本（已去空白、转小写、繁转简、希腊字母转写） */
  normalized: string;
  /** 机制步骤序号（1-based），仅 mechanismStep 有效 */
  stepIndex?: number;
  /** 同类型字段内的序号（1-based），用于「适应症 2」这类展示 */
  itemIndex?: number;
}

/** 单张卡片的搜索索引 */
export interface CardSearchIndex {
  id: string;
  fields: IndexedField[];
  /** 所有字段归一化后拼接，用于快速判断「有没有命中」 */
  haystack: string;
}

/** 供搜索使用的最小卡片形状。DrugCardSummary 结构上满足它。 */
export interface SearchableCard {
  id: string;
  genericName: string;
  englishName: string;
  brandNames: readonly string[];
  categoryName: string;
  target: string;
  indications: readonly string[];
  mechanismSteps: readonly { title: string; detail: string }[];
  adverseReactions: readonly string[];
  memoryTip: string;
}

/** 命中片段里需要高亮的区间（相对 snippet.text） */
export interface HighlightRange {
  start: number;
  end: number;
}

/** 命中位置信息 */
export interface SearchMatch {
  /** 命中最强的字段 */
  field: {
    kind: SearchFieldKind;
    stepIndex?: number;
    itemIndex?: number;
  };
  /** 带上下文的原文片段 */
  snippet: string;
  /** 片段内需要高亮的区间 */
  ranges: HighlightRange[];
  /** 除展示片段外，还有多少处其他命中 */
  otherMatchCount: number;
}

export interface SearchHit {
  id: string;
  score: number;
  /** 空查询时为 null（表示「没有关键词，不做匹配展示」） */
  match: SearchMatch | null;
}

/**
 * 希腊字母 → 英文拼写。
 *
 * 药理内容里 β、α、μ 出现频率极高，而用户键盘上打这些字符很麻烦，
 * 通常会写成 beta、alpha、mu。两边都转成英文拼写才能互相匹配。
 */
const GREEK_ALIASES: Record<string, string> = {
  α: "alpha",
  β: "beta",
  γ: "gamma",
  δ: "delta",
  ε: "epsilon",
  ζ: "zeta",
  η: "eta",
  θ: "theta",
  ι: "iota",
  κ: "kappa",
  λ: "lambda",
  μ: "mu",
  ν: "nu",
  ξ: "xi",
  π: "pi",
  ρ: "rho",
  σ: "sigma",
  τ: "tau",
  υ: "upsilon",
  φ: "phi",
  χ: "chi",
  ψ: "psi",
  ω: "omega",
  Α: "alpha",
  Β: "beta",
  Γ: "gamma",
  Δ: "delta",
  Θ: "theta",
  Κ: "kappa",
  Λ: "lambda",
  Μ: "mu",
  Ν: "nu",
  Ξ: "xi",
  Π: "pi",
  Ρ: "rho",
  Σ: "sigma",
  Τ: "tau",
  Φ: "phi",
  Χ: "chi",
  Ψ: "psi",
  Ω: "omega",
};

/** 繁 → 简 查表 */
const TRAD_TO_SIMP: ReadonlyMap<string, string> = (() => {
  const map = new Map<string, string>();
  for (const pair of TRADITIONAL_TO_SIMPLIFIED_PAIRS) {
    // 每项必须是两个字符，且繁简不同，否则跳过（防止把简繁同形字配错）
    if (pair.length !== 2) continue;
    const traditional = pair[0];
    const simplified = pair[1];
    if (!traditional || !simplified || traditional === simplified) continue;
    map.set(traditional, simplified);
  }
  return map;
})();

/** 归一化结果：归一化文本 + 每个字符对应的原文下标 */
interface NormalizedText {
  text: string;
  /** map[i] = 归一化文本第 i 个字符在原文中的起始下标 */
  map: number[];
}

/**
 * 归一化文本，并保留「归一化字符 → 原文下标」的映射。
 *
 * 为什么要映射：搜索要在原文里截取片段做展示，如果归一化改变了长度
 * （希腊字母 β → beta 是 1 变 4），直接用归一化后的下标去切原文就会错位。
 *
 * 处理顺序：逐字符 → 希腊字母转写 / NFKC（全角转半角）→ 繁转简 → 小写，
 * 并**丢弃所有空白**。丢空白是为了让「β1 受体」与「β1受体」等价。
 */
export function normalizeWithMap(input: string): NormalizedText {
  let text = "";
  const map: number[] = [];

  for (let rawIndex = 0; rawIndex < input.length; rawIndex += 1) {
    const char = input[rawIndex];
    if (char === undefined) continue;

    // 空白不进入归一化文本
    if (/\s/.test(char)) continue;

    const greek = GREEK_ALIASES[char];
    // NFKC 负责全角字母数字、① 等兼容字符；希腊字母先转写再走 NFKC
    const chunk = (greek ?? char).normalize("NFKC").toLowerCase();

    for (const piece of chunk) {
      if (/\s/.test(piece)) continue;
      const simplified = TRAD_TO_SIMP.get(piece) ?? piece;
      text += simplified;
      // 一个原文下标可能对应多个归一化字符（β → b,e,t,a）
      map.push(rawIndex);
    }
  }

  return { text, map };
}

/** 只取归一化文本，不关心映射时用这个 */
export function normalizeSearchText(input: string): string {
  return normalizeWithMap(input).text;
}

/**
 * 把查询串切成词元。
 *
 * 先按空白切分**原文**，再逐个归一化——不能先归一化再切，
 * 因为归一化会丢掉空白，词边界就没了。
 */
export function tokenizeQuery(query: string): string[] {
  return query
    .split(/\s+/)
    .map((part) => normalizeSearchText(part))
    .filter((token) => token.length > 0);
}

/** 从一张卡片构建搜索索引 */
export function buildCardIndex(card: SearchableCard): CardSearchIndex {
  const fields: IndexedField[] = [];

  const push = (
    kind: SearchFieldKind,
    raw: string,
    extra?: { stepIndex?: number; itemIndex?: number },
  ) => {
    if (!raw) return;
    const normalized = normalizeSearchText(raw);
    if (normalized.length === 0) return;
    fields.push({ kind, raw, normalized, ...extra });
  };

  push("genericName", card.genericName);
  push("englishName", card.englishName);
  card.brandNames.forEach((name, index) => {
    push("brandName", name, { itemIndex: index + 1 });
  });
  push("categoryName", card.categoryName);
  push("target", card.target);
  card.indications.forEach((item, index) => {
    push("indication", item, { itemIndex: index + 1 });
  });
  card.mechanismSteps.forEach((step, index) => {
    // 标题与说明拼在一起检索，但摘要展示时保留完整文本
    push("mechanismStep", `${step.title}：${step.detail}`, { stepIndex: index + 1 });
  });
  card.adverseReactions.forEach((item, index) => {
    push("adverseReaction", item, { itemIndex: index + 1 });
  });
  push("memoryTip", card.memoryTip);

  return {
    id: card.id,
    fields,
    haystack: fields.map((field) => field.normalized).join("\n"),
  };
}

/** 批量构建索引 */
export function buildSearchIndex(cards: readonly SearchableCard[]): CardSearchIndex[] {
  return cards.map(buildCardIndex);
}

/** 单个字段对单个词元的得分；不命中返回 0 */
function scoreField(field: IndexedField, token: string): number {
  const position = field.normalized.indexOf(token);
  if (position === -1) return 0;

  const base = FIELD_WEIGHTS[field.kind];
  if (field.normalized === token) {
    return base * (1 + MATCH_EXACT_BONUS);
  }
  if (position === 0) {
    return base * (1 + MATCH_PREFIX_BONUS);
  }
  return base * (1 + MATCH_PARTIAL_BONUS);
}

/** 截取命中片段并给出高亮区间 */
export function buildSnippet(
  rawText: string,
  tokens: readonly string[],
  context = 14,
): { text: string; ranges: HighlightRange[] } {
  const { text: normalized, map } = normalizeWithMap(rawText);

  // 找出所有词元的所有出现位置（归一化坐标）
  const occurrences: Array<{ start: number; end: number }> = [];
  for (const token of tokens) {
    if (token.length === 0) continue;
    let from = 0;
    while (from <= normalized.length) {
      const index = normalized.indexOf(token, from);
      if (index === -1) break;
      occurrences.push({ start: index, end: index + token.length });
      from = index + token.length;
      // 防御性上限：极端长文本不会无限累积
      if (occurrences.length > 100) break;
    }
  }

  if (occurrences.length === 0) {
    return { text: rawText.slice(0, context * 3), ranges: [] };
  }

  occurrences.sort((a, b) => a.start - b.start);
  const first = occurrences[0];
  if (!first) {
    return { text: rawText.slice(0, context * 3), ranges: [] };
  }

  const rawStart = map[first.start] ?? 0;
  // map[first.end] 是命中之后第一个字符的原文下标，正好是命中区的右边界
  const rawEnd = map[first.end] ?? rawText.length;

  const sliceStart = Math.max(0, rawStart - context);
  const sliceEnd = Math.min(rawText.length, rawEnd + context);

  const hasPrefix = sliceStart > 0;
  const hasSuffix = sliceEnd < rawText.length;
  const text =
    (hasPrefix ? "…" : "") +
    rawText.slice(sliceStart, sliceEnd) +
    (hasSuffix ? "…" : "");

  // 原文下标 → 片段下标
  const offset = (hasPrefix ? 1 : 0) - sliceStart;

  const ranges: HighlightRange[] = [];
  for (const occurrence of occurrences) {
    const start = (map[occurrence.start] ?? 0) + offset;
    const end = (map[occurrence.end] ?? rawText.length) + offset;
    // 只保留落在片段内的部分
    const clippedStart = Math.max(0, start);
    const clippedEnd = Math.min(text.length, end);
    if (clippedEnd > clippedStart) {
      ranges.push({ start: clippedStart, end: clippedEnd });
    }
  }

  return { text, ranges };
}

/**
 * 执行搜索。
 *
 * 语义：查询按空白切成多个词元时，**每个词元都必须命中**（AND），
 * 与常见搜索框的行为一致——「β1 阻断」应当同时包含这两个词。
 *
 * 排序：总分降序；同分时按药名排序，保证结果稳定可预期。
 */
export function searchCardIndex(
  index: readonly CardSearchIndex[],
  query: string,
): SearchHit[] {
  const tokens = tokenizeQuery(query);
  if (tokens.length === 0) {
    return index.map((entry) => ({ id: entry.id, score: 0, match: null }));
  }

  const hits: SearchHit[] = [];

  for (const entry of index) {
    // 快速排除：任一词元不在整体文本里就不必细算
    if (!tokens.every((token) => entry.haystack.includes(token))) continue;

    let score = 0;
    let bestField: IndexedField | null = null;
    let bestFieldScore = 0;
    const matchedKinds = new Set<SearchFieldKind>();

    for (const token of tokens) {
      let tokenBest = 0;
      let tokenBestField: IndexedField | null = null;

      for (const field of entry.fields) {
        const fieldScore = scoreField(field, token);
        if (fieldScore === 0) continue;
        matchedKinds.add(field.kind);
        if (fieldScore > tokenBest) {
          tokenBest = fieldScore;
          tokenBestField = field;
        }
      }

      score += tokenBest;
      if (tokenBest > bestFieldScore && tokenBestField) {
        bestFieldScore = tokenBest;
        bestField = tokenBestField;
      }
    }

    // 命中字段越分散，说明这次搜索越"全面"，给一点加成
    score += matchedKinds.size * 2;

    if (!bestField) continue;

    const snippet = buildSnippet(bestField.raw, tokens);
    const otherMatchCount = Math.max(0, entry.fields.filter((field) =>
      tokens.some((token) => field.normalized.includes(token)),
    ).length - 1);

    hits.push({
      id: entry.id,
      score,
      match: {
        field: {
          kind: bestField.kind,
          stepIndex: bestField.stepIndex,
          itemIndex: bestField.itemIndex,
        },
        snippet: snippet.text,
        ranges: snippet.ranges,
        otherMatchCount,
      },
    });
  }

  return hits.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.id.localeCompare(b.id);
  });
}

/** 把片段按高亮区间切成若干段，供 UI 渲染（纯函数，便于测试） */
export function splitHighlighted(
  text: string,
  ranges: readonly HighlightRange[],
): Array<{ text: string; highlighted: boolean }> {
  if (ranges.length === 0) return [{ text, highlighted: false }];

  // 合并重叠区间，避免嵌套导致渲染错乱
  const sorted = [...ranges].sort((a, b) => a.start - b.start);
  const merged: HighlightRange[] = [];
  for (const range of sorted) {
    const last = merged[merged.length - 1];
    if (last && range.start <= last.end) {
      last.end = Math.max(last.end, range.end);
    } else {
      merged.push({ ...range });
    }
  }

  const parts: Array<{ text: string; highlighted: boolean }> = [];
  let cursor = 0;
  for (const range of merged) {
    if (range.start > cursor) {
      parts.push({ text: text.slice(cursor, range.start), highlighted: false });
    }
    parts.push({ text: text.slice(range.start, range.end), highlighted: true });
    cursor = range.end;
  }
  if (cursor < text.length) {
    parts.push({ text: text.slice(cursor), highlighted: false });
  }
  return parts;
}
