import { StatusBar } from 'expo-status-bar';
import {
  type ComponentProps,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { exportAnswersToFile, importAnswersFromFile } from './data/backup';
import {
  getStoredAnswers,
  getStoredQuestions,
  initializeDatabase,
  recordAnswer,
} from './data/database';
import type { QuizQuestion } from './data/questions';
import {
  type AnswerRecord,
  computeOverallStats,
  computeQuestionStats,
  computeTopicStats,
  getNextQuestionIndex,
  getProgressPercent,
  isCorrectAnswer,
  type QuestionStat,
  shuffleQuizSession,
} from './data/quizLogic';

export default function App() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isBackupBusy, setIsBackupBusy] = useState(false);
  const [view, setView] = useState<'quiz' | 'stats'>('quiz');
  const [answerRecords, setAnswerRecords] = useState<AnswerRecord[] | null>(
    null,
  );
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);

  const loadQuiz = useCallback(() => {
    let isMounted = true;
    setIsReady(false);
    setLoadError(null);
    initializeDatabase()
      .then(() => getStoredQuestions())
      .then((loadedQuestions) => {
        if (isMounted) {
          setQuestions(shuffleQuizSession(loadedQuestions));
          setCurrentIndex(0);
          setSelectedAnswer(null);
          setScore(0);
          setShowAnswer(false);
          setIsReady(true);
        }
      })
      .catch(() => {
        if (isMounted) {
          setLoadError('Could not load quiz questions. Please try again.');
          setIsReady(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => loadQuiz(), [loadQuiz]);

  const currentQuestion = questions[currentIndex] ?? null;
  const progress = useMemo(
    () => getProgressPercent(currentIndex, questions.length),
    [currentIndex, questions.length],
  );

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
    recordAnswer(currentQuestion.id, answerIndex, isCorrect).catch(() => {
      // Ignore persistence failures; the in-session quiz state is unaffected.
    });
  };

  const openStats = async () => {
    setView('stats');
    setIsStatsLoading(true);
    setStatsError(null);
    try {
      const storedAnswers = await getStoredAnswers();
      setAnswerRecords(
        storedAnswers.map((answer) => ({
          questionId: answer.questionId,
          isCorrect: answer.isCorrect,
        })),
      );
    } catch {
      setStatsError('Could not load your answer history.');
    } finally {
      setIsStatsLoading(false);
    }
  };

  const closeStats = () => {
    setView('quiz');
  };

  const handleBackup = async () => {
    if (isBackupBusy) {
      return;
    }
    setIsBackupBusy(true);
    try {
      await exportAnswersToFile();
      Alert.alert('Backup ready', 'Your answers were exported successfully.');
    } catch {
      Alert.alert(
        'Backup failed',
        'Could not export your answers. Please try again.',
      );
    } finally {
      setIsBackupBusy(false);
    }
  };

  const handleRestore = async () => {
    if (isBackupBusy) {
      return;
    }
    setIsBackupBusy(true);
    try {
      const result = await importAnswersFromFile();
      if (result === 'imported') {
        Alert.alert(
          'Restore complete',
          'Your answers were imported successfully.',
        );
      } else if (result === 'invalid') {
        Alert.alert(
          'Restore failed',
          'That file is not a valid answers backup.',
        );
      }
    } catch {
      Alert.alert(
        'Restore failed',
        'Could not import your answers. Please try again.',
      );
    } finally {
      setIsBackupBusy(false);
    }
  };

  const nextQuestion = () => {
    if (!currentQuestion) {
      return;
    }
    setCurrentIndex(getNextQuestionIndex(currentIndex, questions.length));
    setSelectedAnswer(null);
    setShowAnswer(false);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>G-Code Quiz</Text>
          <Text style={styles.subtitle}>
            Practice CNC programming fundamentals with local quiz questions.
          </Text>

          <View style={styles.backupRow}>
            <TouchableOpacity
              style={styles.backupButton}
              onPress={view === 'quiz' ? openStats : closeStats}
              disabled={!isReady}
            >
              <Text style={styles.backupButtonText}>
                {view === 'quiz' ? 'View stats' : 'Back to quiz'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.backupButton}
              onPress={handleBackup}
              disabled={isBackupBusy}
            >
              <Text style={styles.backupButtonText}>Backup answers</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.backupButton}
              onPress={handleRestore}
              disabled={isBackupBusy}
            >
              <Text style={styles.backupButtonText}>Restore answers</Text>
            </TouchableOpacity>
          </View>

          {view === 'stats' ? (
            isStatsLoading ? (
              <View style={styles.card}>
                <Text style={styles.cardText}>
                  Loading your answer history...
                </Text>
              </View>
            ) : statsError ? (
              <View style={styles.card}>
                <Text style={styles.cardText}>{statsError}</Text>
              </View>
            ) : overallStats ? (
              <>
                <View style={styles.card}>
                  <Text style={styles.prompt}>Overall</Text>
                  <Text style={styles.cardText}>
                    {overallStats.totalCorrect}/{overallStats.totalAttempts}{' '}
                    correct ({overallStats.accuracy}%) &middot;{' '}
                    {overallStats.questionsAttempted}/
                    {overallStats.questionsTotal} questions attempted
                  </Text>
                </View>

                <View style={styles.card}>
                  <Text style={styles.prompt}>By topic</Text>
                  {topicStats.length === 0 ? (
                    <Text style={styles.cardText}>
                      No answers recorded yet.
                    </Text>
                  ) : (
                    topicStats.map((stat) => (
                      <View key={stat.topic} style={styles.statRow}>
                        <Text style={styles.statLabel}>{stat.topic}</Text>
                        <Text style={styles.statValue}>
                          {stat.correct}/{stat.attempts} ({stat.accuracy}%)
                        </Text>
                      </View>
                    ))
                  )}
                </View>

                <View style={styles.card}>
                  <Text style={styles.prompt}>Weakest questions</Text>
                  {sortedQuestionStats.some((stat) => stat.attempts > 0) ? (
                    sortedQuestionStats
                      .filter((stat) => stat.attempts > 0)
                      .slice(0, 10)
                      .map((stat) => (
                        <View key={stat.questionId} style={styles.statRow}>
                          <Text style={styles.statLabel} numberOfLines={2}>
                            {stat.prompt}
                          </Text>
                          <Text style={styles.statValue}>
                            {stat.correct}/{stat.attempts} ({stat.accuracy}%)
                          </Text>
                        </View>
                      ))
                  ) : (
                    <Text style={styles.cardText}>
                      Answer some questions to see your weakest topics here.
                    </Text>
                  )}
                </View>
              </>
            ) : null
          ) : !isReady ? (
            <View style={styles.card}>
              <Text style={styles.cardText}>Loading quiz questions...</Text>
            </View>
          ) : loadError ? (
            <View style={styles.card}>
              <Text style={styles.cardText}>{loadError}</Text>
              <TouchableOpacity style={styles.nextButton} onPress={loadQuiz}>
                <Text style={styles.nextButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : questions.length === 0 ? (
            <View style={styles.card}>
              <Text style={styles.cardText}>No questions available.</Text>
            </View>
          ) : currentQuestion ? (
            <>
              <View style={styles.headerRow}>
                <Text style={styles.meta}>
                  Question {currentIndex + 1} of {questions.length}
                </Text>
                <Text style={styles.meta}>Score {score}</Text>
              </View>
              <View style={styles.progressTrack}>
                <View
                  style={[styles.progressFill, { width: `${progress}%` }]}
                />
              </View>

              <View style={styles.card}>
                <Text style={styles.prompt}>{currentQuestion.prompt}</Text>
                {currentQuestion.options.map((option, index) => {
                  const isCorrect = index === currentQuestion.correctAnswer;
                  const isSelected = index === selectedAnswer;
                  const buttonStyle = [styles.optionButton] as const;
                  const conditionalStyle = [] as Array<
                    ComponentProps<typeof View>['style']
                  >;
                  if (showAnswer && isCorrect) {
                    conditionalStyle.push(styles.correctOption);
                  }
                  if (showAnswer && isSelected && !isCorrect) {
                    conditionalStyle.push(styles.wrongOption);
                  }
                  if (!showAnswer && isSelected) {
                    conditionalStyle.push(styles.selectedOption);
                  }

                  const mergedStyle = [buttonStyle[0], ...conditionalStyle];

                  return (
                    <TouchableOpacity
                      key={option}
                      style={mergedStyle}
                      onPress={() => submitAnswer(index)}
                      disabled={showAnswer}
                    >
                      <Text style={styles.optionText}>{option}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {showAnswer ? (
                <View style={styles.feedbackCard}>
                  <Text style={styles.feedbackTitle}>Explanation</Text>
                  <Text style={styles.feedbackText}>
                    {currentQuestion.explanation}
                  </Text>
                  <TouchableOpacity
                    style={styles.nextButton}
                    onPress={nextQuestion}
                  >
                    <Text style={styles.nextButtonText}>Next question</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f7ff',
  },
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#172554',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#475569',
    marginBottom: 20,
  },
  backupRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  backupButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#2563eb',
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
  },
  backupButtonText: {
    color: '#2563eb',
    fontWeight: '600',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statLabel: {
    flex: 1,
    fontSize: 14,
    color: '#334155',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  meta: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#cbd5e1',
    borderRadius: 999,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563eb',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  cardText: {
    fontSize: 16,
    color: '#334155',
  },
  prompt: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#f8fafc',
  },
  selectedOption: {
    borderColor: '#2563eb',
    backgroundColor: '#dbeafe',
  },
  correctOption: {
    borderColor: '#16a34a',
    backgroundColor: '#dcfce7',
  },
  wrongOption: {
    borderColor: '#dc2626',
    backgroundColor: '#fee2e2',
  },
  optionText: {
    color: '#0f172a',
    fontSize: 16,
  },
  feedbackCard: {
    marginTop: 16,
    backgroundColor: '#eff6ff',
    borderRadius: 16,
    padding: 16,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1d4ed8',
    marginBottom: 8,
  },
  feedbackText: {
    color: '#1e3a8a',
    marginBottom: 12,
    lineHeight: 20,
  },
  nextButton: {
    backgroundColor: '#2563eb',
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
