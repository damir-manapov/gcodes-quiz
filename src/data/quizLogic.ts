import type { LocalizedText } from '../i18n';
import type { LineExample, QuizCategory, QuizQuestion } from './questions';

// A question resolved for a single quiz session: one phrasing has been
// picked from the bank's `prompts`/`correctAnswers` arrays, and (in
// multiple-choice modes) a concrete, shuffled `options` list has been built
// with `correctAnswer` as its index - computed here rather than stored in
// the bank, so it can never drift out of sync with the option list.
export type SessionQuestion = {
  id: number;
  category: QuizCategory;
  topic: string;
  code?: string;
  prompt: LocalizedText;
  options: LocalizedText[];
  correctAnswer: number;
  explanation: LocalizedText;
  // The worked example picked for this session, read by
  // `buildExpectedLineText`/`isCorrectLineAnswer`. Only present in line mode.
  lineExample?: LineExample;
};

export type AnswerRecord = {
  questionId: number;
  isCorrect: boolean;
};

export type AnswerHistoryRecord = {
  questionId: number;
  isCorrect: boolean;
  answeredAt: string;
  // Null for answers recorded before mode was tracked; such answers are
  // excluded from per-mode ordering stats since their mode is unknown.
  mode: QuizMode | null;
};

export type QuizMode = 'forward' | 'reverse' | 'typed' | 'line';

export const QUIZ_MODES: QuizMode[] = ['forward', 'reverse', 'typed', 'line'];

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

// Returns the single G/M code a question is about, used to build the
// "action -> code" reverse quiz mode. Returns null when the question isn't
// about one specific code (ineligible for reverse mode). Accepts both bank
// and session questions, since both carry an optional `code`.
export function getQuestionCode(question: { code?: string }): string | null {
  return question.code ?? null;
}

// The description of what a code does, used as the prompt for reverse and
// typed modes. Picks randomly among every authored phrasing of the correct
// answer, so the exact wording isn't memorized.
function getActionDescription(
  question: QuizQuestion,
  random: () => number,
): LocalizedText {
  return pickOne(question.correctAnswers, random);
}

// Picks randomly among `items`, so a question's displayed wording differs
// from session to session instead of always being the exact same
// memorizable string.
function pickOne<T>(items: T[], random: () => number): T {
  return items[Math.floor(random() * items.length)] as T;
}

// A question's canonical correct-answer phrasing, used as a stable identity
// for hashing/dedup regardless of which variant is displayed that session.
// `correctAnswers` is authored non-empty, hence the cast.
function firstCorrectAnswer(question: QuizQuestion): LocalizedText {
  return question.correctAnswers[0] as LocalizedText;
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
  isClose?: boolean;
};

// Extra weight given to a "close" code (see `areCodesClose`) when sampling
// reverse-mode distractors, on top of the baseline weight of 1 shared by
// every candidate and any weight earned from being picked before.
const CLOSE_CODE_WEIGHT_BONUS = 2;

// Two codes are "close" when they share a letter (G/M) and their numeric
// part is within 2 of each other, e.g. G41 is close to G40, G42 and G43.
// Used to make reverse-mode distractors more plausible/confusable rather
// than pulling from completely unrelated codes.
export function areCodesClose(a: string, b: string): boolean {
  const matchA = a.match(/^([A-Z])(\d+)$/);
  const matchB = b.match(/^([A-Z])(\d+)$/);
  if (!matchA || !matchB || matchA[1] !== matchB[1]) {
    return false;
  }
  return Math.abs(Number(matchA[2]) - Number(matchB[2])) <= 2;
}

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
// meaning") question: its own hand-authored distractors, plus the canonical
// correct answer of every other question in the bank (each a real,
// plausible fact about a different code), deduplicated by hash. Always uses
// each question's first `correctAnswers` entry (never the later variant
// phrasings) as its canonical identity, so which distractor a user has
// picked before is recognized consistently across sessions regardless of
// which phrasing is shown as the correct answer that session.
function buildForwardDistractorPool(
  question: QuizQuestion,
  allQuestions: QuizQuestion[],
): DistractorCandidate[] {
  const correctHash = getAnswerHash(firstCorrectAnswer(question));
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

  for (const text of question.distractors) {
    add(text);
  }
  for (const other of allQuestions) {
    if (other.id === question.id) {
      continue;
    }
    add(firstCorrectAnswer(other));
  }

  return pool;
}

// Builds the pool of possible wrong codes for a reverse ("action -> code")
// question: every other eligible question's code, deduplicated, tagged with
// whether it's a "close" code so it can be weighted more heavily below.
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
    pool.push({
      hash: otherCode,
      text: { en: otherCode, ru: otherCode },
      isClose: areCodesClose(code, otherCode),
    });
  }

  return pool;
}

// Reverse mode shows a 3x3 grid of codes to choose from, since codes are
// short and a bigger pool makes for a more meaningful memory test; the other
// modes keep a plain list of 4 options.
const DEFAULT_OPTION_COUNTS: Record<QuizMode, number> = {
  forward: 4,
  reverse: 9,
  typed: 1,
  line: 1,
};

// Builds the question as it should be displayed in a quiz session: for
// forward mode, shuffles in extra distractors pooled from the rest of the
// question bank; for reverse mode, turns the prompt into the description of
// the action and the options into G/M codes; for typed mode, does the same
// but without building any multiple-choice options, since the user types
// the code in free-hand instead of picking from a list. In the multiple-
// choice modes, every candidate starts with a baseline weight (so a random
// code always has a chance), which is then boosted for distractors the user
// has selected more often in the past for this question, and, in reverse
// mode, for codes numerically close to the correct one (e.g. G40/G42 as
// distractors for G41), since those are the most plausible mix-ups. Reverse
// and typed mode questions with no single identifiable code are returned
// unchanged.
export function buildSessionQuestion(
  question: QuizQuestion,
  allQuestions: QuizQuestion[],
  mode: QuizMode,
  hashCounts: Map<string, number>,
  optionCount = DEFAULT_OPTION_COUNTS[mode],
  random: () => number = Math.random,
): SessionQuestion {
  const weightOf = (candidate: DistractorCandidate) =>
    1 +
    (hashCounts.get(`${question.id}:${candidate.hash}`) ?? 0) +
    (candidate.isClose ? CLOSE_CODE_WEIGHT_BONUS : 0);

  const base = {
    id: question.id,
    category: question.category,
    topic: question.topic,
    ...(question.code ? { code: question.code } : {}),
    explanation: question.explanation,
  };

  if (mode === 'typed') {
    const code = getQuestionCode(question);
    if (!code) {
      return toFallbackSessionQuestion(question);
    }
    return {
      ...base,
      prompt: getActionDescription(question, random),
      options: [{ en: code, ru: code }],
      correctAnswer: 0,
    };
  }

  if (mode === 'line') {
    const lineExamples = question.lineExamples;
    if (!lineExamples || lineExamples.length === 0) {
      return toFallbackSessionQuestion(question);
    }
    const lineExample = lineExamples[
      Math.floor(random() * lineExamples.length)
    ] as LineExample;
    const sessionQuestion = { ...base, lineExample };
    const expectedLine = buildExpectedLineText(sessionQuestion);
    return {
      ...sessionQuestion,
      prompt: lineExample.prompt,
      options: [{ en: expectedLine, ru: expectedLine }],
      correctAnswer: 0,
    };
  }

  if (mode === 'reverse') {
    const code = getQuestionCode(question);
    if (!code) {
      return toFallbackSessionQuestion(question);
    }

    const pool = buildReverseDistractorPool(question, allQuestions, code);
    const { options, correctAnswer } = buildWeightedOptions(
      { hash: code, text: { en: code, ru: code } },
      pool,
      weightOf,
      optionCount,
      random,
    );

    return {
      ...base,
      prompt: getActionDescription(question, random),
      options,
      correctAnswer,
    };
  }

  const pool = buildForwardDistractorPool(question, allQuestions);
  const { options, correctAnswer } = buildWeightedOptions(
    {
      hash: getAnswerHash(firstCorrectAnswer(question)),
      text: pickOne(question.correctAnswers, random),
    },
    pool,
    weightOf,
    optionCount,
    random,
  );

  return {
    ...base,
    prompt: pickOne(question.prompts, random),
    options,
    correctAnswer,
  };
}

// Shared by forward/reverse mode: samples weighted distractors to fill out
// `optionCount` options alongside the correct one, shuffles them together,
// and reports where the correct option landed.
function buildWeightedOptions(
  correctOption: DistractorCandidate,
  pool: DistractorCandidate[],
  weightOf: (candidate: DistractorCandidate) => number,
  optionCount: number,
  random: () => number,
): { options: LocalizedText[]; correctAnswer: number } {
  const distractors = weightedSample(pool, weightOf, optionCount - 1, random);
  const shuffled = shuffle([correctOption, ...distractors], random);
  const correctAnswer = shuffled.findIndex(
    (option) => option.hash === correctOption.hash,
  );
  return { options: shuffled.map((option) => option.text), correctAnswer };
}

// Degenerate forward-style session question used when a question isn't
// eligible for the requested mode (e.g. no single code for reverse/typed, no
// worked example for line mode). Not expected to be hit in normal use, since
// callers filter eligibility before calling `buildSessionQuestion` (see
// `useQuiz`'s `isEligibleForMode`), but kept as a safe fallback rather than
// throwing.
function toFallbackSessionQuestion(question: QuizQuestion): SessionQuestion {
  return {
    id: question.id,
    category: question.category,
    topic: question.topic,
    ...(question.code ? { code: question.code } : {}),
    explanation: question.explanation,
    prompt: question.prompts[0] as LocalizedText,
    options: [firstCorrectAnswer(question), ...question.distractors],
    correctAnswer: 0,
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

// Only this many of a question's most recent answers (per mode) count
// towards ordering stats, so old mistakes on a code you've since learned
// don't keep the question surfacing as "weak" or "least-answered" forever.
const MAX_RECENT_ANSWERS_PER_QUESTION = 10;

// Ordering stats are computed per quiz mode: a question you've mastered in
// Code -> Meaning shouldn't be treated as "weak" or "recently answered" in
// Action -> Code, since the two modes ask fundamentally different things.
export function orderQuestions(
  questions: QuizQuestion[],
  answers: AnswerHistoryRecord[],
  order: QuestionOrder,
  quizMode: QuizMode,
  random: () => number = Math.random,
): QuizQuestion[] {
  if (order === 'random') {
    return shuffle(questions, random);
  }

  const relevantAnswers = answers.filter((answer) => answer.mode === quizMode);

  const answersByQuestion = new Map<number, AnswerHistoryRecord[]>();
  for (const answer of relevantAnswers) {
    const list = answersByQuestion.get(answer.questionId) ?? [];
    list.push(answer);
    answersByQuestion.set(answer.questionId, list);
  }

  const statsByQuestion = new Map<number, QuestionOrderStat>();
  for (const [questionId, questionAnswers] of answersByQuestion) {
    const recentAnswers = [...questionAnswers]
      .sort((a, b) => a.answeredAt.localeCompare(b.answeredAt))
      .slice(-MAX_RECENT_ANSWERS_PER_QUESTION);

    const entry: QuestionOrderStat = {
      attempts: 0,
      correct: 0,
      lastAnsweredAt: NEVER_ANSWERED,
    };
    for (const answer of recentAnswers) {
      entry.attempts += 1;
      if (answer.isCorrect) {
        entry.correct += 1;
      }
      if (answer.answeredAt > entry.lastAnsweredAt) {
        entry.lastAnsweredAt = answer.answeredAt;
      }
    }
    statsByQuestion.set(questionId, entry);
  }

  // Shuffled before sorting so that questions tied on the sort key (e.g.
  // multiple never-answered questions) don't fall back to creation order,
  // which would otherwise group similar/adjacent questions together. Array
  // sort is stable, so ties keep this shuffled order.
  const withStats = shuffle(
    questions.map((question) => ({
      question,
      stat: statsByQuestion.get(question.id) ?? {
        attempts: 0,
        correct: 0,
        lastAnsweredAt: NEVER_ANSWERED,
      },
    })),
    random,
  );

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
  question: SessionQuestion,
  answerIndex: number,
): boolean {
  return answerIndex === question.correctAnswer;
}

// Trims and uppercases a typed code, and strips leading zeros from its
// numeric part, so it's judged the way a real CNC controller reads it: G1
// and G01 address the same command, as do G0 and G00.
export function normalizeCode(text: string): string {
  const trimmed = text.trim().toUpperCase();
  const match = trimmed.match(/^([A-Z])0*(\d+(?:\.\d+)?)$/);
  return match ? `${match[1]}${match[2]}` : trimmed;
}

export function isCorrectTypedAnswer(
  question: { code?: string },
  typedText: string,
): boolean {
  const code = getQuestionCode(question);
  return code !== null && normalizeCode(typedText) === normalizeCode(code);
}

// Matches a single G-code "word": an address letter followed by a numeric
// value, e.g. "G81", "x10", "Z-12.5". Used to parse a free-typed code line
// into its component words regardless of spacing or letter case.
const CODE_WORD_PATTERN = /([A-Za-z])\s*(-?\d+(?:\.\d+)?)/g;

type CodeWord = {
  letter: string;
  value: number;
};

function parseCodeLine(text: string): CodeWord[] {
  return Array.from(text.matchAll(CODE_WORD_PATTERN), (match) => ({
    letter: (match[1] as string).toUpperCase(),
    value: Number(match[2]),
  }));
}

// Builds the canonical text of a line-mode question's expected answer, e.g.
// "G81 X10 Y5 Z-12 R2 F100", shown as feedback when the user gets it wrong.
export function buildExpectedLineText(question: {
  code?: string;
  lineExample?: LineExample;
}): string {
  const code = getQuestionCode(question);
  const params = question.lineExample?.params ?? [];
  return [code, ...params.map((param) => `${param.letter}${param.value}`)]
    .filter((word): word is string => word !== null)
    .join(' ');
}

// Validates a free-typed G/M-code line the way a real CNC controller would:
// address letters are case-insensitive, numbers don't need leading zeros,
// and the order of words on the line doesn't matter, since a controller
// reads each word by its address letter rather than its position.
export function isCorrectLineAnswer(
  question: { code?: string; lineExample?: LineExample },
  typedText: string,
): boolean {
  const code = getQuestionCode(question);
  const lineExample = question.lineExample;
  if (!code || !lineExample) {
    return false;
  }

  const words = parseCodeLine(typedText);
  const codeLetter = code[0] as string;
  const codeNumber = Number(code.slice(1));

  const codeWords = words.filter((word) => word.letter === codeLetter);
  if (codeWords.length !== 1 || codeWords[0]?.value !== codeNumber) {
    return false;
  }

  const paramWords = words.filter((word) => word.letter !== codeLetter);
  if (paramWords.length !== lineExample.params.length) {
    return false;
  }

  const actualByLetter = new Map<string, number>();
  for (const word of paramWords) {
    if (actualByLetter.has(word.letter)) {
      // A repeated address on one line isn't a valid word match.
      return false;
    }
    actualByLetter.set(word.letter, word.value);
  }

  return lineExample.params.every((param) => {
    const actual = actualByLetter.get(param.letter.toUpperCase());
    return actual !== undefined && actual === Number(param.value);
  });
}

export function computeQuestionStats(
  questions: SessionQuestion[],
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
  questions: SessionQuestion[],
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
