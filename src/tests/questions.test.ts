import { describe, expect, it } from 'vitest';
import { getQuestionsForQuiz, quizQuestions } from '../data/questions';

describe('quiz question selection', () => {
  it('returns the requested number of questions', () => {
    const questions = getQuestionsForQuiz(3);
    expect(questions).toHaveLength(3);
  });

  it('does not exceed the available question pool', () => {
    const questions = getQuestionsForQuiz(quizQuestions.length + 10);
    expect(questions).toHaveLength(quizQuestions.length);
  });

  it('returns the full pool by default', () => {
    const questions = getQuestionsForQuiz();
    expect(questions).toHaveLength(quizQuestions.length);
  });

  it('keeps every question answerable', () => {
    const questions = getQuestionsForQuiz();
    for (const question of questions) {
      expect(question.options.length).toBeGreaterThan(1);
      expect(question.correctAnswer).toBeGreaterThanOrEqual(0);
      expect(question.correctAnswer).toBeLessThan(question.options.length);
    }
  });

  it('has a unique id for every question', () => {
    const ids = quizQuestions.map((question) => question.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
