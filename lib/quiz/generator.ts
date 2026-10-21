import type { DrugCard, CategoryId, CompareGroup } from "@/lib/types";
import { buildCompareQuestion } from "@/lib/quiz/compare-generator";
import { createRandom, hashString, shuffle } from "@/lib/quiz/random";

/**
 * 测验题目自动生成引擎。
 *
 * 设计原则：
 * 1. **确定性**：同样的 (cardId, seed) 永远生成同样的题目。
 *    这样用户答错后重练、或刷新页面时，看到的是同一道题，不会因随机导致
 *    「刚做过的题变了」这种困惑。
 * 2. **干扰项来自真实卡片**：错误选项都是其他药物的真实靶点/适应症/分类，
 *    而不是编造的假选项。靶点和用途题仅从本卡已核对的候选集合中选择。
 * 3. **题型多样**：靶点识别、分类归属、适应症匹配、机制步骤排序，
 *    从不同角度考察对机制链的理解，而不只是记忆药名。
 */

export type QuestionKind = "target" | "category" | "indication" | "mechanism-order" | "compare";

export interface QuizOption {
  /** 选项 id，用于提交答案 */
  id: string;
  /** 选项文本 */
  text: string;
}

export interface QuizQuestion {
  /** 稳定题目 id；对比题包含组、维度和所考卡片，不包含本轮种子 */
  id: string;
  kind: QuestionKind;
  /** 题目所考的卡片 */
  cardId: string;
  /** 题干 */
  prompt: string;
  /** 选项 */
  options: QuizOption[];
  /** 正确答案的选项 id */
  correctOptionId: string;
  /** 答题后的解析，帮助理解而不只是记住答案 */
  explanation: string;
  comparison?: { id: string; title: string; dimension: string };
}

/** 题型对应的中文标签，供界面展示 */
export const QUESTION_KIND_LABELS: Record<QuestionKind, string> = {
  target: "作用靶点",
  category: "所属分类",
  indication: "适应症",
  "mechanism-order": "机制顺序",
  compare: "同类药对比",
};

/** 从候选池里挑 n 个不与正确答案重复的干扰项 */
function pickDistractors(
  candidates: readonly string[],
  correct: string,
  count: number,
  random: () => number,
): string[] {
  const pool = candidates.filter((item) => item !== correct);
  const unique = Array.from(new Set(pool));
  return shuffle(unique, random).slice(0, count);
}

/** 生成选项列表并打乱顺序，同时返回正确答案的 id */
function buildOptions(
  correctText: string,
  distractors: string[],
  random: () => number,
): { options: QuizOption[]; correctOptionId: string } {
  const all = [correctText, ...distractors];
  const shuffled = shuffle(all, random);
  const options = shuffled.map((text, index) => ({
    id: `opt-${index}`,
    text,
  }));
  const correct = options.find((option) => option.text === correctText);
  return {
    options,
    // 理论上一定能找到；找不到说明数据异常，退回第一个选项而不是抛错
    correctOptionId: correct?.id ?? options[0]?.id ?? "opt-0",
  };
}

/** 生成「作用靶点」题：给出药名，选出正确的靶点 */
function buildTargetQuestion(
  card: DrugCard,
  allCards: readonly DrugCard[],
  random: () => number,
): QuizQuestion | null {
  // 字符串不同不等于医学上互斥。没有本卡已核对的集合时不出题。
  if (!card.targetQuizDistractorIds) return null;
  const distractorPool = allCards
    .filter((other) =>
      other.id !== card.id &&
      card.targetQuizDistractorIds?.includes(other.id),
    )
    .map((other) => other.target);
  const distractors = pickDistractors(distractorPool, card.target, 3, random);
  if (distractors.length < 3) return null;

  const { options, correctOptionId } = buildOptions(card.target, distractors, random);

  return {
    id: `${card.id}:target`,
    kind: "target",
    cardId: card.id,
    prompt: `${card.genericName}（${card.englishName}）的作用靶点是？`,
    options,
    correctOptionId,
    explanation: `${card.genericName}的作用靶点：${card.target}。机制要点：${card.mechanismSteps[0]?.title ?? ""}。`,
  };
}

/** 生成「所属分类」题 */
function buildCategoryQuestion(
  card: DrugCard,
  allCards: readonly DrugCard[],
  categoryNames: ReadonlyMap<CategoryId, string>,
  random: () => number,
): QuizQuestion | null {
  const correctName = categoryNames.get(card.category);
  if (!correctName) return null;

  // 干扰项用其他分类名
  const distractorPool = Array.from(categoryNames.values());
  const distractors = pickDistractors(distractorPool, correctName, 3, random);
  if (distractors.length < 3) return null;

  const { options, correctOptionId } = buildOptions(correctName, distractors, random);

  return {
    id: `${card.id}:category`,
    kind: "category",
    cardId: card.id,
    prompt: `在本卡片库中，${card.genericName}归入哪一学习分类？`,
    options,
    correctOptionId,
    explanation: `本库将${card.genericName}归入「${correctName}」，这是学习组织方式，不表示它只有这一系统的临床用途。同一分类下的其他药物：${allCards
      .filter((other) => other.category === card.category && other.id !== card.id)
      .map((other) => other.genericName)
      .join("、") || "暂无"}。`,
  };
}

/** 生成「适应症」题：给出药名，选出属于它的适应症 */
function buildIndicationQuestion(
  card: DrugCard,
  allCards: readonly DrugCard[],
  random: () => number,
): QuizQuestion | null {
  if (!card.indicationQuizDistractorIds) return null;
  const correct = card.indications[0];
  if (!correct) return null;

  // 有人工核对的候选时只使用该集合；字符串不同不能证明两个适应症互斥。
  // 候选不足时由下方返回 null，不能回退到可能同样适用于本药的随机选项。
  const distractorPool = card.indicationQuizDistractorIds
        .filter((id) => id !== card.id)
        .flatMap((id) => {
          const first = allCards.find((other) => other.id === id)?.indications[0];
          return first ? [first] : [];
        });
  const distractors = pickDistractors(distractorPool, correct, 3, random);
  if (distractors.length < 3) return null;

  const { options, correctOptionId } = buildOptions(correct, distractors, random);

  return {
    id: `${card.id}:indication`,
    kind: "indication",
    cardId: card.id,
    prompt: `按本卡注明的制剂和范围，下列哪一项是${card.genericName}的代表性用途？`,
    options,
    correctOptionId,
    explanation: `${card.genericName}的代表性用途包括：${card.indications.join("；")}。这是限定范围的学习举例，不替代具体制剂说明书或选药评估。`,
  };
}

/**
 * 仅对已单独核对的机制主线出题。正文段落可能含并行作用、药代或风险提示，
 * 不可自动把前四段当作必然的时间顺序；缺少核对数据时跳过此题型。
 */
function buildMechanismOrderQuestion(
  card: DrugCard,
  random: () => number,
): QuizQuestion | null {
  const reviewed = card.mechanismQuiz;
  if (!reviewed || reviewed.steps.length !== 4 ||
      new Set(reviewed.steps).size !== 4 || reviewed.steps.some((step) => !step.trim()) ||
      !reviewed.explanation.trim()) return null;
  const picked = reviewed.steps;
  const correct = picked[0];
  if (!correct) return null;

  // 选项本身就是这几步的标题，打乱即可；不需要外部干扰项
  const { options, correctOptionId } = buildOptions(
    correct,
    picked.slice(1),
    random,
  );

  return {
    id: `${card.id}:mechanism-order`,
    kind: "mechanism-order",
    cardId: card.id,
    prompt: `沿本卡选取的${card.genericName}作用主线，下列哪一环节位于其余环节的上游？`,
    options,
    correctOptionId,
    explanation: reviewed.explanation,
  };
}

export interface GenerateQuizOptions {
  /** 参与出题的卡片 */
  cards: readonly DrugCard[];
  /** 全量卡片，用于提供干扰项。必须包含 cards 中的全部卡片 */
  allCards: readonly DrugCard[];
  /** 分类 id → 中文名 */
  categoryNames: ReadonlyMap<CategoryId, string>;
  /** 题目数量 */
  count: number;
  /** 随机种子。相同种子 + 相同卡片 = 相同题目序列 */
  seed?: number;
}

/**
 * 重建一张卡片的指定题型题目。
 *
 * 用途：错题重练。错题本里只存了 `cardId:kind` 这样的题目 id，
 * 没有存题干与选项——因为选项完全可以从卡片重新生成。
 * 这样做的好处是卡片内容修订后，错题重练会自动用上新内容，不会出现
 * 「题干说的是旧版机制」这种不一致。
 *
 * 种子由 questionId 派生，保证同一道错题每次重练时选项顺序一致，
 * 用户不会因为选项换位置而误选。
 */
export function buildQuestion(
  card: DrugCard,
  kind: QuestionKind,
  allCards: readonly DrugCard[],
  categoryNames: ReadonlyMap<CategoryId, string>,
): QuizQuestion | null {
  // 用题目 id 派生种子：同一题永远同一套选项顺序
  const random = createRandom(hashString(`${card.id}:${kind}`));

  switch (kind) {
    case "target":
      return buildTargetQuestion(card, allCards, random);
    case "category":
      return buildCategoryQuestion(card, allCards, categoryNames, random);
    case "indication":
      return buildIndicationQuestion(card, allCards, random);
    case "mechanism-order":
      return buildMechanismOrderQuestion(card, random);
    default:
      return null;
  }
}

export interface GenerateWrongBookQuizOptions {
  /** 错题本记录，按调用方给的顺序出题 */
  wrongQuestions: readonly { questionId?: string; cardId: string; kind: QuestionKind }[];
  compareGroups?: readonly CompareGroup[];
  /** 全量卡片，既用于查卡片也用于提供干扰项 */
  allCards: readonly DrugCard[];
  /** 分类 id → 中文名 */
  categoryNames: ReadonlyMap<CategoryId, string>;
  /** 最多出多少题；省略表示全部 */
  limit?: number;
}

/**
 * 从错题本生成一组重练题。
 *
 * 顺序**沿用调用方给的顺序**（错题本按错误次数降序），
 * 不打乱——错得最多的排最前面，正好是用户最该练的。
 *
 * 跳过的情形：卡片已删除、该题型无法生成（如没有经核对的机制主线）。
 * 跳过而不是报错，因为错题本可能比卡片数据活得久。
 */
export function generateWrongBookQuiz({
  wrongQuestions,
  allCards,
  categoryNames,
  limit,
  compareGroups = [],
}: GenerateWrongBookQuizOptions): QuizQuestion[] {
  const cardById = new Map(allCards.map((card) => [card.id, card]));
  const questions: QuizQuestion[] = [];
  const seen = new Set<string>();

  for (const record of wrongQuestions) {
    if (limit !== undefined && questions.length >= limit) break;

    // 同一道题在错题本里本应唯一，这里再兜一层，防止上游数据异常导致重复出题
    const questionKey = record.kind === "compare"
      ? record.questionId
      : `${record.cardId}:${record.kind}`;
    if (!questionKey) continue;
    if (seen.has(questionKey)) continue;

    const card = cardById.get(record.cardId);
    if (!card) continue;

    const question = record.kind === "compare"
      ? buildCompareQuestion(questionKey, compareGroups, allCards)
      : buildQuestion(card, record.kind, allCards, categoryNames);
    if (!question || question.cardId !== record.cardId) continue;

    seen.add(questionKey);
    questions.push(question);
  }

  return questions;
}

/**
 * 生成一组测验题目。
 *
 * 出题策略（两条约束同时满足）：
 * 1. **题型覆盖**：一组题里尽量四种题型都出现。
 * 2. **卡片分散**：同一张卡片不要连续出题。否则会出现
 *    「曲妥珠单抗靶点 → 曲妥珠单抗顺序 → 曲妥珠单抗适应症 → 曲妥珠单抗分类」
 *    这种连珠炮，做完前三题后面的答案已经被前面泄漏了。
 *
 * 实现：外层按题型轮转，内层每次换一张卡片。
 * 这样既保证题型多样，又保证相邻题目考的是不同药物。
 */
export function generateQuiz({
  cards,
  allCards,
  categoryNames,
  count,
  seed = 1,
}: GenerateQuizOptions): QuizQuestion[] {
  if (cards.length === 0 || count <= 0) return [];

  const random = createRandom(seed);

  // 先打乱卡片顺序，避免每次都是同样的开头
  const shuffledCards = shuffle(cards, random);

  const questions: QuizQuestion[] = [];
  const kindRotation: QuestionKind[] = ["target", "mechanism-order", "indication", "category"];

  // 为每种题型建立实际可用的队列。卡片数为 4 的倍数时，不能让卡片游标
  // 与题型游标锁步，否则同一卡片永远只尝试一种题型，跳过机制题后更易短缺。
  const queues = kindRotation.map((kind) => shuffledCards.flatMap((card) => {
    const question = buildQuestion(card, kind, allCards, categoryNames);
    return question ? [question] : [];
  }));
  while (questions.length < count) {
    let added = false;
    for (const queue of queues) {
      if (questions.length >= count) break;
      const previousId = questions[questions.length - 1]?.cardId;
      const different = queue.findIndex((question) => question.cardId !== previousId);
      const [question] = queue.splice(different >= 0 ? different : 0, 1);
      if (question) { questions.push(question); added = true; }
    }
    if (!added) break;
  }

  return questions;
}
