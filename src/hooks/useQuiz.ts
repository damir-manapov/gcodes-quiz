import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getStoredAnswers,
  initializeDatabase,
  recordAnswer,
} from '../data/database';
import { getQuestionsForQuiz, type QuizQuestion } from '../data/questions';
import {
  buildSessionQuestion,
  computeHashCounts,
  getAnswerHash,
  getNextQuestionIndex,
  getProgressPercent,
  getQuestionCode,
  hashAnswerText,
  isCorrectAnswer,
  isCorrectLineAnswer,
  isCorrectTypedAnswer,
  normalizeCode,
  orderQuestions,
  type QuestionOrder,
  type QuizMode,
  type SessionQuestion,
} from '../data/quizLogic';
import type { LocalizedText } from '../i18n';
import { logError } from '../logger';

// Reverse and typed modes both need a single identifiable code per
// question, so those modes drop the handful of purely conceptual questions
// that don't have one; line mode further needs a worked parameter example,
// so it only includes the curated subset of questions that have one.
function isEligibleForMode(question: QuizQuestion, mode: QuizMode): boolean {
  if (mode === 'line') {
    return (question.lineExamples?.length ?? 0) > 0;
  }
  if (mode === 'reverse' || mode === 'typed') {
    return getQuestionCode(question) !== null;
  }
  return true;
}

// Not a real option index (typed-mode answers aren't picked from a list),
// just a sentinel so the answers table always has an integer to store.
const TYPED_ANSWER_INDEX = -1;

// Owns the quiz session lifecycle: loading/building a session's questions
// for the current mode/order, tracking progress through it, and recording
// answers. Reloads whenever order or mode changes (not the UI language,
// which shouldn't discard in-progress quiz state).
export function useQuiz(questionOrder: QuestionOrder, quizMode: QuizMode) {
  const [questions, setQuestions] = useState<SessionQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [hasLoadError, setHasLoadError] = useState(false);

  const loadQuiz = useCallback(() => {
    let isMounted = true;
    setIsReady(false);
    setHasLoadError(false);
    initializeDatabase()
      .then(() => getStoredAnswers())
      .then((storedAnswers) => {
        if (isMounted) {
          const loadedQuestions = getQuestionsForQuiz();
          const ordered = orderQuestions(
            loadedQuestions,
            storedAnswers,
            questionOrder,
            quizMode,
          );
          const eligible = ordered.filter((question) =>
            isEligibleForMode(question, quizMode),
          );
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
          setTypedAnswer('');
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

  const submitTypedAnswer = () => {
    if (showAnswer || !currentQuestion || typedAnswer.trim() === '') {
      return;
    }
    setShowAnswer(true);
    // Shared by typed mode (a bare code) and line mode (a full code line).
    const isLineMode = quizMode === 'line';
    const isCorrect = isLineMode
      ? isCorrectLineAnswer(currentQuestion, typedAnswer)
      : isCorrectTypedAnswer(currentQuestion, typedAnswer);
    if (isCorrect) {
      setScore((value) => value + 1);
    }
    const answerHash = hashAnswerText(
      isLineMode
        ? typedAnswer.trim().toUpperCase()
        : normalizeCode(typedAnswer),
    );
    recordAnswer(
      currentQuestion.id,
      TYPED_ANSWER_INDEX,
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
    setTypedAnswer('');
    setShowAnswer(false);
  };

  return {
    questions,
    currentIndex,
    currentQuestion,
    selectedAnswer,
    typedAnswer,
    setTypedAnswer,
    score,
    showAnswer,
    isReady,
    hasLoadError,
    progress,
    loadQuiz,
    submitAnswer,
    submitTypedAnswer,
    nextQuestion,
  };
}
