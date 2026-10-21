import type { CategoryId, CompareGroup, DrugCard } from "@/lib/types";
import { buildQuestion, type QuestionKind, type QuizQuestion } from "@/lib/quiz/generator";
import { validateCompareAnswer } from "@/lib/quiz/compare-generator";

/** 服务端重建题目，拒绝伪造身份、过期答案和题目之外的选项。 */
export function validateQuizAnswer(
  input: unknown,
  groups: readonly CompareGroup[],
  cards: readonly DrugCard[],
  categoryNames: ReadonlyMap<CategoryId, string>,
): { question: QuizQuestion; selectedId: string } | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const values = input as Record<string, unknown>;
  const keys = ["questionId", "cardId", "kind", "selectedId", "correctId"] as const;
  if (keys.some((key) => typeof values[key] !== "string" || !values[key] || (values[key] as string).length > 512)) return null;
  const answer = values as Record<(typeof keys)[number], string>;
  let question: QuizQuestion | null;
  if (answer.kind === "compare") {
    question = validateCompareAnswer(answer, groups, cards);
  } else {
    if (!["target", "category", "indication", "mechanism-order"].includes(answer.kind) ||
        answer.questionId !== `${answer.cardId}:${answer.kind}`) return null;
    const card = cards.find((item) => item.id === answer.cardId);
    if (!card) return null;
    question = buildQuestion(card, answer.kind as QuestionKind, cards, categoryNames);
  }
  if (!question || question.correctOptionId !== answer.correctId ||
      !question.options.some((option) => option.id === answer.selectedId)) return null;
  return { question, selectedId: answer.selectedId };
}
