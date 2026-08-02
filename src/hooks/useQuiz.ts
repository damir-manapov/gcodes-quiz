import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getStoredAnswers,
  getStoredQuestions,
  initializeDatabase,
  recordAnswer,
} from '../data/database';
import type { QuizQuestion } from '../data/questions';
import {
  buildSessionQuestion,
  computeHashCounts,
  getAnswerHash,
  getNextQuestionIndex,
  getProgressPercent,
  getQuestionCode,
  isCorrectAnswer,
  orderQuestions,
  type QuestionOrder,
  type QuizMode,
} from '../data/quizLogic';
import type { LocalizedText } from '../i18n';
import { logError } from '../logger';

// Owns the quiz session lifecycle: loading/building a session's questions
// for the current mode/order, tracking progress through it, and recording
// answers. Reloads whenever order or mode changes (not the UI language,
// which shouldn't discard in-progress quiz state).
export function useQuiz(questionOrder: QuestionOrder, quizMode: QuizMode) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [hasLoadError, setHasLoadError] = useState(false);

  const loadQuiz = useCallback(() => {
    let isMounted = true;
    setIsReady(false);
    setHasLoadError(false);
    initializeDatabase()
      .then(() => Promise.all([getStoredQuestions(), getStoredAnswers()]))
      .then(([loadedQuestions, storedAnswers]) => {
        if (isMounted) {
          const ordered = orderQuestions(
            loadedQuestions,
            storedAnswers,
            questionOrder,
            quizMode,
          );
          // Reverse mode needs a single identifiable code per question, so
          // drop the handful of purely conceptual questions that don't have one.
          const eligible =
            quizMode === 'reverse'
              ? ordered.filter((question) => getQuestionCode(question) !== null)
              : ordered;
          // Weight each question's distractors by how often the user has
          // picked that specific wrong answer before, so frequent mistakes
          // are more likely to be offered again.
          const hashCounts = computeHashCounts(storedAnswers);
          setQuestions(
            eligible.map((question) =>
              buildSessionQuestion(
                question,
                loadedQuestions,
                quizMode,
                hashCounts,
              ),
            ),
          );
          setCurrentIndex(0);
          setSelectedAnswer(null);
          setScore(0);
          setShowAnswer(false);
          setIsReady(true);
        }
      })
      .catch((error) => {
        logError('Failed to load quiz session', error);
        if (isMounted) {
          setHasLoadError(true);
          setIsReady(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [questionOrder, quizMode]);

  useEffect(() => loadQuiz(), [loadQuiz]);

  const currentQuestion = questions[currentIndex] ?? null;
  const progress = useMemo(
    () => getProgressPercent(currentIndex, questions.length),
    [currentIndex, questions.length],
  );

  const submitAnswer = (answerIndex: number) => {
    if (showAnswer || !currentQuestion) {
      return;
    }
    setSelectedAnswer(answerIndex);
    setShowAnswer(true);
    const isCorrect = isCorrectAnswer(currentQuestion, answerIndex);
    if (isCorrect) {
      setScore((value) => value + 1);
    }
    const answerHash = getAnswerHash(
      currentQuestion.options[answerIndex] as LocalizedText,
    );
    recordAnswer(
      currentQuestion.id,
      answerIndex,
      isCorrect,
      answerHash,
      quizMode,
    ).catch((error) => {
      logError('Failed to persist answer', error);
    });
  };

  const nextQuestion = () => {
    if (!currentQuestion) {
      return;
    }
    setCurrentIndex(getNextQuestionIndex(currentIndex, questions.length));
    setSelectedAnswer(null);
    setShowAnswer(false);
  };

  return {
    questions,
    currentIndex,
    currentQuestion,
    selectedAnswer,
    score,
    showAnswer,
    isReady,
    hasLoadError,
    progress,
    loadQuiz,
    submitAnswer,
    nextQuestion,
  };
}
