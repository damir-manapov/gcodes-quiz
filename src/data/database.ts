import * as SQLite from 'expo-sqlite';
import type { Language } from '../i18n';
import type { AnswersBackup } from './backupFormat';
import { mapAnswerRow, toBackupAnswer } from './databaseMappers';
import { getQuestionsForQuiz } from './questions';
import type { QuizMode } from './quizLogic';

const DB_NAME = 'gcodes-quiz.db';

export type StoredAnswer = {
  id: number;
  questionId: number;
  selectedAnswer: number;
  isCorrect: boolean;
  answeredAt: string;
  answerHash: string;
  // Null for answers recorded before mode was tracked.
  mode: QuizMode | null;
};

export type { AnswersBackup } from './backupFormat';

// Append new steps here for future schema changes; never edit existing ones.
const MIGRATIONS: Array<(db: SQLite.SQLiteDatabase) => Promise<void>> = [
  async (db) => {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS questions (
        id INTEGER PRIMARY KEY NOT NULL,
        prompt TEXT NOT NULL,
        options TEXT NOT NULL,
        correctAnswer INTEGER NOT NULL,
        explanation TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS answers (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        questionId INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
        selectedAnswer INTEGER NOT NULL,
        isCorrect INTEGER NOT NULL,
        answeredAt TEXT NOT NULL,
        UNIQUE (questionId, answeredAt)
      );
      CREATE INDEX IF NOT EXISTS idx_answers_questionId ON answers(questionId);
      CREATE INDEX IF NOT EXISTS idx_answers_answeredAt ON answers(answeredAt);
    `);
  },
  async (db) => {
    await db.execAsync(`
      ALTER TABLE questions ADD COLUMN category TEXT NOT NULL DEFAULT 'G';
      ALTER TABLE questions ADD COLUMN topic TEXT NOT NULL DEFAULT 'general';
    `);
  },
  async (db) => {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS preferences (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT NOT NULL
      );
    `);
  },
  async (db) => {
    await db.execAsync(`
      ALTER TABLE questions ADD COLUMN code TEXT;
    `);
  },
  async (db) => {
    // Old answers were keyed by option index, which has no stable meaning
    // now that options are rebuilt per-session from a shared distractor
    // pool. Discard old history and switch to hashing the selected
    // answer's text instead, so it stays a stable identity across sessions.
    await db.execAsync(`
      DELETE FROM answers;
      ALTER TABLE answers ADD COLUMN answerHash TEXT NOT NULL DEFAULT '';
    `);
  },
  async (db) => {
    // Tracks which quiz mode an answer was given in, so ordering stats
    // (weakest/stale/least-answered) can be computed separately per mode.
    // Existing rows get NULL, meaning "mode unknown" - they're excluded from
    // per-mode ordering stats going forward rather than guessed at.
    await db.execAsync(`
      ALTER TABLE answers ADD COLUMN mode TEXT;
    `);
  },
];

async function runMigrations(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync('PRAGMA foreign_keys = ON;');
  const row = await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version',
  );
  const startVersion = row?.user_version ?? 0;
  const pendingMigrations = MIGRATIONS.slice(startVersion);
  for (const [offset, migration] of pendingMigrations.entries()) {
    await migration(db);
    await db.execAsync(`PRAGMA user_version = ${startVersion + offset + 1};`);
  }
}

export async function openDatabase() {
  return SQLite.openDatabaseAsync(DB_NAME);
}

// Cached so migrations and question seeding only run once per app session
// instead of on every initializeDatabase() call (e.g. every recordAnswer()).
let readyPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export async function initializeDatabase() {
  if (!readyPromise) {
    readyPromise = (async () => {
      const db = await openDatabase();
      await runMigrations(db);

      const questions = getQuestionsForQuiz();
      for (const question of questions) {
        // The bank stores every phrasing of the prompt/correct answer
        // (`prompts`/`correctAnswers`) plus wrong-answer `distractors`; this
        // table only exists so `answers.questionId` has something to
        // reference (see the foreign key above), so it's seeded with each
        // question's canonical (first) phrasing rather than every variant.
        const options = [question.correctAnswers[0], ...question.distractors];
        await db.runAsync(
          `INSERT INTO questions (id, prompt, options, correctAnswer, explanation, category, topic, code)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(id) DO UPDATE SET
             prompt = excluded.prompt,
             options = excluded.options,
             correctAnswer = excluded.correctAnswer,
             explanation = excluded.explanation,
             category = excluded.category,
             topic = excluded.topic,
             code = excluded.code`,
          [
            question.id,
            JSON.stringify(question.prompts[0]),
            JSON.stringify(options),
            0,
            JSON.stringify(question.explanation),
            question.category,
            question.topic,
            question.code ?? null,
          ],
        );
      }

      return db;
    })().catch((error) => {
      readyPromise = null;
      throw error;
    });
  }

  return readyPromise;
}

const DEFAULT_LANGUAGE: Language = 'en';

export async function getLanguage(): Promise<Language> {
  const db = await initializeDatabase();
  const row = await db.getFirstAsync<{ value: string }>(
    "SELECT value FROM preferences WHERE key = 'language'",
  );
  return row?.value === 'ru' ? 'ru' : DEFAULT_LANGUAGE;
}

export async function setLanguage(language: Language): Promise<void> {
  const db = await initializeDatabase();
  await db.runAsync(
    `INSERT INTO preferences (key, value) VALUES ('language', ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    [language],
  );
}

export async function recordAnswer(
  questionId: number,
  selectedAnswer: number,
  isCorrect: boolean,
  answerHash: string,
  mode: QuizMode,
): Promise<void> {
  const db = await initializeDatabase();
  await db.runAsync(
    'INSERT INTO answers (questionId, selectedAnswer, isCorrect, answeredAt, answerHash, mode) VALUES (?, ?, ?, ?, ?, ?)',
    [
      questionId,
      selectedAnswer,
      isCorrect ? 1 : 0,
      new Date().toISOString(),
      answerHash,
      mode,
    ],
  );
}

export async function getStoredAnswers(): Promise<StoredAnswer[]> {
  const db = await initializeDatabase();
  const rows = await db.getAllAsync<{
    id: number;
    questionId: number;
    selectedAnswer: number;
    isCorrect: number;
    answeredAt: string;
    answerHash: string;
    mode: QuizMode | null;
  }>(
    'SELECT id, questionId, selectedAnswer, isCorrect, answeredAt, answerHash, mode FROM answers ORDER BY id ASC',
  );

  return rows.map(mapAnswerRow);
}

export async function exportAnswersBackup(): Promise<AnswersBackup> {
  const answers = await getStoredAnswers();
  return {
    exportedAt: new Date().toISOString(),
    answers: answers.map(toBackupAnswer),
  };
}

export async function importAnswersBackup(
  backup: AnswersBackup,
): Promise<void> {
  const db = await initializeDatabase();
  for (const answer of backup.answers) {
    // OR IGNORE skips rows that collide with the (questionId, answeredAt) unique
    // constraint, so re-importing the same backup is a safe no-op.
    await db.runAsync(
      'INSERT OR IGNORE INTO answers (questionId, selectedAnswer, isCorrect, answeredAt, answerHash, mode) VALUES (?, ?, ?, ?, ?, ?)',
      [
        answer.questionId,
        answer.selectedAnswer,
        answer.isCorrect ? 1 : 0,
        answer.answeredAt,
        answer.answerHash,
        answer.mode ?? null,
      ],
    );
  }
}
