/**
 * Signal Factory
 * Factory functions for creating typed CCT signals with proper payloads.
 * Each factory ensures the signal has the correct structure before emission.
 */

import { CCT_SIGNAL_TYPES, type CctSignalType } from './signalTypeMap';

export interface SignalPayload {
  signal_type: CctSignalType;
  payload: Record<string, unknown>;
  operator_id: string;
  metadata?: Record<string, unknown>;
}

export function createGhostPromoteSignal(
  proposalId: string,
  promotionType: string,
  targetKernel: string,
  operatorId: string,
): SignalPayload {
  return {
    signal_type: CCT_SIGNAL_TYPES.GHOST_PROMOTE,
    payload: { proposal_id: proposalId, promotion_type: promotionType, target_kernel: targetKernel },
    operator_id: operatorId,
  };
}

export function createGhostDismissSignal(proposalId: string, operatorId: string): SignalPayload {
  return {
    signal_type: CCT_SIGNAL_TYPES.GHOST_DISMISS,
    payload: { proposal_id: proposalId },
    operator_id: operatorId,
  };
}

export function createFocusChangeSignal(
  fromPane: string,
  toPane: string,
  reason: string,
  operatorId: string,
): SignalPayload {
  return {
    signal_type: CCT_SIGNAL_TYPES.FOCUS_CHANGE,
    payload: { from_pane: fromPane, to_pane: toPane, reason },
    operator_id: operatorId,
  };
}

export function createReviewRequestSignal(
  entityType: string,
  entityId: string,
  operatorId: string,
): SignalPayload {
  return {
    signal_type: CCT_SIGNAL_TYPES.REVIEW_REQUEST,
    payload: { entity_type: entityType, entity_id: entityId },
    operator_id: operatorId,
  };
}

export function createSearchQuerySignal(query: string, operatorId: string): SignalPayload {
  return {
    signal_type: CCT_SIGNAL_TYPES.SEARCH_QUERY,
    payload: { query },
    operator_id: operatorId,
  };
}

export function createMatterCreateSignal(
  matterName: string,
  matterType: string,
  clientId: string,
  operatorId: string,
): SignalPayload {
  return {
    signal_type: CCT_SIGNAL_TYPES.MATTER_CREATE,
    payload: { matter_name: matterName, matter_type: matterType, client_id: clientId },
    operator_id: operatorId,
  };
}

export function createContractReviewSignal(
  contractId: string,
  reviewType: string,
  operatorId: string,
): SignalPayload {
  return {
    signal_type: CCT_SIGNAL_TYPES.CONTRACT_REVIEW,
    payload: { contract_id: contractId, review_type: reviewType },
    operator_id: operatorId,
  };
}

export function createInvoiceProcessSignal(
  invoiceId: string,
  processAction: string,
  operatorId: string,
): SignalPayload {
  return {
    signal_type: CCT_SIGNAL_TYPES.INVOICE_PROCESS,
    payload: { invoice_id: invoiceId, process_action: processAction },
    operator_id: operatorId,
  };
}

export function createObligationTrackSignal(
  obligationId: string,
  trackAction: string,
  operatorId: string,
): SignalPayload {
  return {
    signal_type: CCT_SIGNAL_TYPES.OBLIGATION_TRACK,
    payload: { obligation_id: obligationId, track_action: trackAction },
    operator_id: operatorId,
  };
}

export function createDictationStartSignal(
  sessionId: string,
  operatorId: string,
): SignalPayload {
  return {
    signal_type: CCT_SIGNAL_TYPES.DICTATION_START,
    payload: { session_id: sessionId },
    operator_id: operatorId,
  };
}

export function createListeningStartSignal(
  sessionId: string,
  operatorId: string,
): SignalPayload {
  return {
    signal_type: CCT_SIGNAL_TYPES.LISTENING_START,
    payload: { session_id: sessionId },
    operator_id: operatorId,
  };
}

export function createUiIntentSignal(
  intentType: string,
  intentPayload: Record<string, unknown>,
  operatorId: string,
): SignalPayload {
  return {
    signal_type: CCT_SIGNAL_TYPES.UI_INTENT,
    payload: { intent_type: intentType, ...intentPayload },
    operator_id: operatorId,
  };
}
