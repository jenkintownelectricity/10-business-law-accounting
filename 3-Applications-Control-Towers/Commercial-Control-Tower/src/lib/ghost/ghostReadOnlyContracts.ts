/**
 * Ghost Read-Only Contracts
 * Contract interfaces that ghost components must satisfy.
 * Ghost components only accept data — no mutation callbacks allowed.
 */

import { TruthDelta } from './calculateTruthDelta';

/**
 * ReadOnlyGhostProps
 * Base interface for all ghost layer components.
 * Accepts ONLY data inputs — no mutation callbacks, no event emitters,
 * no dispatch functions.
 */
export interface ReadOnlyGhostProps {
  /** Truth deltas to render */
  readonly deltas: ReadonlyArray<TruthDelta>;
  /** Whether the ghost layer is currently visible */
  readonly visible: boolean;
  /** Entity ID this ghost overlay targets */
  readonly entityId: string;
  /** Entity type for rendering context */
  readonly entityType: string;
}

/**
 * GhostViolationProps
 * Props for violation overlay components. Read-only.
 */
export interface GhostViolationProps extends ReadOnlyGhostProps {
  /** Only critical/violated deltas */
  readonly violations: ReadonlyArray<TruthDelta>;
  /** Whether ghost lock is engaged */
  readonly ghostLocked: boolean;
}

/**
 * GhostHistoryProps
 * Props for history trail components. Read-only.
 */
export interface GhostHistoryProps extends ReadOnlyGhostProps {
  /** Historical snapshots for the entity */
  readonly history: ReadonlyArray<GhostHistoryEntry>;
}

export interface GhostHistoryEntry {
  readonly timestamp: string;
  readonly field: string;
  readonly previous_value: unknown;
  readonly new_value: unknown;
  readonly source: string;
}

/**
 * GhostLockProps
 * Props for ghost lock boundary. Read-only data, local-only freeze.
 */
export interface GhostLockProps {
  /** Whether editing is frozen locally */
  readonly locked: boolean;
  /** Reason for the lock */
  readonly lockReason: string;
  /** Children to render inside the lock boundary */
  readonly children: React.ReactNode;
}

/**
 * Type guard to enforce that ghost props contain no functions.
 * Used at development time to validate component contracts.
 */
export function assertReadOnly<T extends Record<string, unknown>>(props: T): void {
  for (const key of Object.keys(props)) {
    if (typeof props[key] === 'function') {
      throw new Error(
        `Ghost component contract violation: prop "${key}" is a function. Ghost components must be read-only.`,
      );
    }
  }
}
