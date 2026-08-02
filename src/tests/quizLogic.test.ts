import { describe, expect, it } from 'vitest';
import type { QuizQuestion } from '../data/questions';
import {
  type AnswerHistoryRecord,
  areCodesClose,
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
  isCorrectTypedAnswer,
  normalizeCode,
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
    const ordered = orderQuestions(
      orderingQuestions,
      [],
      'random',
      'forward',
      () => 0,
    );
    expect(ordered.map((q) => q.id).sort()).toEqual(
      orderingQuestions.map((q) => q.id).sort(),
    );
  });

  it('orders by lowest accuracy first, with unattempted questions last', () => {
    const answers: AnswerHistoryRecord[] = [
      {
        questionId: 1,
        isCorrect: true,
        answeredAt: '2024-01-01T00:00:00Z',
        mode: 'forward',
      },
      {
        questionId: 1,
        isCorrect: false,
        answeredAt: '2024-01-02T00:00:00Z',
        mode: 'forward',
      },
      {
        questionId: 2,
        isCorrect: false,
        answeredAt: '2024-01-01T00:00:00Z',
        mode: 'forward',
      },
    ];
    const ordered = orderQuestions(
      orderingQuestions,
      answers,
      'weakest',
      'forward',
    );
    expect(ordered.map((q) => q.id)).toEqual([2, 1, 3]);
  });

  it('orders by fewest attempts first', () => {
    const answers: AnswerHistoryRecord[] = [
      {
        questionId: 1,
        isCorrect: true,
        answeredAt: '2024-01-01T00:00:00Z',
        mode: 'forward',
      },
      {
        questionId: 1,
        isCorrect: true,
        answeredAt: '2024-01-02T00:00:00Z',
        mode: 'forward',
      },
      {
        questionId: 2,
        isCorrect: true,
        answeredAt: '2024-01-01T00:00:00Z',
        mode: 'forward',
      },
    ];
    const ordered = orderQuestions(
      orderingQuestions,
      answers,
      'least-answered',
      'forward',
    );
    expect(ordered.map((q) => q.id)).toEqual([3, 2, 1]);
  });

  it('shuffles questions tied on the sort key instead of using creation order', () => {
    // None of the questions have been answered, so all three tie on
    // attempts (0). A different "random" source should produce a different
    // tie order instead of always falling back to creation order (1, 2, 3).
    const shuffled = orderQuestions(
      orderingQuestions,
      [],
      'least-answered',
      'forward',
      () => 0,
    );
    const identity = orderQuestions(
      orderingQuestions,
      [],
      'least-answered',
      'forward',
      // A random source close to 1 leaves the Fisher-Yates shuffle a no-op.
      () => 0.999,
    );
    expect(shuffled.map((q) => q.id)).toEqual([2, 3, 1]);
    expect(identity.map((q) => q.id)).toEqual([1, 2, 3]);
  });

  it('only counts the 10 most recent answers per question', () => {
    // Question 1 was missed 11 times long ago but has since been answered
    // correctly 10 times in a row; only the recent streak should count,
    // so it should no longer look "weak".
    const oldMisses: AnswerHistoryRecord[] = Array.from(
      { length: 11 },
      (_, i) => ({
        questionId: 1,
        isCorrect: false,
        answeredAt: `2024-01-01T00:00:0${i % 10}Z`,
        mode: 'forward' as const,
      }),
    );
    const recentCorrect: AnswerHistoryRecord[] = Array.from(
      { length: 10 },
      (_, i) => ({
        questionId: 1,
        isCorrect: true,
        answeredAt: `2024-02-01T00:00:0${i}Z`,
        mode: 'forward' as const,
      }),
    );
    const answers = [...oldMisses, ...recentCorrect];
    const ordered = orderQuestions(
      orderingQuestions,
      answers,
      'weakest',
      'forward',
      () => 0.999,
    );
    // Question 1's recent accuracy is perfect (better than the unattempted
    // questions 2 and 3, which sort last), so it now sorts first.
    expect(ordered.map((q) => q.id)).toEqual([1, 2, 3]);
  });

  it('orders never-answered and long-untouched questions first', () => {
    const answers: AnswerHistoryRecord[] = [
      {
        questionId: 1,
        isCorrect: true,
        answeredAt: '2024-06-01T00:00:00Z',
        mode: 'forward',
      },
      {
        questionId: 2,
        isCorrect: true,
        answeredAt: '2024-01-01T00:00:00Z',
        mode: 'forward',
      },
    ];
    const ordered = orderQuestions(
      orderingQuestions,
      answers,
      'stale',
      'forward',
    );
    expect(ordered.map((q) => q.id)).toEqual([3, 2, 1]);
  });

  it("only counts a question's answers from the requested mode", () => {
    // Question 1 is perfect in forward mode but has never been answered in
    // reverse mode; question 2 is weak in reverse mode. Forward-mode
    // ordering should be unaffected by the reverse-mode history and vice
    // versa.
    const answers: AnswerHistoryRecord[] = [
      {
        questionId: 1,
        isCorrect: true,
        answeredAt: '2024-01-01T00:00:00Z',
        mode: 'forward',
      },
      {
        questionId: 2,
        isCorrect: false,
        answeredAt: '2024-01-01T00:00:00Z',
        mode: 'reverse',
      },
    ];
    // A random source close to 1 leaves the tie-breaking shuffle a no-op,
    // so questions tied on the sort key keep their creation order below.
    const identityRandom = () => 0.999;
    const forwardOrdered = orderQuestions(
      orderingQuestions,
      answers,
      'weakest',
      'forward',
      identityRandom,
    );
    // Question 1 has a perfect forward-mode record, question 2 has no
    // forward-mode answers at all (unattempted questions sort last).
    expect(forwardOrdered.map((q) => q.id)).toEqual([1, 2, 3]);

    const reverseOrdered = orderQuestions(
      orderingQuestions,
      answers,
      'weakest',
      'reverse',
      identityRandom,
    );
    // Question 2's reverse-mode miss should surface first; question 1 has
    // no reverse-mode answers.
    expect(reverseOrdered.map((q) => q.id)).toEqual([2, 1, 3]);
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

  it('returns null when the code field is not set', () => {
    const noCode: QuizQuestion = {
      id: 12,
      category: 'G',
      topic: 'general',
      prompt: { en: 'What is the purpose of a G code?', ru: 'В1' },
      options: [{ en: 'a', ru: 'а' }],
      correctAnswer: 0,
      explanation: { en: 'exp', ru: 'оу' },
    };
    expect(getQuestionCode(noCode)).toBeNull();
  });
});

describe('toReverseQuestion (via buildSessionQuestion in reverse mode)', () => {
  const pool: QuizQuestion[] = [
    {
      id: 20,
      category: 'G',
      topic: 'motion',
      code: 'G00',
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
      code: 'G01',
      prompt: { en: 'What does G01 command do?', ru: 'В2' },
      options: [{ en: 'Linear interpolation', ru: 'б' }],
      correctAnswer: 0,
      explanation: { en: 'exp', ru: 'оу' },
    },
    {
      id: 22,
      category: 'M',
      topic: 'spindle',
      code: 'M03',
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

  it('defaults to a 3x3 grid of 9 options when there are enough distractor codes', () => {
    const bigPool: QuizQuestion[] = Array.from({ length: 12 }, (_, index) => ({
      id: 40 + index,
      category: 'G',
      topic: 'motion',
      code: `G${index}`,
      prompt: { en: `What does G${index} do?`, ru: `Q${index}` },
      options: [{ en: `does G${index} thing`, ru: `д${index}` }],
      correctAnswer: 0,
      explanation: { en: 'exp', ru: 'оу' },
    }));
    const target = bigPool[0] as QuizQuestion;
    const reversed = buildSessionQuestion(
      target,
      bigPool,
      'reverse',
      noHistory,
    );
    expect(reversed.options).toHaveLength(9);
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

describe('buildSessionQuestion (typed mode)', () => {
  const pool: QuizQuestion[] = [
    {
      id: 20,
      category: 'G',
      topic: 'motion',
      code: 'G00',
      prompt: { en: 'What does G00 command do?', ru: 'В1' },
      options: [{ en: 'Rapid positioning move', ru: 'а' }],
      correctAnswer: 0,
      explanation: { en: 'exp', ru: 'оу' },
    },
  ];
  const noHistory = new Map<string, number>();

  it('swaps the prompt for the description and reduces options to just the code', () => {
    const target = pool[0] as QuizQuestion;
    const typed = buildSessionQuestion(target, pool, 'typed', noHistory);
    expect(typed.prompt).toEqual({ en: 'Rapid positioning move', ru: 'а' });
    expect(typed.options).toEqual([{ en: 'G00', ru: 'G00' }]);
    expect(typed.correctAnswer).toBe(0);
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
    expect(buildSessionQuestion(conceptual, pool, 'typed', noHistory)).toBe(
      conceptual,
    );
  });
});

describe('normalizeCode / isCorrectTypedAnswer', () => {
  const question: QuizQuestion = {
    id: 30,
    category: 'G',
    topic: 'tool-change',
    code: 'G54',
    prompt: { en: 'Select work coordinate system 1', ru: 'В1' },
    options: [{ en: 'Select work coordinate system 1', ru: 'В1' }],
    correctAnswer: 0,
    explanation: { en: 'exp', ru: 'оу' },
  };

  it('is case- and whitespace-insensitive', () => {
    expect(isCorrectTypedAnswer(question, 'g54')).toBe(true);
    expect(isCorrectTypedAnswer(question, '  G54  ')).toBe(true);
  });

  it('rejects a wrong or empty code', () => {
    expect(isCorrectTypedAnswer(question, 'G55')).toBe(false);
    expect(isCorrectTypedAnswer(question, '')).toBe(false);
  });

  it('normalizes by trimming and uppercasing', () => {
    expect(normalizeCode(' g54 ')).toBe('G54');
  });
});

describe('areCodesClose', () => {
  it('treats codes with the same letter and a small numeric gap as close', () => {
    expect(areCodesClose('G41', 'G40')).toBe(true);
    expect(areCodesClose('G41', 'G42')).toBe(true);
    expect(areCodesClose('G41', 'G43')).toBe(true);
  });

  it('treats codes with a large numeric gap as not close', () => {
    expect(areCodesClose('G41', 'G90')).toBe(false);
  });

  it('treats codes with different letters as not close regardless of number', () => {
    expect(areCodesClose('G41', 'M41')).toBe(false);
  });
});

describe('reverse mode weights numerically "close" codes as distractors', () => {
  const makeCodeQuestion = (id: number, code: string): QuizQuestion => ({
    id,
    category: code.startsWith('G') ? 'G' : 'M',
    topic: 'motion',
    code,
    prompt: { en: `What does ${code} do?`, ru: `Q ${code}` },
    options: [{ en: code, ru: code }],
    correctAnswer: 0,
    explanation: { en: 'exp', ru: 'оу' },
  });

  // Same fixed distractor sources for every scenario below; only the
  // target's code changes, which changes whether 'G40' counts as "close".
  const distractorSources = [
    makeCodeQuestion(101, 'M01'),
    makeCodeQuestion(102, 'M02'),
    makeCodeQuestion(103, 'G40'),
    makeCodeQuestion(104, 'M04'),
    makeCodeQuestion(105, 'M05'),
  ];

  it('picks the close code (G40) as a distractor for G41 over equally-positioned far codes', () => {
    const target = makeCodeQuestion(200, 'G41');
    const reversed = buildSessionQuestion(
      target,
      [target, ...distractorSources],
      'reverse',
      new Map(),
      2,
      () => 0.65,
    );
    expect(reversed.options.map((option) => option.en)).toContain('G40');
  });

  it('does not favor the same code (G40) once it is no longer close to the target (G90)', () => {
    const target = makeCodeQuestion(200, 'G90');
    const reversed = buildSessionQuestion(
      target,
      [target, ...distractorSources],
      'reverse',
      new Map(),
      2,
      () => 0.65,
    );
    expect(reversed.options.map((option) => option.en)).not.toContain('G40');
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
