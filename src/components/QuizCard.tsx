import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import type { QuizQuestion } from '../data/questions';
import { isCorrectTypedAnswer, type QuizMode } from '../data/quizLogic';
import {
  type Language,
  type LocalizedText,
  localize,
  type UiStrings,
} from '../i18n';
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
  typedAnswer: string;
  setTypedAnswer: (value: string) => void;
  showAnswer: boolean;
  submitAnswer: (answerIndex: number) => void;
  submitTypedAnswer: () => void;
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
  typedAnswer,
  setTypedAnswer,
  showAnswer,
  submitAnswer,
  submitTypedAnswer,
  nextQuestion,
}: Props) {
  const isTyped = quizMode === 'typed';
  const isTypedCorrect =
    isTyped && showAnswer && isCorrectTypedAnswer(question, typedAnswer);

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
        {isTyped ? (
          <Text style={styles.sectionLabel}>{t.typedQuestionHint}</Text>
        ) : null}
        <Text style={styles.prompt}>{localize(question.prompt, language)}</Text>
        {isTyped ? (
          <>
            <TextInput
              style={styles.textInput}
              value={typedAnswer}
              onChangeText={setTypedAnswer}
              placeholder={t.typedAnswerPlaceholder}
              autoCapitalize="characters"
              autoCorrect={false}
              editable={!showAnswer}
              onSubmitEditing={submitTypedAnswer}
              accessibilityLabel={t.typedQuestionHint}
            />
            {showAnswer ? (
              <Text
                style={
                  isTypedCorrect
                    ? styles.typedResultCorrect
                    : styles.typedResultIncorrect
                }
              >
                {isTypedCorrect
                  ? t.typedResultCorrect
                  : t.typedResultIncorrect(
                      localize(
                        question.options[
                          question.correctAnswer
                        ] as LocalizedText,
                        language,
                      ),
                    )}
              </Text>
            ) : (
              <TouchableOpacity
                style={styles.nextButton}
                onPress={submitTypedAnswer}
                disabled={typedAnswer.trim() === ''}
                accessibilityRole="button"
              >
                <Text style={styles.nextButtonText}>{t.submitTypedAnswer}</Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <View style={quizMode === 'reverse' ? styles.optionsGrid : null}>
            {question.options.map((option, index) => {
              const isCorrect = index === question.correctAnswer;
              const isSelected = index === selectedAnswer;

              const optionStyle = [
                styles.optionButton,
                quizMode === 'reverse' ? styles.gridOptionButton : null,
                showAnswer && isCorrect ? styles.correctOption : null,
                showAnswer && isSelected && !isCorrect
                  ? styles.wrongOption
                  : null,
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
        )}
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
