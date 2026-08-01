import { describe, expect, it } from 'vitest';
import {
  mapAnswerRow,
  mapQuestionRow,
  toBackupAnswer,
} from '../data/databaseMappers';

describe('mapQuestionRow', () => {
  it('parses JSON columns and omits code when absent', () => {
    const question = mapQuestionRow({
      id: 1,
      prompt: JSON.stringify({ en: 'What does G00 do?', ru: 'Q' }),
      options: JSON.stringify([{ en: 'a', ru: 'а' }]),
      correctAnswer: 0,
      explanation: JSON.stringify({ en: 'exp', ru: 'оу' }),
      category: 'G',
      topic: 'motion',
      code: null,
    });
    expect(question).toEqual({
      id: 1,
      prompt: { en: 'What does G00 do?', ru: 'Q' },
      options: [{ en: 'a', ru: 'а' }],
      correctAnswer: 0,
      explanation: { en: 'exp', ru: 'оу' },
      category: 'G',
      topic: 'motion',
    });
    expect(question).not.toHaveProperty('code');
  });

  it('includes code when present', () => {
    const question = mapQuestionRow({
      id: 2,
      prompt: JSON.stringify({ en: 'p', ru: 'р' }),
      options: JSON.stringify([{ en: 'a', ru: 'а' }]),
      correctAnswer: 0,
      explanation: JSON.stringify({ en: 'exp', ru: 'оу' }),
      category: 'M',
      topic: 'spindle',
      code: 'M05',
    });
    expect(question.code).toBe('M05');
  });
});

describe('mapAnswerRow', () => {
  it('converts the isCorrect integer column to a boolean', () => {
    expect(
      mapAnswerRow({
        id: 1,
        questionId: 2,
        selectedAnswer: 0,
        isCorrect: 1,
        answeredAt: '2024-01-01T00:00:00Z',
        answerHash: 'abc',
      }),
    ).toEqual({
      id: 1,
      questionId: 2,
      selectedAnswer: 0,
      isCorrect: true,
      answeredAt: '2024-01-01T00:00:00Z',
      answerHash: 'abc',
    });

    expect(
      mapAnswerRow({
        id: 1,
        questionId: 2,
        selectedAnswer: 0,
        isCorrect: 0,
        answeredAt: '2024-01-01T00:00:00Z',
        answerHash: 'abc',
      }).isCorrect,
    ).toBe(false);
  });
});

describe('toBackupAnswer', () => {
  it('drops the internal id field', () => {
    const backupAnswer = toBackupAnswer({
      id: 99,
      questionId: 2,
      selectedAnswer: 0,
      isCorrect: true,
      answeredAt: '2024-01-01T00:00:00Z',
      answerHash: 'abc',
    });
    expect(backupAnswer).toEqual({
      questionId: 2,
      selectedAnswer: 0,
      isCorrect: true,
      answeredAt: '2024-01-01T00:00:00Z',
      answerHash: 'abc',
    });
    expect(backupAnswer).not.toHaveProperty('id');
  });
});
