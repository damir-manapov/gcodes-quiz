# G-Code Quiz

A React Native Expo app for practicing CNC G-code quiz questions offline with a local in-app database.

## Features

- Practice CNC quiz questions for common G and M codes
- Local in-app SQLite storage for questions and your answer history
- Backup your answer history to a JSON file and share/save it
- Restore answers from a previously exported backup file
- TypeScript-based Expo app
- Vitest unit tests for quiz logic

## Tech Stack

- React Native + Expo
- TypeScript
- Expo SQLite
- Expo FileSystem, Expo Sharing, Expo DocumentPicker (backup/restore)
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

- src/app.tsx — main quiz UI, including backup/restore actions
- src/data/questions.ts — quiz question definitions
- src/data/database.ts — local SQLite initialization, question loading, and answer persistence
- src/data/backupFormat.ts — pure backup serialization/validation logic (unit tested)
- src/data/backup.ts — file export/share and import/pick logic using Expo FileSystem, Sharing, and DocumentPicker
- src/tests — Vitest test files
