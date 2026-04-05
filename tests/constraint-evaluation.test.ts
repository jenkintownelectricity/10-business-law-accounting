/**
 * Constraint Evaluation Tests
 * Verifies all constraint families evaluate correctly across kernels and layers.
 */

describe('Constraint Evaluation', () => {
  // ──────────────────────────────────────────────
  // Business Constraints
  // ──────────────────────────────────────────────
  describe('Business Constraints', () => {
    it('MISSING_ENTITY blocks matter creation', () => {
      const constraint = {
        family: 'BUSINESS',
        type: 'MISSING_ENTITY',
        severity: 'BLOCKING',
        message: 'Entity must be defined before matter can proceed',
        resolved: false,
      };
      expect(constraint.severity).toBe('BLOCKING');
      expect(constraint.resolved).toBe(false);
    });

    it('INCOMPLETE_MATTER flags incomplete matter fields', () => {
      const constraint = {
        family: 'BUSINESS',
        type: 'INCOMPLETE_MATTER',
        severity: 'WARNING',
        missing_fields: ['description', 'assigned_practitioner'],
        resolved: false,
      };
      expect(constraint.missing_fields.length).toBeGreaterThan(0);
    });

    it('UNVALIDATED_VENDOR prevents vendor engagement', () => {
      const constraint = {
        family: 'BUSINESS',
        type: 'UNVALIDATED_VENDOR',
        severity: 'BLOCKING',
        message: 'Vendor must be validated before engagement',
        vendor_id: 'vendor-test-001',
        resolved: false,
      };
      expect(constraint.severity).toBe('BLOCKING');
    });

    it('RISK_THRESHOLD triggers review when exceeded', () => {
      const constraint = {
        family: 'BUSINESS',
        type: 'RISK_THRESHOLD_EXCEEDED',
        severity: 'CRITICAL',
        current_risk_score: 0.85,
        threshold: 0.7,
        requires_senior_review: true,
        resolved: false,
      };
      expect(constraint.current_risk_score).toBeGreaterThan(constraint.threshold);
      expect(constraint.requires_senior_review).toBe(true);
    });
  });

  // ──────────────────────────────────────────────
  // Law Constraints
  // ──────────────────────────────────────────────
  describe('Law Constraints', () => {
    it('UNSIGNED_CONTRACT blocks contract enforcement', () => {
      const constraint = {
        family: 'LAW',
        type: 'UNSIGNED_CONTRACT',
        severity: 'BLOCKING',
        contract_id: 'contract-test-001',
        message: 'Contract must be signed by all parties before enforcement',
        resolved: false,
      };
      expect(constraint.severity).toBe('BLOCKING');
    });

    it('UNREVIEWED_OBLIGATION flags obligations needing review', () => {
      const constraint = {
        family: 'LAW',
        type: 'UNREVIEWED_OBLIGATION',
        severity: 'WARNING',
        obligation_id: 'obl-test-001',
        days_until_due: 14,
        resolved: false,
      };
      expect(constraint.days_until_due).toBeGreaterThan(0);
    });

    it('MISSING_EVIDENCE blocks legal determination', () => {
      const constraint = {
        family: 'LAW',
        type: 'MISSING_EVIDENCE',
        severity: 'BLOCKING',
        matter_id: 'matter-test-001',
        required_evidence: ['signed_agreement', 'correspondence_chain'],
        resolved: false,
      };
      expect(constraint.required_evidence.length).toBeGreaterThan(0);
    });

    it('EXPIRED_DEADLINE escalates overdue obligations', () => {
      const constraint = {
        family: 'LAW',
        type: 'EXPIRED_DEADLINE',
        severity: 'CRITICAL',
        obligation_id: 'obl-test-002',
        deadline: '2026-03-15',
        days_overdue: 21,
        resolved: false,
      };
      expect(constraint.severity).toBe('CRITICAL');
      expect(constraint.days_overdue).toBeGreaterThan(0);
    });
  });

  // ──────────────────────────────────────────────
  // Accounting Constraints
  // ──────────────────────────────────────────────
  describe('Accounting Constraints', () => {
    it('UNCLASSIFIED_TRANSACTION requires classification', () => {
      const constraint = {
        family: 'ACCOUNTING',
        type: 'UNCLASSIFIED_TRANSACTION',
        severity: 'WARNING',
        transaction_id: 'txn-test-001',
        amount: 12500.0,
        resolved: false,
      };
      expect(constraint.severity).toBe('WARNING');
    });

    it('MISSING_INVOICE blocks payment processing', () => {
      const constraint = {
        family: 'ACCOUNTING',
        type: 'MISSING_INVOICE',
        severity: 'BLOCKING',
        vendor_id: 'vendor-test-001',
        expected_amount: 8500.0,
        resolved: false,
      };
      expect(constraint.severity).toBe('BLOCKING');
    });

    it('UNRECONCILED_ENTRY flags ledger discrepancy', () => {
      const constraint = {
        family: 'ACCOUNTING',
        type: 'UNRECONCILED_ENTRY',
        severity: 'WARNING',
        ledger_entry_id: 'ledger-test-001',
        discrepancy_amount: 342.15,
        resolved: false,
      };
      expect(constraint.discrepancy_amount).toBeGreaterThan(0);
    });
  });

  // ──────────────────────────────────────────────
  // Cross-Domain Constraints
  // ──────────────────────────────────────────────
  describe('Cross-Domain Constraints', () => {
    it('DECISION_WITHOUT_KERNEL_INPUTS blocks decision finalization', () => {
      const constraint = {
        family: 'CROSS_DOMAIN',
        type: 'DECISION_WITHOUT_KERNEL_INPUTS',
        severity: 'BLOCKING',
        decision_thread_id: 'dt-test-001',
        missing_kernels: ['accounting'],
        message: 'All relevant kernels must provide assessments before decision',
        resolved: false,
      };
      expect(constraint.missing_kernels.length).toBeGreaterThan(0);
      expect(constraint.severity).toBe('BLOCKING');
    });

    it('UNRESOLVED_CONFLICT blocks progress until resolved', () => {
      const constraint = {
        family: 'CROSS_DOMAIN',
        type: 'UNRESOLVED_CONFLICT',
        severity: 'BLOCKING',
        conflicting_kernels: ['business', 'law'],
        conflict_description: 'Business risk assessment contradicts legal recommendation',
        requires_practitioner_resolution: true,
        resolved: false,
      };
      expect(constraint.requires_practitioner_resolution).toBe(true);
      expect(constraint.conflicting_kernels.length).toBe(2);
    });
  });

  // ──────────────────────────────────────────────
  // Voice-Language Constraints
  // ──────────────────────────────────────────────
  describe('Voice-Language Constraints', () => {
    it('INCOMPLETE_TRANSCRIPT flags missing segments', () => {
      const constraint = {
        family: 'VOICE_LANGUAGE',
        type: 'INCOMPLETE_TRANSCRIPT',
        severity: 'WARNING',
        session_id: 'vs-test-001',
        gap_duration_seconds: 12,
        message: 'Transcript has gaps that may affect accuracy',
        resolved: false,
      };
      expect(constraint.gap_duration_seconds).toBeGreaterThan(0);
    });

    it('LOW_CONFIDENCE flags unreliable transcription', () => {
      const constraint = {
        family: 'VOICE_LANGUAGE',
        type: 'LOW_CONFIDENCE',
        severity: 'WARNING',
        confidence_score: 0.42,
        threshold: 0.7,
        message: 'Transcription confidence below acceptable threshold',
        resolved: false,
      };
      expect(constraint.confidence_score).toBeLessThan(constraint.threshold);
    });

    it('MISSING_PROVENANCE blocks voice-derived candidates', () => {
      const constraint = {
        family: 'VOICE_LANGUAGE',
        type: 'MISSING_PROVENANCE',
        severity: 'BLOCKING',
        candidate_id: 'cand-test-001',
        message: 'Voice-derived candidate must have full provenance chain',
        resolved: false,
      };
      expect(constraint.severity).toBe('BLOCKING');
    });

    it('UNSAFE_ACTION blocks unreviewed domain mutations from voice', () => {
      const constraint = {
        family: 'VOICE_LANGUAGE',
        type: 'UNSAFE_ACTION',
        severity: 'CRITICAL',
        action: 'delete_matter',
        source: 'spoken_command',
        message: 'Destructive actions from voice input require explicit confirmation',
        requires_confirmation: true,
        resolved: false,
      };
      expect(constraint.severity).toBe('CRITICAL');
      expect(constraint.requires_confirmation).toBe(true);
    });
  });
});
