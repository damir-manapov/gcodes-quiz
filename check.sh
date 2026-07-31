#!/bin/sh
set -e

echo "=== Format ==="
pnpm run format

echo "=== Lint ==="
pnpm exec biome check --error-on-warnings .

echo "=== Typecheck ==="
pnpm run typecheck

echo "=== Tests ==="
pnpm run test

echo "All checks passed"
