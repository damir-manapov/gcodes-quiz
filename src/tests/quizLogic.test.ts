import { describe, expect, it } from 'vitest';
import type { QuizQuestion } from '../data/questions';
import {
  type AnswerHistoryRecord,
  buildSessionQuestion,
  computeHashCounts,
  computeOverallStats,
  computeQuestionStats,
  computeTopicStats,
  getAnswerHash,
  getNextQuestionIndex,
  getProgressPercent,
  getQuestionCode,
  hashAnswerText,
  isCorrectAnswer,
  orderQuestions,
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

describe('orderQuestions', () => {
  const question3: QuizQuestion = {
    id: 3,
    category: 'G',
    topic: 'tool-change',
    prompt: { en: 'Q3', ru: 'В3' },
    options: [
      { en: 'p', ru: 'п' },
      { en: 'q', ru: 'к' },
    ],
    correctAnswer: 0,
    explanation: { en: 'exp3', ru: 'оу3' },
  };
  const orderingQuestions = [...questions, question3];

  it('keeps the same set of questions for a random order', () => {
    const ordered = orderQuestions(orderingQuestions, [], 'random', () => 0);
    expect(ordered.map((q) => q.id).sort()).toEqual(
      orderingQuestions.map((q) => q.id).sort(),
    );
  });

  it('orders by lowest accuracy first, with unattempted questions last', () => {
    const answers: AnswerHistoryRecord[] = [
      { questionId: 1, isCorrect: true, answeredAt: '2024-01-01T00:00:00Z' },
      { questionId: 1, isCorrect: false, answeredAt: '2024-01-02T00:00:00Z' },
      { questionId: 2, isCorrect: false, answeredAt: '2024-01-01T00:00:00Z' },
    ];
    const ordered = orderQuestions(orderingQuestions, answers, 'weakest');
    expect(ordered.map((q) => q.id)).toEqual([2, 1, 3]);
  });

  it('orders by fewest attempts first', () => {
    const answers: AnswerHistoryRecord[] = [
      { questionId: 1, isCorrect: true, answeredAt: '2024-01-01T00:00:00Z' },
      { questionId: 1, isCorrect: true, answeredAt: '2024-01-02T00:00:00Z' },
      { questionId: 2, isCorrect: true, answeredAt: '2024-01-01T00:00:00Z' },
    ];
    const ordered = orderQuestions(
      orderingQuestions,
      answers,
      'least-answered',
    );
    expect(ordered.map((q) => q.id)).toEqual([3, 2, 1]);
  });

  it('orders never-answered and long-untouched questions first', () => {
    const answers: AnswerHistoryRecord[] = [
      { questionId: 1, isCorrect: true, answeredAt: '2024-06-01T00:00:00Z' },
      { questionId: 2, isCorrect: true, answeredAt: '2024-01-01T00:00:00Z' },
    ];
    const ordered = orderQuestions(orderingQuestions, answers, 'stale');
    expect(ordered.map((q) => q.id)).toEqual([3, 2, 1]);
  });
});

describe('getQuestionCode', () => {
  it('uses the explicit code field when set', () => {
    const question: QuizQuestion = {
      id: 10,
      category: 'M',
      topic: 'spindle',
      code: 'M05',
      prompt: { en: 'Which command stops the spindle?', ru: 'В1' },
      options: [{ en: 'M05', ru: 'M05' }],
      correctAnswer: 0,
      explanation: { en: 'exp', ru: 'оу' },
    };
    expect(getQuestionCode(question)).toBe('M05');
  });

  it('infers the code from a prompt mentioning exactly one code', () => {
    const question: QuizQuestion = {
      id: 11,
      category: 'G',
      topic: 'motion',
      prompt: { en: 'What does G00 command do?', ru: 'В1' },
      options: [{ en: 'Rapid move', ru: 'а' }],
      correctAnswer: 0,
      explanation: { en: 'exp', ru: 'оу' },
    };
    expect(getQuestionCode(question)).toBe('G00');
  });

  it('returns null when the prompt has no code or more than one code', () => {
    const noCode: QuizQuestion = {
      id: 12,
      category: 'G',
      topic: 'general',
      prompt: { en: 'What is the purpose of a G code?', ru: 'В1' },
      options: [{ en: 'a', ru: 'а' }],
      correctAnswer: 0,
      explanation: { en: 'exp', ru: 'оу' },
    };
    const twoCodes: QuizQuestion = {
      id: 13,
      category: 'G',
      topic: 'canned-cycle',
      prompt: { en: 'How does G82 differ from G81?', ru: 'В1' },
      options: [{ en: 'a', ru: 'а' }],
      correctAnswer: 0,
      explanation: { en: 'exp', ru: 'оу' },
    };
    expect(getQuestionCode(noCode)).toBeNull();
    expect(getQuestionCode(twoCodes)).toBeNull();
  });
});

describe('toReverseQuestion (via buildSessionQuestion in reverse mode)', () => {
  const pool: QuizQuestion[] = [
    {
      id: 20,
      category: 'G',
      topic: 'motion',
      prompt: { en: 'What does G00 command do?', ru: 'В1' },
      options: [
        { en: 'Rapid positioning move', ru: 'а' },
        { en: 'Linear interpolation', ru: 'б' },
      ],
      correctAnswer: 0,
      explanation: { en: 'exp', ru: 'оу' },
    },
    {
      id: 21,
      category: 'G',
      topic: 'motion',
      prompt: { en: 'What does G01 command do?', ru: 'В2' },
      options: [{ en: 'Linear interpolation', ru: 'б' }],
      correctAnswer: 0,
      explanation: { en: 'exp', ru: 'оу' },
    },
    {
      id: 22,
      category: 'M',
      topic: 'spindle',
      prompt: { en: 'What does M03 command do?', ru: 'В3' },
      options: [{ en: 'Spindle clockwise', ru: 'в' }],
      correctAnswer: 0,
      explanation: { en: 'exp', ru: 'оу' },
    },
  ];
  const noHistory = new Map<string, number>();

  it('swaps the prompt for the description and the options for codes', () => {
    const target = pool[0] as QuizQuestion;
    const reversed = buildSessionQuestion(
      target,
      pool,
      'reverse',
      noHistory,
      4,
      () => 0,
    );
    expect(reversed.prompt).toEqual({
      en: 'Rapid positioning move',
      ru: 'а',
    });
    expect(reversed.options.map((option) => option.en)).toEqual(
      expect.arrayContaining(['G00']),
    );
    expect(reversed.options[reversed.correctAnswer]?.en).toBe('G00');
  });

  it('draws distractor codes from other questions in the pool', () => {
    const target = pool[0] as QuizQuestion;
    const reversed = buildSessionQuestion(
      target,
      pool,
      'reverse',
      noHistory,
      4,
      () => 0,
    );
    const codes = reversed.options.map((option) => option.en);
    expect(codes).toContain('G01');
    expect(codes).toContain('M03');
  });

  it('returns the question unchanged when no single code can be found', () => {
    const conceptual: QuizQuestion = {
      id: 23,
      category: 'G',
      topic: 'general',
      prompt: { en: 'What is the purpose of a G code?', ru: 'В1' },
      options: [{ en: 'a', ru: 'а' }],
      correctAnswer: 0,
      explanation: { en: 'exp', ru: 'оу' },
    };
    expect(buildSessionQuestion(conceptual, pool, 'reverse', noHistory)).toBe(
      conceptual,
    );
  });
});

describe('hashAnswerText / getAnswerHash', () => {
  it('is deterministic for the same text', () => {
    expect(hashAnswerText('Rapid positioning move')).toBe(
      hashAnswerText('Rapid positioning move'),
    );
  });

  it('differs for different text', () => {
    expect(hashAnswerText('Rapid positioning move')).not.toBe(
      hashAnswerText('Linear interpolation'),
    );
  });

  it('hashes only the English text of a localized value', () => {
    expect(getAnswerHash({ en: 'Rapid move', ru: 'Быстрое перемещение' })).toBe(
      hashAnswerText('Rapid move'),
    );
  });
});

describe('computeHashCounts', () => {
  it('tallies how many times each (questionId, answerHash) pair occurs', () => {
    const counts = computeHashCounts([
      { questionId: 1, answerHash: 'a' },
      { questionId: 1, answerHash: 'a' },
      { questionId: 1, answerHash: 'b' },
      { questionId: 2, answerHash: 'a' },
    ]);
    expect(counts.get('1:a')).toBe(2);
    expect(counts.get('1:b')).toBe(1);
    expect(counts.get('2:a')).toBe(1);
    expect(counts.get('3:a')).toBeUndefined();
  });
});

describe('buildSessionQuestion (forward mode)', () => {
  const target: QuizQuestion = {
    id: 1,
    category: 'G',
    topic: 'motion',
    prompt: { en: 'What does G00 command do?', ru: 'В1' },
    options: [
      { en: 'Rapid positioning move', ru: 'а' },
      { en: 'wrongA', ru: 'а' },
    ],
    correctAnswer: 0,
    explanation: { en: 'exp', ru: 'оу' },
  };
  const others: QuizQuestion[] = ['other1', 'other2', 'other3', 'other4'].map(
    (label, index) => ({
      id: 100 + index,
      category: 'M',
      topic: 'misc',
      prompt: { en: `prompt ${label}`, ru: `в ${label}` },
      options: [{ en: label, ru: label }],
      correctAnswer: 0,
      explanation: { en: 'exp', ru: 'оу' },
    }),
  );
  const allQuestions = [target, ...others];

  it('keeps the correct answer text aligned and pulls extra distractors from other questions', () => {
    const built = buildSessionQuestion(
      target,
      allQuestions,
      'forward',
      new Map(),
      4,
      () => 0,
    );
    expect(built.options[built.correctAnswer]).toEqual(
      target.options[target.correctAnswer],
    );
    expect(built.options.length).toBe(4);
    const texts = built.options.map((option) => option.en);
    expect(texts).toContain('Rapid positioning move');
    expect(texts.some((text) => text.startsWith('other'))).toBe(true);
  });

  it('weights distractors the user has picked more often for this question so they resurface more', () => {
    const noHistory = new Map<string, number>();
    const baseline = buildSessionQuestion(
      target,
      allQuestions,
      'forward',
      noHistory,
      2,
      () => 0.9,
    );

    const boostedHash = getAnswerHash({ en: 'other2', ru: 'other2' });
    const withHistory = new Map<string, number>([
      [`${target.id}:${boostedHash}`, 100],
    ]);
    const weighted = buildSessionQuestion(
      target,
      allQuestions,
      'forward',
      withHistory,
      2,
      () => 0.9,
    );

    const baselineTexts = baseline.options.map((option) => option.en);
    const weightedTexts = weighted.options.map((option) => option.en);
    expect(baselineTexts).not.toContain('other2');
    expect(weightedTexts).toContain('other2');
  });
});
