/**
 * Matter State Transitions
 * Domain: Business Law Accounting
 *
 * State machine for matter lifecycle with typed transition rules and validation.
 *
 * States: DRAFT -> INTAKE -> UNDER_REVIEW -> ACTIVE -> ON_HOLD -> RESOLVED -> CLOSED -> ARCHIVED
 */

export type MatterState =
  | 'draft'
  | 'intake'
  | 'under_review'
  | 'active'
  | 'on_hold'
  | 'resolved'
  | 'closed'
  | 'archived';

export interface TransitionRule {
  from: MatterState;
  to: MatterState;
  requires_practitioner: boolean;
  requires_kernel_approval: ('business' | 'law' | 'accounting')[];
  validation_description: string;
}

export interface MatterTransitionResult {
  allowed: boolean;
  from: MatterState;
  to: MatterState;
  rule: TransitionRule | null;
  reason: string;
}

/**
 * All valid transition rules for matter state machine.
 */
const TRANSITION_RULES: TransitionRule[] = [
  // DRAFT transitions
  {
    from: 'draft',
    to: 'intake',
    requires_practitioner: true,
    requires_kernel_approval: [],
    validation_description: 'Matter submitted for intake processing.',
  },
  {
    from: 'draft',
    to: 'archived',
    requires_practitioner: true,
    requires_kernel_approval: [],
    validation_description: 'Draft matter discarded and archived.',
  },

  // INTAKE transitions
  {
    from: 'intake',
    to: 'under_review',
    requires_practitioner: true,
    requires_kernel_approval: [],
    validation_description: 'Intake complete. Matter sent for kernel review.',
  },
  {
    from: 'intake',
    to: 'draft',
    requires_practitioner: true,
    requires_kernel_approval: [],
    validation_description: 'Matter returned to draft for additional information.',
  },
  {
    from: 'intake',
    to: 'archived',
    requires_practitioner: true,
    requires_kernel_approval: [],
    validation_description: 'Matter rejected during intake and archived.',
  },

  // UNDER_REVIEW transitions
  {
    from: 'under_review',
    to: 'active',
    requires_practitioner: true,
    requires_kernel_approval: ['business', 'law'],
    validation_description: 'Matter reviewed and approved. At least business and law kernels must acknowledge.',
  },
  {
    from: 'under_review',
    to: 'intake',
    requires_practitioner: true,
    requires_kernel_approval: [],
    validation_description: 'Matter returned to intake for additional information.',
  },
  {
    from: 'under_review',
    to: 'on_hold',
    requires_practitioner: true,
    requires_kernel_approval: [],
    validation_description: 'Matter placed on hold during review.',
  },
  {
    from: 'under_review',
    to: 'archived',
    requires_practitioner: true,
    requires_kernel_approval: [],
    validation_description: 'Matter rejected during review and archived.',
  },

  // ACTIVE transitions
  {
    from: 'active',
    to: 'on_hold',
    requires_practitioner: true,
    requires_kernel_approval: [],
    validation_description: 'Active matter placed on hold.',
  },
  {
    from: 'active',
    to: 'resolved',
    requires_practitioner: true,
    requires_kernel_approval: ['business', 'law', 'accounting'],
    validation_description: 'Matter resolved. All three kernels must confirm resolution.',
  },
  {
    from: 'active',
    to: 'under_review',
    requires_practitioner: true,
    requires_kernel_approval: [],
    validation_description: 'Active matter returned to review for reassessment.',
  },

  // ON_HOLD transitions
  {
    from: 'on_hold',
    to: 'active',
    requires_practitioner: true,
    requires_kernel_approval: [],
    validation_description: 'Matter reactivated from hold.',
  },
  {
    from: 'on_hold',
    to: 'resolved',
    requires_practitioner: true,
    requires_kernel_approval: ['business', 'law', 'accounting'],
    validation_description: 'Held matter resolved. All three kernels must confirm.',
  },
  {
    from: 'on_hold',
    to: 'closed',
    requires_practitioner: true,
    requires_kernel_approval: ['business', 'law'],
    validation_description: 'Held matter closed without resolution.',
  },
  {
    from: 'on_hold',
    to: 'archived',
    requires_practitioner: true,
    requires_kernel_approval: [],
    validation_description: 'Held matter archived.',
  },

  // RESOLVED transitions
  {
    from: 'resolved',
    to: 'closed',
    requires_practitioner: true,
    requires_kernel_approval: ['accounting'],
    validation_description: 'Resolved matter closed. Accounting kernel must confirm final financial treatment.',
  },
  {
    from: 'resolved',
    to: 'active',
    requires_practitioner: true,
    requires_kernel_approval: [],
    validation_description: 'Resolution reversed. Matter reactivated.',
  },

  // CLOSED transitions
  {
    from: 'closed',
    to: 'archived',
    requires_practitioner: true,
    requires_kernel_approval: [],
    validation_description: 'Closed matter archived for long-term storage.',
  },
  {
    from: 'closed',
    to: 'active',
    requires_practitioner: true,
    requires_kernel_approval: ['business', 'law'],
    validation_description: 'Closed matter reopened. Business and law kernels must approve.',
  },
];

export class MatterStateMachine {
  private rules: TransitionRule[];

  constructor() {
    this.rules = TRANSITION_RULES;
  }

  /**
   * Attempts a state transition and returns the result.
   */
  transition(from: MatterState, to: MatterState): MatterTransitionResult {
    const rule = this.rules.find(r => r.from === from && r.to === to);

    if (!rule) {
      return {
        allowed: false,
        from,
        to,
        rule: null,
        reason: `No transition rule exists from '${from}' to '${to}'.`,
      };
    }

    return {
      allowed: true,
      from,
      to,
      rule,
      reason: rule.validation_description,
    };
  }

  /**
   * Returns all valid target states from the current state.
   */
  getAvailableTransitions(from: MatterState): MatterState[] {
    return this.rules.filter(r => r.from === from).map(r => r.to);
  }

  /**
   * Returns all transition rules for a given source state.
   */
  getTransitionRules(from: MatterState): TransitionRule[] {
    return this.rules.filter(r => r.from === from);
  }

  /**
   * Checks if a transition is valid without performing it.
   */
  canTransition(from: MatterState, to: MatterState): boolean {
    return this.rules.some(r => r.from === from && r.to === to);
  }

  /**
   * Returns all defined transition rules.
   */
  getAllRules(): TransitionRule[] {
    return [...this.rules];
  }
}
