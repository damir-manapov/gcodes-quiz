import { describe, expect, it } from 'vitest';
import { getQuestionsForQuiz } from '../data/questions';

describe('quiz question selection', () => {
  it('returns the requested number of questions', () => {
    const questions = getQuestionsForQuiz(3);
    expect(questions).toHaveLength(3);
  });

  it('does not exceed the available question pool', () => {
    const questions = getQuestionsForQuiz(30);
    expect(questions).toHaveLength(8);
  });

  it('keeps every question answerable', () => {
    const questions = getQuestionsForQuiz(8);
    for (const question of questions) {
      expect(question.options.length).toBeGreaterThan(1);
      expect(question.correctAnswer).toBeGreaterThanOrEqual(0);
      expect(question.correctAnswer).toBeLessThan(question.options.length);
    }
  });
});
