/**
 * Receipts Registry Catalog
 * Domain: Business Law Accounting
 * Trust Level: SOVEREIGN — managed by Runtime
 */

export interface Receipt {
  id: string;
  receipt_type: 'state_change' | 'kernel_evaluation' | 'orchestrator_routing' | 'platform_emission' | 'trust_boundary' | 'typed_promotion' | 'advisory_intake' | 'voice_session' | 'language_normalization';
  operation: string;
  description: string;
  actor: string;
  actor_type: 'practitioner' | 'kernel' | 'orchestrator' | 'runtime' | 'voice_layer' | 'language_layer';
  target_id: string;
  target_type: string;
  source_kernel: 'business' | 'law' | 'accounting' | 'orchestrator';
  previous_state: string | null;
  new_state: string | null;
  payload_hash: string;
  parent_receipt_id: string | null;
  related_receipt_ids: string[];
  timestamp: string;
  replay_sequence: number;
  idempotency_key: string;
  notes: string;
  created_at: string;
  updated_at: string;
  status: 'emitted' | 'confirmed' | 'replayed' | 'voided';
}

export class ReceiptCatalog {
  private entries: Map<string, Receipt> = new Map();

  register(entry: Receipt): void {
    this.entries.set(entry.id, entry);
  }

  lookup(id: string): Receipt | undefined {
    return this.entries.get(id);
  }

  list(): Receipt[] {
    return Array.from(this.entries.values());
  }

  listByKernel(kernel: string): Receipt[] {
    return this.list().filter(e => e.source_kernel === kernel);
  }

  listByTarget(targetId: string): Receipt[] {
    return this.list().filter(e => e.target_id === targetId);
  }

  listByType(type: Receipt['receipt_type']): Receipt[] {
    return this.list().filter(e => e.receipt_type === type);
  }

  listByActor(actor: string): Receipt[] {
    return this.list().filter(e => e.actor === actor);
  }

  getChain(receiptId: string): Receipt[] {
    const chain: Receipt[] = [];
    let current = this.lookup(receiptId);
    while (current) {
      chain.unshift(current);
      current = current.parent_receipt_id ? this.lookup(current.parent_receipt_id) : undefined;
    }
    return chain;
  }

  listByReplaySequenceRange(start: number, end: number): Receipt[] {
    return this.list()
      .filter(e => e.replay_sequence >= start && e.replay_sequence <= end)
      .sort((a, b) => a.replay_sequence - b.replay_sequence);
  }
}
