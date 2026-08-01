import type { LocalizedText } from '../i18n';
import type { QuizCategory, QuizQuestion } from './questions';

export type AnswerRecord = {
  questionId: number;
  isCorrect: boolean;
};

export type AnswerHistoryRecord = {
  questionId: number;
  isCorrect: boolean;
  answeredAt: string;
};

export type QuizMode = 'forward' | 'reverse';

export const QUIZ_MODES: QuizMode[] = ['forward', 'reverse'];

export type QuestionOrder = 'random' | 'weakest' | 'stale' | 'least-answered';

export const QUESTION_ORDERS: QuestionOrder[] = [
  'random',
  'weakest',
  'stale',
  'least-answered',
];

export type QuestionStat = {
  questionId: number;
  category: QuizCategory;
  topic: string;
  prompt: LocalizedText;
  attempts: number;
  correct: number;
  accuracy: number;
};

export type TopicStat = {
  topic: string;
  attempts: number;
  correct: number;
  accuracy: number;
};

export type OverallStats = {
  totalAttempts: number;
  totalCorrect: number;
  accuracy: number;
  questionsAttempted: number;
  questionsTotal: number;
};

function toAccuracy(correct: number, attempts: number): number {
  return attempts === 0 ? 0 : Math.round((correct / attempts) * 100);
}

function shuffle<T>(items: T[], random: () => number): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    const temp = result[i] as T;
    result[i] = result[j] as T;
    result[j] = temp;
  }
  return result;
}

const CODE_PATTERN = /\b([GM]\d{1,3}(?:\.\d)?)\b/g;

// Returns the single G/M code a question is about, used to build the
// "action -> code" reverse quiz mode. Falls back to scanning the English
// prompt for exactly one code mention when `question.code` isn't set; returns
// null when no single code can be determined (question is ineligible for
// reverse mode).
export function getQuestionCode(question: QuizQuestion): string | null {
  if (question.code) {
    return question.code;
  }
  const matches = Array.from(
    question.prompt.en.matchAll(CODE_PATTERN),
    (match) => match[1] as string,
  );
  const unique = new Set(matches);
  return unique.size === 1 ? (matches[0] as string) : null;
}

// Stable, non-cryptographic hash (FNV-1a, 32-bit) used to identify a piece
// of answer text independent of its position in a shuffled option list or
// which quiz session it appeared in. Not for security purposes.
export function hashAnswerText(text: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16);
}

export function getAnswerHash(text: LocalizedText): string {
  return hashAnswerText(text.en);
}

export type AnswerHashRecord = {
  questionId: number;
  answerHash: string;
};

// Tallies how many times each (questionId, answerHash) pair was selected in
// the answer history, used to weight distractor selection so wrong answers a
// user tends to pick are more likely to be offered again.
export function computeHashCounts(
  answers: AnswerHashRecord[],
): Map<string, number> {
  const counts = new Map<string, number>();
  for (const answer of answers) {
    const key = `${answer.questionId}:${answer.answerHash}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

type DistractorCandidate = {
  hash: string;
  text: LocalizedText;
};

// Picks `count` items from `candidates` without replacement, using
// weighted-random sampling where higher-weight items are more likely (but
// not guaranteed) to be picked first.
function weightedSample(
  candidates: DistractorCandidate[],
  weightOf: (candidate: DistractorCandidate) => number,
  count: number,
  random: () => number,
): DistractorCandidate[] {
  const pool = [...candidates];
  const picked: DistractorCandidate[] = [];

  while (picked.length < count && pool.length > 0) {
    const weights = pool.map(weightOf);
    const total = weights.reduce((sum, weight) => sum + weight, 0);
    let threshold = random() * total;
    let chosenIndex = pool.length - 1;
    for (let i = 0; i < weights.length; i++) {
      threshold -= weights[i] as number;
      if (threshold <= 0) {
        chosenIndex = i;
        break;
      }
    }
    picked.push(pool[chosenIndex] as DistractorCandidate);
    pool.splice(chosenIndex, 1);
  }

  return picked;
}

// Builds the pool of possible wrong-answer texts for a forward ("code ->
// meaning") question: its own hand-authored wrong options, plus the correct
// answer of every other question in the bank (each a real, plausible fact
// about a different code), deduplicated by hash.
function buildForwardDistractorPool(
  question: QuizQuestion,
  allQuestions: QuizQuestion[],
): DistractorCandidate[] {
  const correctHash = getAnswerHash(
    question.options[question.correctAnswer] as LocalizedText,
  );
  const seen = new Set<string>([correctHash]);
  const pool: DistractorCandidate[] = [];

  const add = (text: LocalizedText) => {
    const hash = getAnswerHash(text);
    if (seen.has(hash)) {
      return;
    }
    seen.add(hash);
    pool.push({ hash, text });
  };

  question.options.forEach((text, index) => {
    if (index !== question.correctAnswer) {
      add(text);
    }
  });
  for (const other of allQuestions) {
    if (other.id === question.id) {
      continue;
    }
    add(other.options[other.correctAnswer] as LocalizedText);
  }

  return pool;
}

// Builds the pool of possible wrong codes for a reverse ("action -> code")
// question: every other eligible question's code, deduplicated.
function buildReverseDistractorPool(
  question: QuizQuestion,
  allQuestions: QuizQuestion[],
  code: string,
): DistractorCandidate[] {
  const seen = new Set<string>([code]);
  const pool: DistractorCandidate[] = [];

  for (const other of allQuestions) {
    if (other.id === question.id) {
      continue;
    }
    const otherCode = getQuestionCode(other);
    if (otherCode === null || seen.has(otherCode)) {
      continue;
    }
    seen.add(otherCode);
    pool.push({ hash: otherCode, text: { en: otherCode, ru: otherCode } });
  }

  return pool;
}

// Builds the question as it should be displayed in a quiz session: for
// forward mode, shuffles in extra distractors pooled from the rest of the
// question bank; for reverse mode, turns the prompt into the description of
// the action and the options into G/M codes. In both cases, distractors the
// user has selected more often in the past for this question are weighted
// to appear more often (Laplace-smoothed so untried distractors still have a
// baseline chance). Reverse-mode questions with no single identifiable code
// are returned unchanged.
export function buildSessionQuestion(
  question: QuizQuestion,
  allQuestions: QuizQuestion[],
  mode: QuizMode,
  hashCounts: Map<string, number>,
  optionCount = 4,
  random: () => number = Math.random,
): QuizQuestion {
  const weightOf = (candidate: DistractorCandidate) =>
    1 + (hashCounts.get(`${question.id}:${candidate.hash}`) ?? 0);

  if (mode === 'reverse') {
    const code = getQuestionCode(question);
    if (!code) {
      return question;
    }

    const pool = buildReverseDistractorPool(question, allQuestions, code);
    const distractors = weightedSample(pool, weightOf, optionCount - 1, random);
    const correctOption: DistractorCandidate = {
      hash: code,
      text: { en: code, ru: code },
    };
    const codeOptions = shuffle([correctOption, ...distractors], random);
    const correctAnswer = codeOptions.findIndex(
      (option) => option.hash === code,
    );
    const description =
      question.options[question.correctAnswer] ?? question.prompt;

    return {
      ...question,
      prompt: description,
      options: codeOptions.map((option) => option.text),
      correctAnswer,
    };
  }

  const correctHash = getAnswerHash(
    question.options[question.correctAnswer] as LocalizedText,
  );
  const pool = buildForwardDistractorPool(question, allQuestions);
  const distractors = weightedSample(pool, weightOf, optionCount - 1, random);
  const correctOption: DistractorCandidate = {
    hash: correctHash,
    text: question.options[question.correctAnswer] as LocalizedText,
  };
  const options = shuffle([correctOption, ...distractors], random);
  const correctAnswer = options.findIndex(
    (option) => option.hash === correctHash,
  );

  return {
    ...question,
    options: options.map((option) => option.text),
    correctAnswer,
  };
}

type QuestionOrderStat = {
  attempts: number;
  correct: number;
  lastAnsweredAt: string;
};

// Empty string sorts before any ISO timestamp, so never-answered questions
// are treated as the longest overdue.
const NEVER_ANSWERED = '';

export function orderQuestions(
  questions: QuizQuestion[],
  answers: AnswerHistoryRecord[],
  order: QuestionOrder,
  random: () => number = Math.random,
): QuizQuestion[] {
  if (order === 'random') {
    return shuffle(questions, random);
  }

  const statsByQuestion = new Map<number, QuestionOrderStat>();
  for (const answer of answers) {
    const entry = statsByQuestion.get(answer.questionId) ?? {
      attempts: 0,
      correct: 0,
      lastAnsweredAt: NEVER_ANSWERED,
    };
    entry.attempts += 1;
    if (answer.isCorrect) {
      entry.correct += 1;
    }
    if (answer.answeredAt > entry.lastAnsweredAt) {
      entry.lastAnsweredAt = answer.answeredAt;
    }
    statsByQuestion.set(answer.questionId, entry);
  }

  const withStats = questions.map((question) => ({
    question,
    stat: statsByQuestion.get(question.id) ?? {
      attempts: 0,
      correct: 0,
      lastAnsweredAt: NEVER_ANSWERED,
    },
  }));

  switch (order) {
    case 'weakest':
      return withStats
        .sort((a, b) => {
          const accuracyA =
            a.stat.attempts === 0
              ? Number.POSITIVE_INFINITY
              : a.stat.correct / a.stat.attempts;
          const accuracyB =
            b.stat.attempts === 0
              ? Number.POSITIVE_INFINITY
              : b.stat.correct / b.stat.attempts;
          return accuracyA - accuracyB;
        })
        .map((item) => item.question);
    case 'least-answered':
      return withStats
        .sort((a, b) => a.stat.attempts - b.stat.attempts)
        .map((item) => item.question);
    case 'stale':
      return withStats
        .sort((a, b) =>
          a.stat.lastAnsweredAt.localeCompare(b.stat.lastAnsweredAt),
        )
        .map((item) => item.question);
    default:
      return questions;
  }
}

export function getProgressPercent(
  currentIndex: number,
  total: number,
): number {
  if (total === 0) {
    return 0;
  }
  return ((currentIndex + 1) / total) * 100;
}

export function getNextQuestionIndex(
  currentIndex: number,
  total: number,
): number {
  if (total === 0) {
    return 0;
  }
  return currentIndex < total - 1 ? currentIndex + 1 : 0;
}

export function isCorrectAnswer(
  question: QuizQuestion,
  answerIndex: number,
): boolean {
  return answerIndex === question.correctAnswer;
}

export function computeQuestionStats(
  questions: QuizQuestion[],
  answers: AnswerRecord[],
): QuestionStat[] {
  const byQuestion = new Map<number, { attempts: number; correct: number }>();
  for (const answer of answers) {
    const entry = byQuestion.get(answer.questionId) ?? {
      attempts: 0,
      correct: 0,
    };
    entry.attempts += 1;
    if (answer.isCorrect) {
      entry.correct += 1;
    }
    byQuestion.set(answer.questionId, entry);
  }

  return questions.map((question) => {
    const entry = byQuestion.get(question.id) ?? { attempts: 0, correct: 0 };
    return {
      questionId: question.id,
      category: question.category,
      topic: question.topic,
      prompt: question.prompt,
      attempts: entry.attempts,
      correct: entry.correct,
      accuracy: toAccuracy(entry.correct, entry.attempts),
    };
  });
}

export function computeTopicStats(questionStats: QuestionStat[]): TopicStat[] {
  const byTopic = new Map<string, { attempts: number; correct: number }>();
  for (const stat of questionStats) {
    const entry = byTopic.get(stat.topic) ?? { attempts: 0, correct: 0 };
    entry.attempts += stat.attempts;
    entry.correct += stat.correct;
    byTopic.set(stat.topic, entry);
  }

  return Array.from(byTopic.entries())
    .map(([topic, entry]) => ({
      topic,
      attempts: entry.attempts,
      correct: entry.correct,
      accuracy: toAccuracy(entry.correct, entry.attempts),
    }))
    .sort((a, b) => a.topic.localeCompare(b.topic));
}

export function computeOverallStats(
  questions: QuizQuestion[],
  answers: AnswerRecord[],
): OverallStats {
  const totalAttempts = answers.length;
  const totalCorrect = answers.filter((answer) => answer.isCorrect).length;
  const attemptedIds = new Set(answers.map((answer) => answer.questionId));

  return {
    totalAttempts,
    totalCorrect,
    accuracy: toAccuracy(totalCorrect, totalAttempts),
    questionsAttempted: attemptedIds.size,
    questionsTotal: questions.length,
  };
}
