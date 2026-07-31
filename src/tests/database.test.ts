import { describe, expect, it } from 'vitest';
import { getQuestionsForQuiz } from '../data/questions';

describe('database seed expectations', () => {
  it('seeds the question list with at least one question', () => {
    const questions = getQuestionsForQuiz();
    expect(questions.length).toBeGreaterThan(0);
  });
});
