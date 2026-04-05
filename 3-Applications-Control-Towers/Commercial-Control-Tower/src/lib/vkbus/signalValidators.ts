/**
 * Signal Validators
 * Validation functions that reject malformed signal payloads before emission.
 * Each signal type has required fields that must be present and non-empty.
 */

import { CCT_SIGNAL_TYPES, type CctSignalType } from './signalTypeMap';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

type RequiredFieldsMap = Record<string, string[]>;

const REQUIRED_FIELDS_BY_TYPE: RequiredFieldsMap = {
  [CCT_SIGNAL_TYPES.GHOST_PROMOTE]: ['proposal_id', 'promotion_type', 'target_kernel'],
  [CCT_SIGNAL_TYPES.GHOST_DISMISS]: ['proposal_id'],
  [CCT_SIGNAL_TYPES.FOCUS_CHANGE]: ['from_pane', 'to_pane', 'reason'],
  [CCT_SIGNAL_TYPES.REVIEW_REQUEST]: ['entity_type', 'entity_id'],
  [CCT_SIGNAL_TYPES.SEARCH_QUERY]: ['query'],
  [CCT_SIGNAL_TYPES.MATTER_CREATE]: ['matter_name', 'matter_type', 'client_id'],
  [CCT_SIGNAL_TYPES.CONTRACT_REVIEW]: ['contract_id', 'review_type'],
  [CCT_SIGNAL_TYPES.INVOICE_PROCESS]: ['invoice_id', 'process_action'],
  [CCT_SIGNAL_TYPES.OBLIGATION_TRACK]: ['obligation_id', 'track_action'],
  [CCT_SIGNAL_TYPES.DICTATION_START]: ['session_id'],
  [CCT_SIGNAL_TYPES.LISTENING_START]: ['session_id'],
  [CCT_SIGNAL_TYPES.UI_INTENT]: ['intent_type'],
};

export function validateSignalPayload(
  signalType: CctSignalType,
  payload: Record<string, unknown>,
): ValidationResult {
  const errors: string[] = [];

  if (!signalType) {
    errors.push('signal_type is required');
    return { valid: false, errors };
  }

  if (!payload || typeof payload !== 'object') {
    errors.push('payload must be a non-null object');
    return { valid: false, errors };
  }

  const requiredFields = REQUIRED_FIELDS_BY_TYPE[signalType];
  if (!requiredFields) {
    errors.push(`Unknown signal type: ${signalType}`);
    return { valid: false, errors };
  }

  for (const field of requiredFields) {
    const value = payload[field];
    if (value === undefined || value === null) {
      errors.push(`Missing required field: ${field}`);
    } else if (typeof value === 'string' && value.trim() === '') {
      errors.push(`Required field must not be empty: ${field}`);
    }
  }

  return { valid: errors.length === 0, errors };
}

export function isValidSignalType(signalType: string): signalType is CctSignalType {
  return Object.values(CCT_SIGNAL_TYPES).includes(signalType as CctSignalType);
}
