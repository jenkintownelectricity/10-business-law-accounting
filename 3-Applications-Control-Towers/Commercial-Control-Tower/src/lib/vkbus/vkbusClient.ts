/**
 * VKBUS Client for Commercial Control Tower
 * ALL domain-affecting actions from the CCT route through this client.
 * The client emits typed signals to VKBUS for execution spine routing.
 */

export interface VkbusSignal {
  signal_id: string;
  signal_type: string;
  source_surface: 'COMMERCIAL_CONTROL_TOWER';
  payload: Record<string, unknown>;
  operator_id: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface VkbusEmitResult {
  success: boolean;
  signal_id: string;
  receipt_id?: string;
  error?: string;
}

export class VkbusClient {
  private signalLog: VkbusSignal[] = [];

  async emit(signal: Omit<VkbusSignal, 'signal_id' | 'timestamp' | 'source_surface'>): Promise<VkbusEmitResult> {
    const fullSignal: VkbusSignal = {
      ...signal,
      signal_id: `sig_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      source_surface: 'COMMERCIAL_CONTROL_TOWER',
      timestamp: new Date().toISOString(),
    };

    // Validate signal before emission
    const validation = this.validateSignal(fullSignal);
    if (!validation.valid) {
      return { success: false, signal_id: fullSignal.signal_id, error: validation.reason };
    }

    this.signalLog.push(fullSignal);

    // In production, this would POST to VKBUS endpoint
    return { success: true, signal_id: fullSignal.signal_id, receipt_id: `rcpt_${Date.now()}` };
  }

  async promoteGhost(proposalId: string, promotionType: string, targetKernel: string, operatorId: string): Promise<VkbusEmitResult> {
    return this.emit({
      signal_type: 'cct.ghost.promote',
      payload: { proposal_id: proposalId, promotion_type: promotionType, target_kernel: targetKernel },
      operator_id: operatorId,
    });
  }

  async dismissGhost(proposalId: string, operatorId: string): Promise<VkbusEmitResult> {
    return this.emit({
      signal_type: 'cct.ghost.dismiss',
      payload: { proposal_id: proposalId },
      operator_id: operatorId,
    });
  }

  async emitFocusChange(fromPane: string, toPane: string, reason: string, operatorId: string): Promise<VkbusEmitResult> {
    return this.emit({
      signal_type: 'cct.focus.change',
      payload: { from_pane: fromPane, to_pane: toPane, reason },
      operator_id: operatorId,
    });
  }

  async requestReview(entityType: string, entityId: string, operatorId: string): Promise<VkbusEmitResult> {
    return this.emit({
      signal_type: 'cct.review.request',
      payload: { entity_type: entityType, entity_id: entityId },
      operator_id: operatorId,
    });
  }

  async emitSearchQuery(query: string, operatorId: string): Promise<VkbusEmitResult> {
    return this.emit({
      signal_type: 'cct.search.query',
      payload: { query },
      operator_id: operatorId,
    });
  }

  async emitUiIntent(intentType: string, payload: Record<string, unknown>, operatorId: string): Promise<VkbusEmitResult> {
    return this.emit({
      signal_type: 'cct.ui.intent',
      payload: { intent_type: intentType, ...payload },
      operator_id: operatorId,
    });
  }

  getSignalLog(): VkbusSignal[] {
    return [...this.signalLog];
  }

  private validateSignal(signal: VkbusSignal): { valid: boolean; reason?: string } {
    if (!signal.signal_type) return { valid: false, reason: 'Missing signal_type' };
    if (!signal.operator_id) return { valid: false, reason: 'Missing operator_id' };
    if (!signal.payload) return { valid: false, reason: 'Missing payload' };
    if (signal.source_surface !== 'COMMERCIAL_CONTROL_TOWER') return { valid: false, reason: 'Invalid source_surface' };
    return { valid: true };
  }
}
