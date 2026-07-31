import { StatusBar } from 'expo-status-bar';
import { type ComponentProps, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { exportAnswersToFile, importAnswersFromFile } from './data/backup';
import {
  getStoredQuestions,
  initializeDatabase,
  recordAnswer,
} from './data/database';
import type { QuizQuestion } from './data/questions';

export default function App() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isBackupBusy, setIsBackupBusy] = useState(false);

  useEffect(() => {
    let isMounted = true;
    initializeDatabase()
      .then(() => getStoredQuestions())
      .then((loadedQuestions) => {
        if (isMounted) {
          setQuestions(loadedQuestions);
          setIsReady(true);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsReady(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const currentQuestion = questions[currentIndex] ?? null;
  const progress = useMemo(() => {
    if (questions.length === 0) {
      return 0;
    }
    return ((currentIndex + 1) / questions.length) * 100;
  }, [currentIndex, questions.length]);

  const submitAnswer = (answerIndex: number) => {
    if (showAnswer || !currentQuestion) {
      return;
    }
    setSelectedAnswer(answerIndex);
    setShowAnswer(true);
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore((value) => value + 1);
    }
    recordAnswer(currentQuestion.id, answerIndex, isCorrect).catch(() => {
      // Ignore persistence failures; the in-session quiz state is unaffected.
    });
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
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((value) => value + 1);
    } else {
      setCurrentIndex(0);
    }
    setSelectedAnswer(null);
    setShowAnswer(false);
  };

  return (
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

        {!isReady ? (
          <View style={styles.card}>
            <Text style={styles.cardText}>Loading quiz questions...</Text>
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
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
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
