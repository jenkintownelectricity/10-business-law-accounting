import { EphemeralProposal, ProposalStatus } from './ephemeralTypes';

export class ProposalBufferStore {
  private proposals: Map<string, EphemeralProposal> = new Map();

  add(proposal: EphemeralProposal): void {
    // Status always begins as PROPOSED
    proposal.status = 'PROPOSED';
    proposal.trustState = 'UNPROMOTED';
    this.proposals.set(proposal.id, proposal);
  }

  get(id: string): EphemeralProposal | undefined {
    return this.proposals.get(id);
  }

  getActive(): EphemeralProposal[] {
    return Array.from(this.proposals.values()).filter(p =>
      p.status !== 'DISMISSED' && p.status !== 'EXPIRED' && p.status !== 'PROMOTED'
    );
  }

  promote(id: string): boolean {
    const p = this.proposals.get(id);
    if (!p) return false;
    // Promotion requires explicit event — no auto-solidification
    p.status = 'PROMOTED';
    p.trustState = 'PROMOTION_REQUESTED';
    return true;
  }

  dismiss(id: string): void {
    const p = this.proposals.get(id);
    if (p) {
      p.status = 'DISMISSED';
      // Dismiss is UI lifecycle only, not truth mutation
    }
  }

  setHovered(id: string, hovered: boolean): void {
    const p = this.proposals.get(id);
    if (p) p.hovered = hovered;
  }

  setSelected(id: string, selected: boolean): void {
    const p = this.proposals.get(id);
    if (p) p.selected = selected;
  }

  /** Check and expire proposals based on TTL governance */
  tickTTL(now: number): string[] {
    const expired: string[] = [];
    for (const [id, p] of this.proposals) {
      if (p.status === 'DISMISSED' || p.status === 'EXPIRED' || p.status === 'PROMOTED') continue;
      if (this.shouldPauseTTL(p)) continue;
      if (now - p.created_at > p.ttl_ms) {
        p.status = 'EXPIRED';
        expired.push(id);
      }
    }
    return expired;
  }

  private shouldPauseTTL(p: EphemeralProposal): boolean {
    if (p.confidence >= 0.75) return true;
    if (p.violationState !== 'NONE') return true;
    if (p.hovered) return true;
    if (p.selected) return true;
    if (p.focus_owner_active) return true;
    return false;
  }
}
