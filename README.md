# G-Code Quiz

A React Native Expo app for practicing CNC G-code quiz questions offline with a local in-app database.

## Features

- Practice 60+ quiz questions covering common G and M codes, tagged by category and topic
- Two quiz modes: Code → Meaning (what does this code do) and Action → Code (which code performs this action)
- English and Russian interface and quiz content, with a language toggle in the app
- Choose how questions are ordered each session: random, weakest first, longest since answered, or least answered
- Questions and answer options are shuffled each session, with extra wrong-answer choices pooled in from the rest of the question bank
- Adapts to you: wrong answers you tend to pick for a question are more likely to be offered again, so you get more practice on your actual mistakes
- Local in-app SQLite storage for questions, your answer history, and language preference
- Stats view showing overall accuracy, accuracy by topic, and your weakest questions
- Backup your answer history to a JSON file and share/save it
- Restore answers from a previously exported backup file
- TypeScript-based Expo app
- Vitest unit tests for quiz logic

## Tech Stack

- React Native + Expo
- TypeScript
- Expo SQLite
- Expo FileSystem (backup/restore, including its built-in file picker), Expo Sharing
- pnpm
- Vitest
- Biome (lint/format)

## Getting Started

1. Install dependencies
   ```bash
   pnpm install
   ```
2. Start the app
   ```bash
   pnpm start
   ```
3. Run tests
   ```bash
   pnpm test
   ```

## Checks

- `bash check.sh` — format, lint, typecheck, tests
- `bash health.sh` — secret scanning (requires [gitleaks](https://github.com/gitleaks/gitleaks) installed locally), dependency freshness, vulnerability audit
- `bash all-checks.sh` — runs both; also runs automatically as a pre-commit hook

## Project Structure

- src/app.tsx — main quiz UI, including the stats view, language toggle, and backup/restore actions
- src/i18n.ts — language types, `localize()` helper, and English/Russian UI string dictionaries
- src/data/questions.ts — quiz question definitions (with category/topic metadata and `{en, ru}` localized prompt/options/explanation)
- src/data/quizLogic.ts — pure shuffle, progress, and stats computation logic (unit tested)
- src/data/database.ts — local SQLite initialization, question loading, answer persistence, and language preference storage
- src/data/backupFormat.ts — pure backup serialization/validation logic (unit tested)
- src/data/backup.ts — file export/share and import/pick logic using Expo FileSystem and Sharing
- src/tests — Vitest test files
