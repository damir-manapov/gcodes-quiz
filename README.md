# G-Code Quiz

A React Native Expo app for practicing CNC G-code quiz questions offline with a local in-app database.

## Features

- Practice CNC quiz questions for common G and M codes
- Local in-app SQLite storage for questions
- TypeScript-based Expo app
- Vitest unit tests for quiz logic

## Tech Stack

- React Native + Expo
- TypeScript
- Expo SQLite
- pnpm
- Vitest

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

## Project Structure

- src/app.tsx — main quiz UI
- src/data/questions.ts — quiz question definitions
- src/data/database.ts — local SQLite initialization and loading
- src/tests — Vitest test files
