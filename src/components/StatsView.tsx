import { Text, View } from 'react-native';
import type { OverallStats, QuestionStat, TopicStat } from '../data/quizLogic';
import { type Language, localize, type UiStrings } from '../i18n';
import { styles } from '../styles';

type Props = {
  t: UiStrings;
  language: Language;
  isStatsLoading: boolean;
  statsError: boolean;
  overallStats: OverallStats | null;
  topicStats: TopicStat[];
  sortedQuestionStats: QuestionStat[];
};

export function StatsView({
  t,
  language,
  isStatsLoading,
  statsError,
  overallStats,
  topicStats,
  sortedQuestionStats,
}: Props) {
  if (isStatsLoading) {
    return (
      <View style={styles.card}>
        <Text style={styles.cardText}>{t.loadingHistory}</Text>
      </View>
    );
  }

  if (statsError) {
    return (
      <View style={styles.card}>
        <Text style={styles.cardText}>{t.statsLoadErrorMessage}</Text>
      </View>
    );
  }

  if (!overallStats) {
    return null;
  }

  return (
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
                {t.statAccuracy(stat.correct, stat.attempts, stat.accuracy)}
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
                  {t.statAccuracy(stat.correct, stat.attempts, stat.accuracy)}
                </Text>
              </View>
            ))
        ) : (
          <Text style={styles.cardText}>{t.answerSomeQuestions}</Text>
        )}
      </View>
    </>
  );
}
