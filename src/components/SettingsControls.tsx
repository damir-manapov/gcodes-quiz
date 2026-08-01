import { Text, TouchableOpacity, View } from 'react-native';
import {
  QUESTION_ORDERS,
  QUIZ_MODES,
  type QuestionOrder,
  type QuizMode,
} from '../data/quizLogic';
import { LANGUAGES, type Language, type UiStrings } from '../i18n';
import { styles } from '../styles';

type Props = {
  t: UiStrings;
  language: Language;
  changeLanguage: (next: Language) => void;
  quizMode: QuizMode;
  changeQuizMode: (mode: QuizMode) => void;
  questionOrder: QuestionOrder;
  setQuestionOrder: (order: QuestionOrder) => void;
  view: 'quiz' | 'stats';
  openStats: () => void;
  closeStats: () => void;
  isReady: boolean;
  handleBackup: () => void;
  handleRestore: () => void;
  isBackupBusy: boolean;
};

export function SettingsControls({
  t,
  language,
  changeLanguage,
  quizMode,
  changeQuizMode,
  questionOrder,
  setQuestionOrder,
  view,
  openStats,
  closeStats,
  isReady,
  handleBackup,
  handleRestore,
  isBackupBusy,
}: Props) {
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

  return (
    <>
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
            accessibilityRole="button"
            accessibilityState={{ selected: lang === language }}
          >
            <Text style={styles.backupButtonText}>{lang.toUpperCase()}</Text>
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
            accessibilityRole="button"
            accessibilityState={{ selected: mode === quizMode }}
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
            accessibilityRole="button"
            accessibilityState={{ selected: order === questionOrder }}
          >
            <Text style={styles.actionButtonText}>{orderLabels[order]}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={view === 'quiz' ? openStats : closeStats}
          disabled={!isReady}
          accessibilityRole="button"
        >
          <Text style={styles.actionButtonText}>
            {view === 'quiz' ? t.viewStats : t.backToQuiz}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleBackup}
          disabled={isBackupBusy}
          accessibilityRole="button"
        >
          <Text style={styles.actionButtonText}>{t.backupAnswers}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleRestore}
          disabled={isBackupBusy}
          accessibilityRole="button"
        >
          <Text style={styles.actionButtonText}>{t.restoreAnswers}</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
