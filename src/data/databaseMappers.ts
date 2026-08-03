import type { AnswersBackup } from './backupFormat';
import type { StoredAnswer } from './database';
import type { QuizMode } from './quizLogic';

export type AnswerRow = {
  id: number;
  questionId: number;
  selectedAnswer: number;
  isCorrect: number;
  answeredAt: string;
  answerHash: string;
  mode: QuizMode | null;
};

export function mapAnswerRow(row: AnswerRow): StoredAnswer {
  return {
    id: row.id,
    questionId: row.questionId,
    selectedAnswer: row.selectedAnswer,
    isCorrect: row.isCorrect === 1,
    answeredAt: row.answeredAt,
    answerHash: row.answerHash,
    mode: row.mode,
  };
}

export function toBackupAnswer(
  answer: StoredAnswer,
): AnswersBackup['answers'][number] {
  return {
    questionId: answer.questionId,
    selectedAnswer: answer.selectedAnswer,
    isCorrect: answer.isCorrect,
    answeredAt: answer.answeredAt,
    answerHash: answer.answerHash,
    ...(answer.mode ? { mode: answer.mode } : {}),
  };
}
