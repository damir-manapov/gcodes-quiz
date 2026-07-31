import * as SQLite from 'expo-sqlite';
import type { Language, LocalizedText } from '../i18n';
import type { AnswersBackup } from './backupFormat';
import { getQuestionsForQuiz, type QuizQuestion } from './questions';

const DB_NAME = 'gcodes-quiz.db';

export type StoredAnswer = {
  id: number;
  questionId: number;
  selectedAnswer: number;
  isCorrect: boolean;
  answeredAt: string;
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
            JSON.stringify(question.prompt),
            JSON.stringify(question.options),
            question.correctAnswer,
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

export async function getStoredQuestions(): Promise<QuizQuestion[]> {
  const db = await initializeDatabase();
  const rows = await db.getAllAsync<{
    id: number;
    prompt: string;
    options: string;
    correctAnswer: number;
    explanation: string;
    category: 'G' | 'M';
    topic: string;
    code: string | null;
  }>(
    'SELECT id, prompt, options, correctAnswer, explanation, category, topic, code FROM questions ORDER BY id ASC',
  );

  return rows.map((row) => ({
    id: row.id,
    prompt: JSON.parse(row.prompt) as LocalizedText,
    options: JSON.parse(row.options) as LocalizedText[],
    correctAnswer: row.correctAnswer,
    explanation: JSON.parse(row.explanation) as LocalizedText,
    category: row.category,
    topic: row.topic,
    ...(row.code ? { code: row.code } : {}),
  }));
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
): Promise<void> {
  const db = await initializeDatabase();
  await db.runAsync(
    'INSERT INTO answers (questionId, selectedAnswer, isCorrect, answeredAt) VALUES (?, ?, ?, ?)',
    [questionId, selectedAnswer, isCorrect ? 1 : 0, new Date().toISOString()],
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
  }>(
    'SELECT id, questionId, selectedAnswer, isCorrect, answeredAt FROM answers ORDER BY id ASC',
  );

  return rows.map((row) => ({
    id: row.id,
    questionId: row.questionId,
    selectedAnswer: row.selectedAnswer,
    isCorrect: row.isCorrect === 1,
    answeredAt: row.answeredAt,
  }));
}

export async function exportAnswersBackup(): Promise<AnswersBackup> {
  const answers = await getStoredAnswers();
  return {
    exportedAt: new Date().toISOString(),
    answers: answers.map((answer) => ({
      questionId: answer.questionId,
      selectedAnswer: answer.selectedAnswer,
      isCorrect: answer.isCorrect,
      answeredAt: answer.answeredAt,
    })),
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
      'INSERT OR IGNORE INTO answers (questionId, selectedAnswer, isCorrect, answeredAt) VALUES (?, ?, ?, ?)',
      [
        answer.questionId,
        answer.selectedAnswer,
        answer.isCorrect ? 1 : 0,
        answer.answeredAt,
      ],
    );
  }
}
