import { describe, expect, it } from 'vitest';
import type { QuizQuestion } from '../data/questions';
import {
  computeOverallStats,
  computeQuestionStats,
  computeTopicStats,
  getNextQuestionIndex,
  getProgressPercent,
  isCorrectAnswer,
  shuffleQuizSession,
} from '../data/quizLogic';

const questions: QuizQuestion[] = [
  {
    id: 1,
    category: 'G',
    topic: 'motion',
    prompt: { en: 'Q1', ru: 'В1' },
    options: [
      { en: 'a', ru: 'а' },
      { en: 'b', ru: 'б' },
      { en: 'c', ru: 'в' },
    ],
    correctAnswer: 1,
    explanation: { en: 'exp1', ru: 'оу1' },
  },
  {
    id: 2,
    category: 'M',
    topic: 'spindle',
    prompt: { en: 'Q2', ru: 'В2' },
    options: [
      { en: 'x', ru: 'х' },
      { en: 'y', ru: 'у' },
    ],
    correctAnswer: 0,
    explanation: { en: 'exp2', ru: 'оу2' },
  },
];

describe('shuffleQuizSession', () => {
  it('reorders questions and options using the injected random source', () => {
    // Reversing shuffle: always swap with index 0.
    const reverseRandom = () => 0;
    const shuffled = shuffleQuizSession(questions, reverseRandom);
    expect(shuffled).toHaveLength(questions.length);
  });

  it('keeps the correct answer text aligned after shuffling options', () => {
    let call = 0;
    const random = () => {
      call += 1;
      return call % 2 === 0 ? 0.9 : 0.1;
    };
    const shuffled = shuffleQuizSession(questions, random);
    for (const question of shuffled) {
      const original = questions.find((q) => q.id === question.id);
      expect(original).toBeDefined();
      if (!original) {
        continue;
      }
      const originalCorrectText = original.options[original.correctAnswer];
      expect(question.options[question.correctAnswer]).toBe(
        originalCorrectText,
      );
      expect(question.options.map((o) => o.en).sort()).toEqual(
        original.options.map((o) => o.en).sort(),
      );
    }
  });

  it('does not mutate the input array', () => {
    const copy = questions.map((question) => ({ ...question }));
    shuffleQuizSession(questions);
    expect(questions).toEqual(copy);
  });
});

describe('getProgressPercent', () => {
  it('returns 0 when there are no questions', () => {
    expect(getProgressPercent(0, 0)).toBe(0);
  });

  it('computes percentage based on 1-indexed position', () => {
    expect(getProgressPercent(0, 4)).toBe(25);
    expect(getProgressPercent(3, 4)).toBe(100);
  });
});

describe('getNextQuestionIndex', () => {
  it('advances to the next index', () => {
    expect(getNextQuestionIndex(0, 3)).toBe(1);
  });

  it('wraps back to 0 after the last question', () => {
    expect(getNextQuestionIndex(2, 3)).toBe(0);
  });

  it('returns 0 when there are no questions', () => {
    expect(getNextQuestionIndex(0, 0)).toBe(0);
  });
});

describe('isCorrectAnswer', () => {
  it('matches the question correctAnswer index', () => {
    expect(isCorrectAnswer(questions[0] as QuizQuestion, 1)).toBe(true);
    expect(isCorrectAnswer(questions[0] as QuizQuestion, 0)).toBe(false);
  });
});

describe('stats computation', () => {
  const answers = [
    { questionId: 1, isCorrect: true },
    { questionId: 1, isCorrect: false },
    { questionId: 2, isCorrect: true },
  ];

  it('computes per-question stats', () => {
    const stats = computeQuestionStats(questions, answers);
    const q1 = stats.find((stat) => stat.questionId === 1);
    const q2 = stats.find((stat) => stat.questionId === 2);
    expect(q1).toMatchObject({ attempts: 2, correct: 1, accuracy: 50 });
    expect(q2).toMatchObject({ attempts: 1, correct: 1, accuracy: 100 });
  });

  it('includes unattempted questions with zero stats', () => {
    const stats = computeQuestionStats(questions, []);
    expect(
      stats.every((stat) => stat.attempts === 0 && stat.accuracy === 0),
    ).toBe(true);
  });

  it('aggregates stats by topic', () => {
    const stats = computeQuestionStats(questions, answers);
    const topicStats = computeTopicStats(stats);
    const motion = topicStats.find((stat) => stat.topic === 'motion');
    const spindle = topicStats.find((stat) => stat.topic === 'spindle');
    expect(motion).toMatchObject({ attempts: 2, correct: 1, accuracy: 50 });
    expect(spindle).toMatchObject({ attempts: 1, correct: 1, accuracy: 100 });
  });

  it('computes overall stats', () => {
    const overall = computeOverallStats(questions, answers);
    expect(overall).toEqual({
      totalAttempts: 3,
      totalCorrect: 2,
      accuracy: 67,
      questionsAttempted: 2,
      questionsTotal: 2,
    });
  });

  it('handles no answers gracefully', () => {
    const overall = computeOverallStats(questions, []);
    expect(overall).toEqual({
      totalAttempts: 0,
      totalCorrect: 0,
      accuracy: 0,
      questionsAttempted: 0,
      questionsTotal: 2,
    });
  });
});
