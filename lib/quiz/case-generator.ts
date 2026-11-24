import type { CaseQuestionSpec, CategoryId } from "@/lib/types";
import type { QuizQuestion } from "@/lib/quiz/generator";
import { createRandom, hashString, shuffle } from "@/lib/quiz/random";

const VALID_CASE_ID_RE = /^[a-z0-9-]+$/;

/**
 * 按稳定题目 id（格式 `case:${spec.id}`）还原临床机制情景题。
 * 选项顺序由 questionId 派生的种子决定性打乱，保证重练和刷新时一致。
 */
export function buildCaseQuestion(
  questionId: string,
  caseQuestions: readonly CaseQuestionSpec[],
): QuizQuestion | null {
  if (!questionId.startsWith("case:")) return null;
  const specId = questionId.slice("case:".length);
  if (!specId || !VALID_CASE_ID_RE.test(specId)) return null;

  const matches = caseQuestions.filter((item) => item.id === specId);
  if (matches.length !== 1) return null;
  const spec = matches[0];
  if (!spec) return null;

  if (
    !spec.cardId.trim() ||
    !spec.prompt.trim() ||
    !spec.explanation.trim() ||
    spec.distractors.length !== 3
  ) {
    return null;
  }

  const rawOptions = [spec.correctOption, ...spec.distractors];
  if (rawOptions.some((option) => !option.trim())) return null;
  if (new Set(rawOptions.map((option) => option.trim())).size !== 4) return null;

  const random = createRandom(hashString(questionId));
  const shuffled = shuffle(rawOptions, random);
  const options = shuffled.map((text, index) => ({
    id: `opt-${index}`,
    text,
  }));
  const correctOption = options.find((option) => option.text === spec.correctOption);
  if (!correctOption) return null;

  return {
    id: questionId,
    kind: "case",
    cardId: spec.cardId,
    prompt: spec.prompt,
    options,
    correctOptionId: correctOption.id,
    explanation: spec.explanation,
  };
}

export interface GenerateCaseQuizOptions {
  caseQuestions: readonly CaseQuestionSpec[];
  category?: CategoryId;
  count?: number;
  seed?: number;
}

/**
 * 生成一组临床机制情景测验题。
 * 支持按分类筛选；相同参数与种子保证返回一致的题目序列。
 */
export function generateCaseQuiz({
  caseQuestions,
  category,
  count = 10,
  seed = 1,
}: GenerateCaseQuizOptions): QuizQuestion[] {
  if (!Number.isFinite(count) || count <= 0) return [];
  const limit = Math.floor(count);
  if (limit <= 0) return [];

  const filtered = category
    ? caseQuestions.filter((item) => item.category === category)
    : caseQuestions;

  const shuffled = shuffle(filtered, createRandom(seed));
  const questions: QuizQuestion[] = [];
  const seen = new Set<string>();

  for (const spec of shuffled) {
    if (questions.length >= limit) break;
    if (seen.has(spec.id)) continue;
    const question = buildCaseQuestion(`case:${spec.id}`, caseQuestions);
    if (question) {
      seen.add(spec.id);
      questions.push(question);
    }
  }

  return questions;
}

export interface ValidateCaseAnswerInput {
  questionId: string;
  cardId: string;
  kind: string;
  selectedId: string;
  correctId: string;
}

/**
 * 服务端校验临床机制情景题作答，拒绝伪造题型、卡片、答案或非法选项。
 */
export function validateCaseAnswer(
  input: ValidateCaseAnswerInput,
  caseQuestions: readonly CaseQuestionSpec[],
): QuizQuestion | null {
  if (input.kind !== "case") return null;
  const question = buildCaseQuestion(input.questionId, caseQuestions);
  if (!question) return null;
  if (question.cardId !== input.cardId) return null;
  if (question.correctOptionId !== input.correctId) return null;
  if (!question.options.some((option) => option.id === input.selectedId)) return null;
  return question;
}
