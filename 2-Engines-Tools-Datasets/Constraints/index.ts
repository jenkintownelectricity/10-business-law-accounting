/**
 * Constraints Index
 * Domain: Business Law Accounting
 *
 * Re-exports all constraint families for unified access.
 */

export * as BusinessConstraints from './Business-Constraints/constraints';
export * as LawConstraints from './Law-Constraints/constraints';
export * as AccountingConstraints from './Accounting-Constraints/constraints';
export * as CrossDomainConstraints from './Cross-Domain-Constraints/constraints';
export * as VoiceLanguageConstraints from './Voice-Language-Constraints/constraints';

// Re-export shared types from the canonical source
export type { ConstraintResult, ConstraintEvaluation } from './Business-Constraints/constraints';
