export type Language = 'en' | 'ru';

export const LANGUAGES: Language[] = ['en', 'ru'];

export type LocalizedText = Record<Language, string>;

export function localize(text: LocalizedText, language: Language): string {
  return text[language] ?? text.en;
}

export const uiStrings = {
  en: {
    appTitle: 'G-Code Quiz',
    appSubtitle:
      'Practice CNC programming fundamentals with local quiz questions.',
    languageLabel: 'Language',
    modeLabel: 'Quiz mode',
    modeForward: 'Code → Meaning',
    modeReverse: 'Action → Code',
    modeTyped: 'Type the code',
    reverseQuestionHint: 'Which code matches this action?',
    typedQuestionHint: 'Type the code that matches this action:',
    typedAnswerPlaceholder: 'e.g. G54',
    submitTypedAnswer: 'Check answer',
    typedResultCorrect: 'Correct!',
    typedResultIncorrect: (code: string) =>
      `Incorrect. The correct code is ${code}.`,
    orderLabel: 'Question order',
    orderRandom: 'Random',
    orderWeakest: 'Weakest first',
    orderStale: 'Not answered in a while',
    orderLeastAnswered: 'Least answered',
    viewStats: 'View stats',
    backToQuiz: 'Back to quiz',
    backupAnswers: 'Backup answers',
    restoreAnswers: 'Restore answers',
    loadingQuestions: 'Loading quiz questions...',
    loadErrorMessage: 'Could not load quiz questions. Please try again.',
    retry: 'Retry',
    noQuestionsAvailable: 'No questions available.',
    questionProgress: (current: number, total: number) =>
      `Question ${current} of ${total}`,
    score: (value: number) => `Score ${value}`,
    explanationHeading: 'Explanation',
    nextQuestion: 'Next question',
    loadingHistory: 'Loading your answer history...',
    statsLoadErrorMessage: 'Could not load your answer history.',
    overallHeading: 'Overall',
    overallSummary: (
      correct: number,
      attempts: number,
      accuracy: number,
      questionsAttempted: number,
      questionsTotal: number,
    ) =>
      `${correct}/${attempts} correct (${accuracy}%) \u00b7 ${questionsAttempted}/${questionsTotal} questions attempted`,
    byTopicHeading: 'By topic',
    noAnswersRecorded: 'No answers recorded yet.',
    weakestQuestionsHeading: 'Weakest questions',
    answerSomeQuestions:
      'Answer some questions to see your weakest topics here.',
    statAccuracy: (correct: number, attempts: number, accuracy: number) =>
      `${correct}/${attempts} (${accuracy}%)`,
    backupReadyTitle: 'Backup ready',
    backupReadyMessage: 'Your answers were exported successfully.',
    backupFailedTitle: 'Backup failed',
    backupFailedMessage: 'Could not export your answers. Please try again.',
    restoreCompleteTitle: 'Restore complete',
    restoreCompleteMessage: 'Your answers were imported successfully.',
    restoreInvalidTitle: 'Restore failed',
    restoreInvalidMessage: 'That file is not a valid answers backup.',
    restoreFailedTitle: 'Restore failed',
    restoreFailedMessage: 'Could not import your answers. Please try again.',
  },
  ru: {
    appTitle: 'Тест по G-кодам',
    appSubtitle:
      'Практикуйте основы программирования ЧПУ с локальными тестовыми вопросами.',
    languageLabel: 'Язык',
    modeLabel: 'Режим теста',
    modeForward: 'Код → Значение',
    modeReverse: 'Действие → Код',
    modeTyped: 'Ввести код',
    reverseQuestionHint: 'Какой код соответствует этому действию?',
    typedQuestionHint: 'Введите код, соответствующий этому действию:',
    typedAnswerPlaceholder: 'например, G54',
    submitTypedAnswer: 'Проверить',
    typedResultCorrect: 'Правильно!',
    typedResultIncorrect: (code: string) =>
      `Неправильно. Правильный код: ${code}.`,
    orderLabel: 'Порядок вопросов',
    orderRandom: 'Случайный',
    orderWeakest: 'Сначала слабые',
    orderStale: 'Давно не отвечали',
    orderLeastAnswered: 'Меньше всего ответов',
    viewStats: 'Статистика',
    backToQuiz: 'Вернуться к тесту',
    backupAnswers: 'Сохранить резервную копию',
    restoreAnswers: 'Восстановить ответы',
    loadingQuestions: 'Загрузка вопросов...',
    loadErrorMessage: 'Не удалось загрузить вопросы. Попробуйте ещё раз.',
    retry: 'Повторить',
    noQuestionsAvailable: 'Нет доступных вопросов.',
    questionProgress: (current: number, total: number) =>
      `Вопрос ${current} из ${total}`,
    score: (value: number) => `Счёт ${value}`,
    explanationHeading: 'Объяснение',
    nextQuestion: 'Следующий вопрос',
    loadingHistory: 'Загрузка истории ответов...',
    statsLoadErrorMessage: 'Не удалось загрузить историю ответов.',
    overallHeading: 'Общая статистика',
    overallSummary: (
      correct: number,
      attempts: number,
      accuracy: number,
      questionsAttempted: number,
      questionsTotal: number,
    ) =>
      `${correct}/${attempts} верно (${accuracy}%) \u00b7 ${questionsAttempted}/${questionsTotal} вопросов пройдено`,
    byTopicHeading: 'По темам',
    noAnswersRecorded: 'Ответов пока нет.',
    weakestQuestionsHeading: 'Слабые места',
    answerSomeQuestions:
      'Ответьте на несколько вопросов, чтобы увидеть слабые темы здесь.',
    statAccuracy: (correct: number, attempts: number, accuracy: number) =>
      `${correct}/${attempts} (${accuracy}%)`,
    backupReadyTitle: 'Резервная копия готова',
    backupReadyMessage: 'Ваши ответы успешно экспортированы.',
    backupFailedTitle: 'Ошибка резервного копирования',
    backupFailedMessage:
      'Не удалось экспортировать ответы. Попробуйте ещё раз.',
    restoreCompleteTitle: 'Восстановление завершено',
    restoreCompleteMessage: 'Ваши ответы успешно импортированы.',
    restoreInvalidTitle: 'Ошибка восстановления',
    restoreInvalidMessage: 'Этот файл не является корректной резервной копией.',
    restoreFailedTitle: 'Ошибка восстановления',
    restoreFailedMessage:
      'Не удалось импортировать ответы. Попробуйте ещё раз.',
  },
} as const satisfies Record<Language, Record<string, unknown>>;

export type UiStrings = (typeof uiStrings)[Language];
