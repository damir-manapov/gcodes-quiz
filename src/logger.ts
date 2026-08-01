// Central place for logging non-fatal errors so failures aren't silently
// swallowed. Doesn't rethrow: callers decide how (or whether) to surface the
// failure to the user.
export function logError(context: string, error: unknown): void {
  console.error(`[gcodes-quiz] ${context}`, error);
}
