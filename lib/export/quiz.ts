import type { QuizAttemptExportRow } from "@/lib/data/export";
import type { ExportColumn, ExportDataset, ExportRecord } from "@/lib/export/serialize";
import { QUESTION_KIND_LABELS, type QuestionKind } from "@/lib/quiz/generator";

export function quizExportDataset(
  attempts: QuizAttemptExportRow[],
  lookup: ReadonlyMap<string, { genericName: string; categoryName: string }>,
): ExportDataset {
  const columns: ExportColumn[] = [
    { key: "answeredAt", header: "答题时刻" },
    { key: "answeredOn", header: "答题日期" },
    { key: "questionId", header: "题目ID" },
    { key: "cardId", header: "卡片ID" },
    { key: "genericName", header: "通用名" },
    { key: "categoryName", header: "所属分类" },
    { key: "kindLabel", header: "题型" },
    { key: "isCorrectLabel", header: "是否正确" },
    { key: "isCorrect", header: "是否正确(布尔)" },
    { key: "attemptId", header: "答题记录ID" },
    { key: "kind", header: "题型代码" },
    { key: "selectedId", header: "所选选项ID" },
    { key: "correctId", header: "正确选项ID" },
  ];

  const records: ExportRecord[] = attempts.map((row) => {
    const card = lookup.get(row.cardId);
    return {
      answeredAt: row.answeredAt,
      answeredOn: row.answeredOn,
      questionId: row.questionId,
      cardId: row.cardId,
      genericName: card?.genericName ?? "（卡片已删除）",
      categoryName: card?.categoryName ?? "",
      kindLabel: QUESTION_KIND_LABELS[row.kind as QuestionKind] ?? row.kind,
      isCorrectLabel: row.isCorrect ? "是" : "否",
      isCorrect: row.isCorrect,
      attemptId: row.attemptId,
      kind: row.kind,
      selectedId: row.selectedId,
      correctId: row.correctId,
    };
  });

  return { kind: "quiz", columns, records };
}
