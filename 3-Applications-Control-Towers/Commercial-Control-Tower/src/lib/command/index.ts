/**
 * Command Module Index
 * Re-exports from the canonical registry and ensures all handlers are registered.
 */

// Import handlers to trigger self-registration
import './handlers';

// Re-export canonical registry as the primary API
export {
  CommandRegistry,
  type CommandCategory,
  type TrustClass,
  type ExecutionClass,
  type FocusEffect,
  type ReceiptClass,
  type CommandContext,
  type CommandDefinition,
  type CommandResult,
} from './registry';

// Re-export context resolution
export { resolveCommandContext } from './contextResolver';

// Re-export mode conflict utilities
export { MODE_CONFLICTS, getConflict, type ModeConflict } from './modeConflicts';
