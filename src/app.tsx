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
  getLanguage as getStoredLanguage,
  getStoredQuestions,
  initializeDatabase,
  setLanguage as persistLanguage,
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
  getQuestionCode,
  isCorrectAnswer,
  orderQuestions,
  QUESTION_ORDERS,
  QUIZ_MODES,
  type QuestionOrder,
  type QuestionStat,
  type QuizMode,
  shuffleQuestionOptionsForSession,
  toReverseQuestion,
} from './data/quizLogic';
import { LANGUAGES, type Language, localize, uiStrings } from './i18n';

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
  const [language, setLanguageState] = useState<Language>('en');
  const [questionOrder, setQuestionOrder] = useState<QuestionOrder>('random');
  const [quizMode, setQuizMode] = useState<QuizMode>('forward');
  const t = uiStrings[language];

  useEffect(() => {
    let isMounted = true;
    getStoredLanguage()
      .then((storedLanguage) => {
        if (isMounted) {
          setLanguageState(storedLanguage);
        }
      })
      .catch(() => {
        // Keep the default language if it can't be loaded.
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const changeLanguage = (next: Language) => {
    setLanguageState(next);
    persistLanguage(next).catch(() => {
      // Ignore persistence failures; the in-session language still updates.
    });
  };

  const orderLabels: Record<QuestionOrder, string> = {
    random: t.orderRandom,
    weakest: t.orderWeakest,
    stale: t.orderStale,
    'least-answered': t.orderLeastAnswered,
  };

  const modeLabels: Record<QuizMode, string> = {
    forward: t.modeForward,
    reverse: t.modeReverse,
  };

  const changeQuizMode = (mode: QuizMode) => {
    setQuizMode(mode);
  };

  const loadQuiz = useCallback(() => {
    let isMounted = true;
    setIsReady(false);
    setLoadError(null);
    initializeDatabase()
      .then(() => Promise.all([getStoredQuestions(), getStoredAnswers()]))
      .then(([loadedQuestions, storedAnswers]) => {
        if (isMounted) {
          const ordered = orderQuestions(
            loadedQuestions,
            storedAnswers,
            questionOrder,
          );
          // Reverse mode needs a single identifiable code per question, so
          // drop the handful of purely conceptual questions that don't have one.
          const eligible =
            quizMode === 'reverse'
              ? ordered.filter((question) => getQuestionCode(question) !== null)
              : ordered;
          setQuestions(shuffleQuestionOptionsForSession(eligible));
          setCurrentIndex(0);
          setSelectedAnswer(null);
          setScore(0);
          setShowAnswer(false);
          setIsReady(true);
        }
      })
      .catch(() => {
        if (isMounted) {
          setLoadError(uiStrings[language].loadErrorMessage);
          setIsReady(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [language, questionOrder, quizMode]);

  useEffect(() => loadQuiz(), [loadQuiz]);

  const currentQuestion = questions[currentIndex] ?? null;
  const displayQuestion = useMemo(
    () =>
      currentQuestion && quizMode === 'reverse'
        ? toReverseQuestion(currentQuestion, questions)
        : currentQuestion,
    [currentQuestion, quizMode, questions],
  );
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
    if (showAnswer || !displayQuestion) {
      return;
    }
    setSelectedAnswer(answerIndex);
    setShowAnswer(true);
    const isCorrect = isCorrectAnswer(displayQuestion, answerIndex);
    if (isCorrect) {
      setScore((value) => value + 1);
    }
    recordAnswer(displayQuestion.id, answerIndex, isCorrect).catch(() => {
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
      setStatsError(t.statsLoadErrorMessage);
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
      Alert.alert(t.backupReadyTitle, t.backupReadyMessage);
    } catch (error) {
      console.error('Backup failed', error);
      Alert.alert(t.backupFailedTitle, t.backupFailedMessage);
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
        Alert.alert(t.restoreCompleteTitle, t.restoreCompleteMessage);
      } else if (result === 'invalid') {
        Alert.alert(t.restoreInvalidTitle, t.restoreInvalidMessage);
      }
    } catch (error) {
      console.error('Restore failed', error);
      Alert.alert(t.restoreFailedTitle, t.restoreFailedMessage);
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
          <Text style={styles.title}>{t.appTitle}</Text>
          <Text style={styles.subtitle}>{t.appSubtitle}</Text>

          <Text style={styles.sectionLabel}>{t.languageLabel}</Text>
          <View style={styles.backupRow}>
            {LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[
                  styles.backupButton,
                  lang === language ? styles.selectedOption : null,
                ]}
                onPress={() => changeLanguage(lang)}
              >
                <Text style={styles.backupButtonText}>
                  {lang.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionLabel}>{t.modeLabel}</Text>
          <View style={styles.actionRow}>
            {QUIZ_MODES.map((mode) => (
              <TouchableOpacity
                key={mode}
                style={[
                  styles.actionButton,
                  mode === quizMode ? styles.selectedOption : null,
                ]}
                onPress={() => changeQuizMode(mode)}
              >
                <Text style={styles.actionButtonText}>{modeLabels[mode]}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionLabel}>{t.orderLabel}</Text>
          <View style={styles.actionRow}>
            {QUESTION_ORDERS.map((order) => (
              <TouchableOpacity
                key={order}
                style={[
                  styles.actionButton,
                  order === questionOrder ? styles.selectedOption : null,
                ]}
                onPress={() => setQuestionOrder(order)}
              >
                <Text style={styles.actionButtonText}>
                  {orderLabels[order]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={view === 'quiz' ? openStats : closeStats}
              disabled={!isReady}
            >
              <Text style={styles.actionButtonText}>
                {view === 'quiz' ? t.viewStats : t.backToQuiz}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleBackup}
              disabled={isBackupBusy}
            >
              <Text style={styles.actionButtonText}>{t.backupAnswers}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleRestore}
              disabled={isBackupBusy}
            >
              <Text style={styles.actionButtonText}>{t.restoreAnswers}</Text>
            </TouchableOpacity>
          </View>

          {view === 'stats' ? (
            isStatsLoading ? (
              <View style={styles.card}>
                <Text style={styles.cardText}>{t.loadingHistory}</Text>
              </View>
            ) : statsError ? (
              <View style={styles.card}>
                <Text style={styles.cardText}>{statsError}</Text>
              </View>
            ) : overallStats ? (
              <>
                <View style={styles.card}>
                  <Text style={styles.prompt}>{t.overallHeading}</Text>
                  <Text style={styles.cardText}>
                    {t.overallSummary(
                      overallStats.totalCorrect,
                      overallStats.totalAttempts,
                      overallStats.accuracy,
                      overallStats.questionsAttempted,
                      overallStats.questionsTotal,
                    )}
                  </Text>
                </View>

                <View style={styles.card}>
                  <Text style={styles.prompt}>{t.byTopicHeading}</Text>
                  {topicStats.length === 0 ? (
                    <Text style={styles.cardText}>{t.noAnswersRecorded}</Text>
                  ) : (
                    topicStats.map((stat) => (
                      <View key={stat.topic} style={styles.statRow}>
                        <Text style={styles.statLabel}>{stat.topic}</Text>
                        <Text style={styles.statValue}>
                          {t.statAccuracy(
                            stat.correct,
                            stat.attempts,
                            stat.accuracy,
                          )}
                        </Text>
                      </View>
                    ))
                  )}
                </View>

                <View style={styles.card}>
                  <Text style={styles.prompt}>{t.weakestQuestionsHeading}</Text>
                  {sortedQuestionStats.some((stat) => stat.attempts > 0) ? (
                    sortedQuestionStats
                      .filter((stat) => stat.attempts > 0)
                      .slice(0, 10)
                      .map((stat) => (
                        <View key={stat.questionId} style={styles.statRow}>
                          <Text style={styles.statLabel} numberOfLines={2}>
                            {localize(stat.prompt, language)}
                          </Text>
                          <Text style={styles.statValue}>
                            {t.statAccuracy(
                              stat.correct,
                              stat.attempts,
                              stat.accuracy,
                            )}
                          </Text>
                        </View>
                      ))
                  ) : (
                    <Text style={styles.cardText}>{t.answerSomeQuestions}</Text>
                  )}
                </View>
              </>
            ) : null
          ) : !isReady ? (
            <View style={styles.card}>
              <Text style={styles.cardText}>{t.loadingQuestions}</Text>
            </View>
          ) : loadError ? (
            <View style={styles.card}>
              <Text style={styles.cardText}>{loadError}</Text>
              <TouchableOpacity style={styles.nextButton} onPress={loadQuiz}>
                <Text style={styles.nextButtonText}>{t.retry}</Text>
              </TouchableOpacity>
            </View>
          ) : questions.length === 0 ? (
            <View style={styles.card}>
              <Text style={styles.cardText}>{t.noQuestionsAvailable}</Text>
            </View>
          ) : currentQuestion ? (
            (() => {
              const question = displayQuestion ?? currentQuestion;
              return (
                <>
                  <View style={styles.headerRow}>
                    <Text style={styles.meta}>
                      {t.questionProgress(currentIndex + 1, questions.length)}
                    </Text>
                    <Text style={styles.meta}>{t.score(score)}</Text>
                  </View>
                  <View style={styles.progressTrack}>
                    <View
                      style={[styles.progressFill, { width: `${progress}%` }]}
                    />
                  </View>

                  <View style={styles.card}>
                    {quizMode === 'reverse' ? (
                      <Text style={styles.sectionLabel}>
                        {t.reverseQuestionHint}
                      </Text>
                    ) : null}
                    <Text style={styles.prompt}>
                      {localize(question.prompt, language)}
                    </Text>
                    {question.options.map((option, index) => {
                      const isCorrect = index === question.correctAnswer;
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
                          key={option.en}
                          style={mergedStyle}
                          onPress={() => submitAnswer(index)}
                          disabled={showAnswer}
                        >
                          <Text style={styles.optionText}>
                            {localize(option, language)}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {showAnswer ? (
                    <View style={styles.feedbackCard}>
                      <Text style={styles.feedbackTitle}>
                        {t.explanationHeading}
                      </Text>
                      <Text style={styles.feedbackText}>
                        {localize(currentQuestion.explanation, language)}
                      </Text>
                      <TouchableOpacity
                        style={styles.nextButton}
                        onPress={nextQuestion}
                      >
                        <Text style={styles.nextButtonText}>
                          {t.nextQuestion}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : null}
                </>
              );
            })()
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
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
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
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  actionButton: {
    flexGrow: 1,
    minWidth: '30%',
    borderWidth: 1,
    borderColor: '#2563eb',
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#2563eb',
    fontWeight: '600',
    fontSize: 13,
    textAlign: 'center',
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
