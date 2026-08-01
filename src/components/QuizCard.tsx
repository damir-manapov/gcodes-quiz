import { Text, TouchableOpacity, View } from 'react-native';
import type { QuizQuestion } from '../data/questions';
import type { QuizMode } from '../data/quizLogic';
import { type Language, localize, type UiStrings } from '../i18n';
import { styles } from '../styles';

type Props = {
  t: UiStrings;
  language: Language;
  quizMode: QuizMode;
  question: QuizQuestion;
  currentIndex: number;
  totalQuestions: number;
  score: number;
  progress: number;
  selectedAnswer: number | null;
  showAnswer: boolean;
  submitAnswer: (answerIndex: number) => void;
  nextQuestion: () => void;
};

export function QuizCard({
  t,
  language,
  quizMode,
  question,
  currentIndex,
  totalQuestions,
  score,
  progress,
  selectedAnswer,
  showAnswer,
  submitAnswer,
  nextQuestion,
}: Props) {
  return (
    <>
      <View style={styles.headerRow}>
        <Text style={styles.meta}>
          {t.questionProgress(currentIndex + 1, totalQuestions)}
        </Text>
        <Text style={styles.meta}>{t.score(score)}</Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      <View style={styles.card}>
        {quizMode === 'reverse' ? (
          <Text style={styles.sectionLabel}>{t.reverseQuestionHint}</Text>
        ) : null}
        <Text style={styles.prompt}>{localize(question.prompt, language)}</Text>
        {question.options.map((option, index) => {
          const isCorrect = index === question.correctAnswer;
          const isSelected = index === selectedAnswer;

          const optionStyle = [
            styles.optionButton,
            showAnswer && isCorrect ? styles.correctOption : null,
            showAnswer && isSelected && !isCorrect ? styles.wrongOption : null,
            !showAnswer && isSelected ? styles.selectedOption : null,
          ];

          return (
            <TouchableOpacity
              key={option.en}
              style={optionStyle}
              onPress={() => submitAnswer(index)}
              disabled={showAnswer}
              accessibilityRole="button"
              accessibilityState={{
                selected: isSelected,
                disabled: showAnswer,
              }}
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
          <Text style={styles.feedbackTitle}>{t.explanationHeading}</Text>
          <Text style={styles.feedbackText}>
            {localize(question.explanation, language)}
          </Text>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={nextQuestion}
            accessibilityRole="button"
          >
            <Text style={styles.nextButtonText}>{t.nextQuestion}</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </>
  );
}
