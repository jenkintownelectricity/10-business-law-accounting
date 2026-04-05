/**
 * Forbidden Import Rules
 * Defines import paths that are FORBIDDEN from UI component code.
 * These rules are enforced by tests and should be validated in CI.
 */

export const FORBIDDEN_IMPORT_PATTERNS = [
  // No direct workflow execution from UI
  { pattern: '@10-bla/workflows', reason: 'UI must not import workflow executors directly' },
  { pattern: 'execution-spine', reason: 'UI must not import execution spine routes' },
  { pattern: 'platformClient', reason: 'UI must not import platform mutation clients' },
  { pattern: 'runWorkflow', reason: 'UI must not call runWorkflow directly' },
  { pattern: 'executeWorkflow', reason: 'UI must not call executeWorkflow directly' },
  { pattern: 'invokeKernel', reason: 'UI must not call invokeKernel directly' },
  // No direct kernel imports
  { pattern: 'Business-Kernel/src', reason: 'UI must not import kernel internals' },
  { pattern: 'Law-Kernel/src', reason: 'UI must not import kernel internals' },
  { pattern: 'Accounting-Kernel/src', reason: 'UI must not import kernel internals' },
] as const;

export type ForbiddenImportPattern = (typeof FORBIDDEN_IMPORT_PATTERNS)[number];
