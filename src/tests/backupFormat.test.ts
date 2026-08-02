import { describe, expect, it } from 'vitest';
import {
  deserializeBackup,
  getBackupFileName,
  isAnswersBackup,
  serializeBackup,
} from '../data/backupFormat';

describe('backup format', () => {
  it('generates a stable, filesystem-safe file name from a date', () => {
    const date = new Date('2024-05-06T07:08:09.123Z');
    expect(getBackupFileName(date)).toBe(
      'gcodes-quiz-backup-2024-05-06T07-08-09-123Z.json',
    );
  });

  it('round-trips a backup through serialize/deserialize', () => {
    const backup = {
      exportedAt: '2024-05-06T07:08:09.123Z',
      answers: [
        {
          questionId: 1,
          selectedAnswer: 0,
          isCorrect: true,
          answeredAt: '2024-05-06T07:00:00.000Z',
          answerHash: 'abc123',
          mode: 'forward' as const,
        },
      ],
    };

    const content = serializeBackup(backup);
    expect(deserializeBackup(content)).toEqual(backup);
  });

  it('rejects invalid JSON', () => {
    expect(deserializeBackup('not json')).toBeNull();
  });

  it('rejects well-formed JSON that does not match the backup shape', () => {
    expect(deserializeBackup(JSON.stringify({ foo: 'bar' }))).toBeNull();
  });

  it('validates backup objects with isAnswersBackup', () => {
    expect(
      isAnswersBackup({
        exportedAt: '2024-05-06T07:08:09.123Z',
        answers: [],
      }),
    ).toBe(true);

    expect(isAnswersBackup(null)).toBe(false);
    expect(isAnswersBackup({ exportedAt: 1, answers: [] })).toBe(false);
    expect(
      isAnswersBackup({
        exportedAt: '2024-05-06T07:08:09.123Z',
        answers: [
          {
            questionId: '1',
            selectedAnswer: 0,
            isCorrect: true,
            answeredAt: 'x',
            answerHash: 'abc',
          },
        ],
      }),
    ).toBe(false);
  });

  it('accepts answers without a mode field for backward compatibility with old backups', () => {
    expect(
      isAnswersBackup({
        exportedAt: '2024-05-06T07:08:09.123Z',
        answers: [
          {
            questionId: 1,
            selectedAnswer: 0,
            isCorrect: true,
            answeredAt: '2024-05-06T07:00:00.000Z',
            answerHash: 'abc',
          },
        ],
      }),
    ).toBe(true);
  });

  it('rejects an invalid mode value', () => {
    expect(
      isAnswersBackup({
        exportedAt: '2024-05-06T07:08:09.123Z',
        answers: [
          {
            questionId: 1,
            selectedAnswer: 0,
            isCorrect: true,
            answeredAt: '2024-05-06T07:00:00.000Z',
            answerHash: 'abc',
            mode: 'sideways',
          },
        ],
      }),
    ).toBe(false);
  });
});
