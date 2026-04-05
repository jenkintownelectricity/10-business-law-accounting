/**
 * Pinned Evidence Store
 * Operator may pin raw evidence while reviewing.
 * Pinned evidence becomes SECONDARY_CONTEXT and remains visible.
 * Summaries may NOT displace pinned evidence.
 */

export interface PinnedEvidence {
  pin_id: string;
  entity_id: string;
  entity_type: string;
  label: string;
  content_ref: string;
  pinned_at: string;
  pinned_by: string;
  stable_reference: boolean;
}

export class PinnedEvidenceStore {
  private pins: PinnedEvidence[] = [];

  pin(evidence: Omit<PinnedEvidence, 'pin_id' | 'pinned_at' | 'stable_reference'>): PinnedEvidence {
    const pin: PinnedEvidence = {
      ...evidence,
      pin_id: `pin_${Date.now()}`,
      pinned_at: new Date().toISOString(),
      stable_reference: true,
    };
    this.pins.push(pin);
    return pin;
  }

  unpin(pinId: string): void {
    this.pins = this.pins.filter(p => p.pin_id !== pinId);
  }

  getPins(): PinnedEvidence[] {
    return [...this.pins];
  }

  isPinned(entityId: string): boolean {
    return this.pins.some(p => p.entity_id === entityId);
  }

  canDisplace(entityId: string): boolean {
    // Pinned evidence CANNOT be displaced by AI summary
    return !this.isPinned(entityId);
  }
}
