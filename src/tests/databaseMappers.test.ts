import { describe, expect, it } from 'vitest';
import { mapAnswerRow, toBackupAnswer } from '../data/databaseMappers';

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
        mode: 'forward',
      }),
    ).toEqual({
      id: 1,
      questionId: 2,
      selectedAnswer: 0,
      isCorrect: true,
      answeredAt: '2024-01-01T00:00:00Z',
      answerHash: 'abc',
      mode: 'forward',
    });

    expect(
      mapAnswerRow({
        id: 1,
        questionId: 2,
        selectedAnswer: 0,
        isCorrect: 0,
        answeredAt: '2024-01-01T00:00:00Z',
        answerHash: 'abc',
        mode: null,
      }).isCorrect,
    ).toBe(false);
  });

  it('preserves a null mode for answers recorded before mode was tracked', () => {
    expect(
      mapAnswerRow({
        id: 1,
        questionId: 2,
        selectedAnswer: 0,
        isCorrect: 1,
        answeredAt: '2024-01-01T00:00:00Z',
        answerHash: 'abc',
        mode: null,
      }).mode,
    ).toBeNull();
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
      mode: 'reverse',
    });
    expect(backupAnswer).toEqual({
      questionId: 2,
      selectedAnswer: 0,
      isCorrect: true,
      answeredAt: '2024-01-01T00:00:00Z',
      answerHash: 'abc',
      mode: 'reverse',
    });
    expect(backupAnswer).not.toHaveProperty('id');
  });

  it('omits mode when the stored answer has none', () => {
    const backupAnswer = toBackupAnswer({
      id: 99,
      questionId: 2,
      selectedAnswer: 0,
      isCorrect: true,
      answeredAt: '2024-01-01T00:00:00Z',
      answerHash: 'abc',
      mode: null,
    });
    expect(backupAnswer).not.toHaveProperty('mode');
  });
});
