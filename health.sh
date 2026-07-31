#!/bin/sh
set -e

echo "=== Gitleaks (history) ==="
if ! command -v gitleaks >/dev/null 2>&1; then
  echo "gitleaks is not installed. Install it from https://github.com/gitleaks/gitleaks"
  exit 1
fi
gitleaks git . -v

echo "=== Gitleaks (working tree) ==="
gitleaks dir . -v

echo "=== Expo-managed dependency versions ==="
pnpm exec expo install --check

echo "=== Other dependency versions ==="
if pnpm outdated vitest @types/react @biomejs/biome simple-git-hooks; then
  echo "Dependencies are up to date"
else
  echo "Outdated dependencies found"
  exit 1
fi

echo "=== Vulnerabilities ==="
pnpm audit

echo "All health checks passed"
