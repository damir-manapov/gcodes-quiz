import { useMemo, useState } from 'react';
import { getStoredAnswers } from '../data/database';
import {
  type AnswerRecord,
  computeOverallStats,
  computeQuestionStats,
  computeTopicStats,
  type QuestionStat,
  type SessionQuestion,
} from '../data/quizLogic';
import { logError } from '../logger';

export function useStats(questions: SessionQuestion[]) {
  const [view, setView] = useState<'quiz' | 'stats'>('quiz');
  const [answerRecords, setAnswerRecords] = useState<AnswerRecord[] | null>(
    null,
  );
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState(false);

  const openStats = async () => {
    setView('stats');
    setIsStatsLoading(true);
    setStatsError(false);
    try {
      const storedAnswers = await getStoredAnswers();
      setAnswerRecords(
        storedAnswers.map((answer) => ({
          questionId: answer.questionId,
          isCorrect: answer.isCorrect,
        })),
      );
    } catch (error) {
      logError('Failed to load answer history for stats', error);
      setStatsError(true);
    } finally {
      setIsStatsLoading(false);
    }
  };

  const closeStats = () => {
    setView('quiz');
  };

  const questionStats = useMemo<QuestionStat[]>(
    () => (answerRecords ? computeQuestionStats(questions, answerRecords) : []),
    [questions, answerRecords],
  );
  const topicStats = useMemo(
    () => computeTopicStats(questionStats),
    [questionStats],
  );
  const overallStats = useMemo(
    () =>
      answerRecords ? computeOverallStats(questions, answerRecords) : null,
    [questions, answerRecords],
  );
  const sortedQuestionStats = useMemo(() => {
    return [...questionStats].sort((a, b) => {
      if (a.attempts === 0 && b.attempts === 0) {
        return 0;
      }
      if (a.attempts === 0) {
        return 1;
      }
      if (b.attempts === 0) {
        return -1;
      }
      return a.accuracy - b.accuracy;
    });
  }, [questionStats]);

  return {
    view,
    isStatsLoading,
    statsError,
    topicStats,
    overallStats,
    sortedQuestionStats,
    openStats,
    closeStats,
  };
}
