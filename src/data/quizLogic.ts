import type { LocalizedText } from '../i18n';
import type { QuizCategory, QuizQuestion } from './questions';

export type AnswerRecord = {
  questionId: number;
  isCorrect: boolean;
};

export type AnswerHistoryRecord = {
  questionId: number;
  isCorrect: boolean;
  answeredAt: string;
};

export type QuestionOrder = 'random' | 'weakest' | 'stale' | 'least-answered';

export const QUESTION_ORDERS: QuestionOrder[] = [
  'random',
  'weakest',
  'stale',
  'least-answered',
];

export type QuestionStat = {
  questionId: number;
  category: QuizCategory;
  topic: string;
  prompt: LocalizedText;
  attempts: number;
  correct: number;
  accuracy: number;
};

export type TopicStat = {
  topic: string;
  attempts: number;
  correct: number;
  accuracy: number;
};

export type OverallStats = {
  totalAttempts: number;
  totalCorrect: number;
  accuracy: number;
  questionsAttempted: number;
  questionsTotal: number;
};

function toAccuracy(correct: number, attempts: number): number {
  return attempts === 0 ? 0 : Math.round((correct / attempts) * 100);
}

function shuffle<T>(items: T[], random: () => number): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    const temp = result[i] as T;
    result[i] = result[j] as T;
    result[j] = temp;
  }
  return result;
}

function shuffleQuestionOptions(
  question: QuizQuestion,
  random: () => number,
): QuizQuestion {
  const pairs = question.options.map((text, index) => ({
    text,
    isCorrect: index === question.correctAnswer,
  }));
  const shuffledPairs = shuffle(pairs, random);
  const correctAnswer = shuffledPairs.findIndex((pair) => pair.isCorrect);

  return {
    ...question,
    options: shuffledPairs.map((pair) => pair.text),
    correctAnswer,
  };
}

export function shuffleQuizSession(
  questions: QuizQuestion[],
  random: () => number = Math.random,
): QuizQuestion[] {
  return shuffle(questions, random).map((question) =>
    shuffleQuestionOptions(question, random),
  );
}

export function shuffleQuestionOptionsForSession(
  questions: QuizQuestion[],
  random: () => number = Math.random,
): QuizQuestion[] {
  return questions.map((question) => shuffleQuestionOptions(question, random));
}

type QuestionOrderStat = {
  attempts: number;
  correct: number;
  lastAnsweredAt: string;
};

// Empty string sorts before any ISO timestamp, so never-answered questions
// are treated as the longest overdue.
const NEVER_ANSWERED = '';

export function orderQuestions(
  questions: QuizQuestion[],
  answers: AnswerHistoryRecord[],
  order: QuestionOrder,
  random: () => number = Math.random,
): QuizQuestion[] {
  if (order === 'random') {
    return shuffle(questions, random);
  }

  const statsByQuestion = new Map<number, QuestionOrderStat>();
  for (const answer of answers) {
    const entry = statsByQuestion.get(answer.questionId) ?? {
      attempts: 0,
      correct: 0,
      lastAnsweredAt: NEVER_ANSWERED,
    };
    entry.attempts += 1;
    if (answer.isCorrect) {
      entry.correct += 1;
    }
    if (answer.answeredAt > entry.lastAnsweredAt) {
      entry.lastAnsweredAt = answer.answeredAt;
    }
    statsByQuestion.set(answer.questionId, entry);
  }

  const withStats = questions.map((question) => ({
    question,
    stat: statsByQuestion.get(question.id) ?? {
      attempts: 0,
      correct: 0,
      lastAnsweredAt: NEVER_ANSWERED,
    },
  }));

  switch (order) {
    case 'weakest':
      return withStats
        .sort((a, b) => {
          const accuracyA =
            a.stat.attempts === 0
              ? Number.POSITIVE_INFINITY
              : a.stat.correct / a.stat.attempts;
          const accuracyB =
            b.stat.attempts === 0
              ? Number.POSITIVE_INFINITY
              : b.stat.correct / b.stat.attempts;
          return accuracyA - accuracyB;
        })
        .map((item) => item.question);
    case 'least-answered':
      return withStats
        .sort((a, b) => a.stat.attempts - b.stat.attempts)
        .map((item) => item.question);
    case 'stale':
      return withStats
        .sort((a, b) =>
          a.stat.lastAnsweredAt.localeCompare(b.stat.lastAnsweredAt),
        )
        .map((item) => item.question);
    default:
      return questions;
  }
}

export function getProgressPercent(
  currentIndex: number,
  total: number,
): number {
  if (total === 0) {
    return 0;
  }
  return ((currentIndex + 1) / total) * 100;
}

export function getNextQuestionIndex(
  currentIndex: number,
  total: number,
): number {
  if (total === 0) {
    return 0;
  }
  return currentIndex < total - 1 ? currentIndex + 1 : 0;
}

export function isCorrectAnswer(
  question: QuizQuestion,
  answerIndex: number,
): boolean {
  return answerIndex === question.correctAnswer;
}

export function computeQuestionStats(
  questions: QuizQuestion[],
  answers: AnswerRecord[],
): QuestionStat[] {
  const byQuestion = new Map<number, { attempts: number; correct: number }>();
  for (const answer of answers) {
    const entry = byQuestion.get(answer.questionId) ?? {
      attempts: 0,
      correct: 0,
    };
    entry.attempts += 1;
    if (answer.isCorrect) {
      entry.correct += 1;
    }
    byQuestion.set(answer.questionId, entry);
  }

  return questions.map((question) => {
    const entry = byQuestion.get(question.id) ?? { attempts: 0, correct: 0 };
    return {
      questionId: question.id,
      category: question.category,
      topic: question.topic,
      prompt: question.prompt,
      attempts: entry.attempts,
      correct: entry.correct,
      accuracy: toAccuracy(entry.correct, entry.attempts),
    };
  });
}

export function computeTopicStats(questionStats: QuestionStat[]): TopicStat[] {
  const byTopic = new Map<string, { attempts: number; correct: number }>();
  for (const stat of questionStats) {
    const entry = byTopic.get(stat.topic) ?? { attempts: 0, correct: 0 };
    entry.attempts += stat.attempts;
    entry.correct += stat.correct;
    byTopic.set(stat.topic, entry);
  }

  return Array.from(byTopic.entries())
    .map(([topic, entry]) => ({
      topic,
      attempts: entry.attempts,
      correct: entry.correct,
      accuracy: toAccuracy(entry.correct, entry.attempts),
    }))
    .sort((a, b) => a.topic.localeCompare(b.topic));
}

export function computeOverallStats(
  questions: QuizQuestion[],
  answers: AnswerRecord[],
): OverallStats {
  const totalAttempts = answers.length;
  const totalCorrect = answers.filter((answer) => answer.isCorrect).length;
  const attemptedIds = new Set(answers.map((answer) => answer.questionId));

  return {
    totalAttempts,
    totalCorrect,
    accuracy: toAccuracy(totalCorrect, totalAttempts),
    questionsAttempted: attemptedIds.size,
    questionsTotal: questions.length,
  };
}
