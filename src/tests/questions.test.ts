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

  it('has non-empty en and ru text for every prompt, option, and explanation', () => {
    for (const question of quizQuestions) {
      expect(question.prompt.en.length).toBeGreaterThan(0);
      expect(question.prompt.ru.length).toBeGreaterThan(0);
      expect(question.explanation.en.length).toBeGreaterThan(0);
      expect(question.explanation.ru.length).toBeGreaterThan(0);
      for (const option of question.options) {
        expect(option.en.length).toBeGreaterThan(0);
        expect(option.ru.length).toBeGreaterThan(0);
      }
    }
  });

  // Reverse mode derives its prompt from the correct option's text (see
  // buildSessionQuestion), so a forward question's options must be real
  // definitions, never raw G/M code strings, or reverse mode ends up asking
  // the user to match a code to itself.
  it('never uses a raw G/M code string as an option (reverse mode would break)', () => {
    const codePattern = /^[GM]\d+(\.\d+)?$/;
    for (const question of quizQuestions) {
      for (const option of question.options) {
        expect(option.en).not.toMatch(codePattern);
      }
    }
  });
});
