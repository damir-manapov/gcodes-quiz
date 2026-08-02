export type AnswersBackup = {
  exportedAt: string;
  answers: Array<{
    questionId: number;
    selectedAnswer: number;
    isCorrect: boolean;
    answeredAt: string;
    answerHash: string;
    // Absent on backups created before mode was tracked.
    mode?: 'forward' | 'reverse';
  }>;
};

export function getBackupFileName(date = new Date()): string {
  const stamp = date.toISOString().replace(/[:.]/g, '-');
  return `gcodes-quiz-backup-${stamp}.json`;
}

export function serializeBackup(backup: AnswersBackup): string {
  return JSON.stringify(backup, null, 2);
}

export function isAnswersBackup(value: unknown): value is AnswersBackup {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  if (
    typeof candidate.exportedAt !== 'string' ||
    !Array.isArray(candidate.answers)
  ) {
    return false;
  }
  return candidate.answers.every((entry) => {
    if (typeof entry !== 'object' || entry === null) {
      return false;
    }
    const answer = entry as Record<string, unknown>;
    return (
      typeof answer.questionId === 'number' &&
      typeof answer.selectedAnswer === 'number' &&
      typeof answer.isCorrect === 'boolean' &&
      typeof answer.answeredAt === 'string' &&
      typeof answer.answerHash === 'string' &&
      (answer.mode === undefined ||
        answer.mode === 'forward' ||
        answer.mode === 'reverse')
    );
  });
}

export function deserializeBackup(content: string): AnswersBackup | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    return null;
  }
  return isAnswersBackup(parsed) ? parsed : null;
}
