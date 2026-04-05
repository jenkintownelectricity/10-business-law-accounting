/**
 * Command Handlers Index
 * Importing this module causes all command handlers to self-register
 * with the canonical CommandRegistry.
 */

import './focusHandlers';
import './ghostHandlers';
import './navigationHandlers';
import './systemHandlers';

// Re-export handler-specific instances for direct access if needed
export { focusStore } from './focusHandlers';
export { vkbusClient } from './ghostHandlers';
