import * as SQLite from 'expo-sqlite';
import { getQuestionsForQuiz, type QuizQuestion } from './questions';

const DB_NAME = 'gcodes-quiz.db';

export async function openDatabase() {
  return SQLite.openDatabaseAsync(DB_NAME);
}

export async function initializeDatabase() {
  const db = await openDatabase();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY NOT NULL,
      prompt TEXT NOT NULL,
      options TEXT NOT NULL,
      correctAnswer INTEGER NOT NULL,
      explanation TEXT NOT NULL
    );
  `);

  const existingCount = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM questions');
  if (existingCount?.count === 0) {
    const questions = getQuestionsForQuiz();
    for (const question of questions) {
      await db.runAsync(
        'INSERT INTO questions (id, prompt, options, correctAnswer, explanation) VALUES (?, ?, ?, ?, ?)',
        [question.id, question.prompt, JSON.stringify(question.options), question.correctAnswer, question.explanation],
      );
    }
  }

  return db;
}

export async function getStoredQuestions(): Promise<QuizQuestion[]> {
  const db = await initializeDatabase();
  const rows = await db.getAllAsync<{ id: number; prompt: string; options: string; correctAnswer: number; explanation: string }>(
    'SELECT id, prompt, options, correctAnswer, explanation FROM questions ORDER BY id ASC',
  );

  return rows.map((row) => ({
    id: row.id,
    prompt: row.prompt,
    options: JSON.parse(row.options) as string[],
    correctAnswer: row.correctAnswer,
    explanation: row.explanation,
  }));
}
