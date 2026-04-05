export type ProposalStatus = 'PROPOSED' | 'PREVIEWED' | 'PROMOTED' | 'DISMISSED' | 'EXPIRED';
export type TrustState = 'UNPROMOTED' | 'PROMOTION_REQUESTED' | 'PROMOTED' | 'REJECTED';
export type ViolationState = 'NONE' | 'WARNING' | 'CRITICAL';

export interface EphemeralProposal {
  id: string;
  source: string;
  source_type: 'iron_ear' | 'language_layer' | 'ai_assistant' | 'voice_command';
  content: Record<string, unknown>;
  confidence: number;
  route_suggestion: string;
  target_kernel?: string;
  status: ProposalStatus;
  trustState: TrustState;
  violationState: ViolationState;
  ttl_ms: number;
  created_at: number;
  hovered: boolean;
  selected: boolean;
  focus_owner_active: boolean;
}
