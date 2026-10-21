import type { CompareGroup, DrugCard } from "@/lib/types";
import type { QuizQuestion } from "@/lib/quiz/generator";
import { createRandom, hashString, shuffle } from "@/lib/quiz/random";
import { quiz as quizCopy } from "@/lib/copy";

/** 按稳定 id 还原原题。行顺序或药物顺序调整后仍指向同一维度、同一种药。 */
export function buildCompareQuestion(
  questionId: string,
  groups: readonly CompareGroup[],
  cards: readonly DrugCard[],
): QuizQuestion | null {
  const parts = questionId.split(":");
  if (parts.length !== 4 || parts[0] !== "compare") return null;
  const [, groupId, rowId, cardId] = parts;
  const group = groups.find((item) => item.id === groupId);
  const row = group?.rows.find((item) => item.quizId === rowId);
  if (!group || !row || !row.quizId || !cardId) return null;
  if (group.rows.filter((item) => item.quizId === rowId).length !== 1) return null;
  if (group.drugIds.length < 2 || group.drugIds.length > 4 ||
      new Set(group.drugIds).size !== group.drugIds.length) return null;
  if (row.values.length !== group.drugIds.length ||
      row.values.some((value) => !value.trim()) ||
      new Set(row.values.map((value) => value.trim())).size !== row.values.length) return null;
  const drugs = group.drugIds.map((id) => cards.find((card) => card.id === id));
  if (drugs.some((card) => !card) ||
      new Set(drugs.map((card) => card?.genericName)).size !== drugs.length) return null;
  const value = row.values[group.drugIds.indexOf(cardId)];
  if (!value) return null;
  return {
    id: questionId,
    kind: "compare",
    cardId,
    comparison: { id: group.id, title: group.title, dimension: row.label },
    prompt: quizCopy.comparePrompt(group.title, row.label, value),
    options: shuffle(
      drugs.map((card) => ({ id: `drug-${card!.id}`, text: card!.genericName })),
      createRandom(hashString(questionId)),
    ),
    correctOptionId: `drug-${cardId}`,
    explanation: `${row.label}\n${drugs.map((card, index) =>
      `${card!.genericName}：${row.values[index]}`).join("\n")}${
      row.quizExplanation ? `\n\n${row.quizExplanation}` : ""}`,
  };
}

/** 每轮每个维度只出一道；不足 count 时按实有数量，不重复凑题。 */
export function generateCompareQuiz({
  group, allCards, count = 8, seed = 1,
}: {
  group: CompareGroup;
  allCards: readonly DrugCard[];
  count?: number;
  seed?: number;
}): QuizQuestion[] {
  if (!Number.isFinite(count) || count <= 0) return [];
  const random = createRandom(seed);
  const questions: QuizQuestion[] = [];
  const seen = new Set<string>();
  const drugIds = shuffle(group.drugIds, random);
  for (const row of shuffle(group.rows.filter((item) => item.quizId), random)) {
    if (questions.length >= Math.floor(count)) break;
    if (!row.quizId || seen.has(row.quizId)) continue;
    const cardId = drugIds[questions.length % drugIds.length];
    if (!cardId) continue;
    const question = buildCompareQuestion(
      `compare:${group.id}:${row.quizId}:${cardId}`, [group], allCards,
    );
    if (question) {
      seen.add(row.quizId);
      questions.push(question);
    }
  }
  return questions;
}

/** 服务端校验题目身份、卡片与选项，并使用数据源中的正确答案。 */
export function validateCompareAnswer(
  input: { questionId: string; cardId: string; selectedId: string; correctId: string },
  groups: readonly CompareGroup[],
  cards: readonly DrugCard[],
): QuizQuestion | null {
  const question = buildCompareQuestion(input.questionId, groups, cards);
  if (!question || question.cardId !== input.cardId ||
      question.correctOptionId !== input.correctId ||
      !question.options.some((option) => option.id === input.selectedId)) return null;
  return question;
}
