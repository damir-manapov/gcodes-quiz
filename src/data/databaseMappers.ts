import type { LocalizedText } from '../i18n';
import type { AnswersBackup } from './backupFormat';
import type { StoredAnswer } from './database';
import type { QuizCategory, QuizQuestion } from './questions';
import type { QuizMode } from './quizLogic';

export type QuestionRow = {
  id: number;
  prompt: string;
  options: string;
  correctAnswer: number;
  explanation: string;
  category: QuizCategory;
  topic: string;
  code: string | null;
};

// Pulled out of database.ts so the JSON-parsing/optional-field logic can be
// unit tested without a real SQLite database.
export function mapQuestionRow(row: QuestionRow): QuizQuestion {
  return {
    id: row.id,
    prompt: JSON.parse(row.prompt) as LocalizedText,
    options: JSON.parse(row.options) as LocalizedText[],
    correctAnswer: row.correctAnswer,
    explanation: JSON.parse(row.explanation) as LocalizedText,
    category: row.category,
    topic: row.topic,
    ...(row.code ? { code: row.code } : {}),
  };
}

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
