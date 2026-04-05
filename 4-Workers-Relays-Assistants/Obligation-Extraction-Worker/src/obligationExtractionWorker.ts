/**
 * Obligation-Extraction-Worker
 *
 * Parses contracts for obligation clauses, creates typed Obligation records,
 * sets deadline tracking, evaluates legal constraints.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ObligationType =
  | 'performance'
  | 'payment'
  | 'delivery'
  | 'compliance'
  | 'reporting'
  | 'confidentiality'
  | 'indemnification'
  | 'warranty'
  | 'other';

export type ObligationStatus =
  | 'identified'
  | 'active'
  | 'fulfilled'
  | 'breached'
  | 'waived'
  | 'expired';

export interface ObligationRecord {
  obligation_id: string;
  contract_id: string;
  matter_id: string;
  clause_reference: string;
  description: string;
  obligation_type: ObligationType;
  obligated_party: string;
  beneficiary_party: string;
  status: ObligationStatus;
  deadline?: string;
  recurring: boolean;
  recurrence_pattern?: string;
  legal_constraints: LegalConstraintResult[];
  created_at: string;
  updated_at: string;
}

export interface ExtractionInput {
  contract_id: string;
  matter_id: string;
  contract_text: string;
  parties: string[];
}

export interface LegalConstraintResult {
  constraint_name: string;
  passed: boolean;
  message: string;
}

export interface ExtractionResult {
  obligations: ObligationRecord[];
  extraction_summary: {
    total_found: number;
    by_type: Record<string, number>;
    constraint_violations: number;
  };
  receipt_id: string;
}

export interface ExtractionReceipt {
  receipt_id: string;
  domain: 'business-law-accounting';
  action: 'obligation_extraction';
  source_kernel: 'law';
  entity_type: 'obligation_set';
  entity_id: string;
  details: Record<string, unknown>;
  timestamp: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generateId(prefix: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${random}`;
}

// ---------------------------------------------------------------------------
// Obligation patterns
// ---------------------------------------------------------------------------

interface ObligationPattern {
  regex: RegExp;
  type: ObligationType;
  label: string;
}

const OBLIGATION_PATTERNS: ObligationPattern[] = [
  { regex: /shall\s+pay|agrees?\s+to\s+pay|payment\s+of/gi, type: 'payment', label: 'payment' },
  { regex: /shall\s+deliver|agrees?\s+to\s+deliver|delivery\s+of/gi, type: 'delivery', label: 'delivery' },
  { regex: /shall\s+perform|agrees?\s+to\s+perform|performance\s+of/gi, type: 'performance', label: 'performance' },
  { regex: /shall\s+comply|must\s+comply|compliance\s+with/gi, type: 'compliance', label: 'compliance' },
  { regex: /shall\s+report|agrees?\s+to\s+report|reporting\s+requirement/gi, type: 'reporting', label: 'reporting' },
  { regex: /confidential|non-disclosure|shall\s+not\s+disclose/gi, type: 'confidentiality', label: 'confidentiality' },
  { regex: /indemnif|hold\s+harmless/gi, type: 'indemnification', label: 'indemnification' },
  { regex: /warrant|guarantee/gi, type: 'warranty', label: 'warranty' },
];

// ---------------------------------------------------------------------------
// Constraint evaluation
// ---------------------------------------------------------------------------

function evaluateLegalConstraints(obligation: Partial<ObligationRecord>): LegalConstraintResult[] {
  const results: LegalConstraintResult[] = [];

  // Constraint: obligation must have a description
  results.push({
    constraint_name: 'description_present',
    passed: !!obligation.description && obligation.description.length > 0,
    message: obligation.description ? 'Description present' : 'Obligation lacks description',
  });

  // Constraint: party identification
  results.push({
    constraint_name: 'party_identified',
    passed: !!obligation.obligated_party && obligation.obligated_party !== 'TBD',
    message: obligation.obligated_party && obligation.obligated_party !== 'TBD'
      ? 'Obligated party identified'
      : 'Obligated party not yet identified — requires review',
  });

  // Constraint: deadline for time-sensitive types
  const timeSensitiveTypes: ObligationType[] = ['payment', 'delivery', 'reporting'];
  if (timeSensitiveTypes.includes(obligation.obligation_type!)) {
    results.push({
      constraint_name: 'deadline_for_time_sensitive',
      passed: !!obligation.deadline,
      message: obligation.deadline
        ? 'Deadline set for time-sensitive obligation'
        : 'Time-sensitive obligation lacks deadline — requires review',
    });
  }

  return results;
}

// ---------------------------------------------------------------------------
// Worker
// ---------------------------------------------------------------------------

export class ObligationExtractionWorker {
  private receipts: ExtractionReceipt[] = [];

  /**
   * Extract obligations from contract text.
   */
  async extractObligations(input: ExtractionInput): Promise<ExtractionResult> {
    const now = new Date().toISOString();
    const receiptId = generateId('RCT');
    const obligations: ObligationRecord[] = [];
    const byType: Record<string, number> = {};

    for (const pattern of OBLIGATION_PATTERNS) {
      let match: RegExpExecArray | null;
      // Reset regex state
      pattern.regex.lastIndex = 0;
      while ((match = pattern.regex.exec(input.contract_text)) !== null) {
        const start = Math.max(0, match.index - 80);
        const end = Math.min(input.contract_text.length, match.index + 200);
        const context = input.contract_text.substring(start, end).trim();

        const obligatedParty = input.parties.length > 0 ? input.parties[0] : 'TBD';
        const beneficiaryParty = input.parties.length > 1 ? input.parties[1] : 'TBD';

        const partial: Partial<ObligationRecord> = {
          description: context,
          obligation_type: pattern.type,
          obligated_party: obligatedParty,
          deadline: undefined,
        };

        const constraints = evaluateLegalConstraints(partial);

        obligations.push({
          obligation_id: generateId('OBL'),
          contract_id: input.contract_id,
          matter_id: input.matter_id,
          clause_reference: `char_offset:${match.index}`,
          description: context,
          obligation_type: pattern.type,
          obligated_party: obligatedParty,
          beneficiary_party: beneficiaryParty,
          status: 'identified',
          recurring: false,
          legal_constraints: constraints,
          created_at: now,
          updated_at: now,
        });

        byType[pattern.type] = (byType[pattern.type] ?? 0) + 1;
      }
    }

    const constraintViolations = obligations.reduce(
      (count, o) => count + o.legal_constraints.filter((c) => !c.passed).length,
      0,
    );

    const receipt: ExtractionReceipt = {
      receipt_id: receiptId,
      domain: 'business-law-accounting',
      action: 'obligation_extraction',
      source_kernel: 'law',
      entity_type: 'obligation_set',
      entity_id: input.contract_id,
      details: {
        matter_id: input.matter_id,
        total_obligations: obligations.length,
        by_type: byType,
        constraint_violations: constraintViolations,
      },
      timestamp: now,
    };
    this.receipts.push(receipt);

    return {
      obligations,
      extraction_summary: {
        total_found: obligations.length,
        by_type: byType,
        constraint_violations: constraintViolations,
      },
      receipt_id: receiptId,
    };
  }

  /**
   * Set a deadline on an obligation record.
   */
  setDeadline(obligation: ObligationRecord, deadline: string): ObligationRecord {
    return {
      ...obligation,
      deadline,
      updated_at: new Date().toISOString(),
    };
  }

  /**
   * Update obligation status.
   */
  updateStatus(obligation: ObligationRecord, status: ObligationStatus): ObligationRecord {
    return {
      ...obligation,
      status,
      updated_at: new Date().toISOString(),
    };
  }

  getReceipts(): ExtractionReceipt[] {
    return [...this.receipts];
  }
}
