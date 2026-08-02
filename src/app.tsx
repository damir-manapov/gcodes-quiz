import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { QuizCard } from './components/QuizCard';
import { SettingsControls } from './components/SettingsControls';
import { StatsView } from './components/StatsView';
import type { QuestionOrder, QuizMode } from './data/quizLogic';
import { useBackup } from './hooks/useBackup';
import { useLanguage } from './hooks/useLanguage';
import { useQuiz } from './hooks/useQuiz';
import { useStats } from './hooks/useStats';
import { uiStrings } from './i18n';
import { styles } from './styles';

export default function App() {
  const { language, changeLanguage } = useLanguage();
  const [questionOrder, setQuestionOrder] = useState<QuestionOrder>('random');
  const [quizMode, setQuizMode] = useState<QuizMode>('forward');
  const t = uiStrings[language];

  const {
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
  } = useQuiz(questionOrder, quizMode);

  const {
    view,
    isStatsLoading,
    statsError,
    topicStats,
    overallStats,
    sortedQuestionStats,
    openStats,
    closeStats,
  } = useStats(questions);

  const { isBackupBusy, handleBackup, handleRestore } = useBackup(t);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>{t.appTitle}</Text>
          <Text style={styles.subtitle}>{t.appSubtitle}</Text>

          <SettingsControls
            t={t}
            language={language}
            changeLanguage={changeLanguage}
            quizMode={quizMode}
            changeQuizMode={setQuizMode}
            questionOrder={questionOrder}
            setQuestionOrder={setQuestionOrder}
            view={view}
            openStats={openStats}
            closeStats={closeStats}
            isReady={isReady}
            handleBackup={handleBackup}
            handleRestore={handleRestore}
            isBackupBusy={isBackupBusy}
          />

          {view === 'stats' ? (
            <StatsView
              t={t}
              language={language}
              isStatsLoading={isStatsLoading}
              statsError={statsError}
              overallStats={overallStats}
              topicStats={topicStats}
              sortedQuestionStats={sortedQuestionStats}
            />
          ) : !isReady ? (
            <View style={styles.card}>
              <Text style={styles.cardText}>{t.loadingQuestions}</Text>
            </View>
          ) : hasLoadError ? (
            <View style={styles.card}>
              <Text style={styles.cardText}>{t.loadErrorMessage}</Text>
              <TouchableOpacity
                style={styles.nextButton}
                onPress={loadQuiz}
                accessibilityRole="button"
              >
                <Text style={styles.nextButtonText}>{t.retry}</Text>
              </TouchableOpacity>
            </View>
          ) : questions.length === 0 ? (
            <View style={styles.card}>
              <Text style={styles.cardText}>{t.noQuestionsAvailable}</Text>
            </View>
          ) : currentQuestion ? (
            <QuizCard
              t={t}
              language={language}
              quizMode={quizMode}
              question={currentQuestion}
              currentIndex={currentIndex}
              totalQuestions={questions.length}
              score={score}
              progress={progress}
              selectedAnswer={selectedAnswer}
              typedAnswer={typedAnswer}
              setTypedAnswer={setTypedAnswer}
              showAnswer={showAnswer}
              submitAnswer={submitAnswer}
              submitTypedAnswer={submitTypedAnswer}
              nextQuestion={nextQuestion}
            />
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
