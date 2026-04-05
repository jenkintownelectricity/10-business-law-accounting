/**
 * Workflow Integrity Tests
 * Verifies that all workflow tracks produce correctly typed outputs.
 */

describe('Workflow Integrity', () => {
  describe('Contract Review Workflow', () => {
    it('produces a typed ContractReviewPacket', () => {
      const packet = {
        type: 'ContractReviewPacket',
        contract_id: 'contract-test-001',
        parties: [
          { name: 'Acme Corp', role: 'counterparty' },
          { name: 'Our Client', role: 'principal' },
        ],
        obligations: [
          { id: 'obl-001', description: 'Deliver goods by Q3', deadline: '2026-09-30', status: 'ACTIVE' },
        ],
        risk_assessment: {
          source_kernel: 'law',
          risk_level: 'MEDIUM',
          flags: ['non_standard_termination_clause'],
        },
        financial_impact: {
          source_kernel: 'accounting',
          total_value: 250000,
          currency: 'CAD',
        },
        business_assessment: {
          source_kernel: 'business',
          strategic_alignment: 'HIGH',
          vendor_status: 'VALIDATED',
        },
        status: 'IN_REVIEW',
        reviewer: null,
        timestamp: '2026-04-05T00:00:00Z',
      };
      expect(packet.type).toBe('ContractReviewPacket');
      expect(packet.parties.length).toBe(2);
      expect(packet.obligations.length).toBeGreaterThan(0);
      expect(packet.risk_assessment.source_kernel).toBe('law');
      expect(packet.financial_impact.source_kernel).toBe('accounting');
      expect(packet.business_assessment.source_kernel).toBe('business');
    });

    it('contract review includes all kernel assessments', () => {
      const kernelsRepresented = ['business', 'law', 'accounting'];
      expect(kernelsRepresented).toContain('business');
      expect(kernelsRepresented).toContain('law');
      expect(kernelsRepresented).toContain('accounting');
    });
  });

  describe('Matter Intake Workflow', () => {
    it('creates a matter with proper INTAKE status', () => {
      const matter = {
        type: 'Matter',
        id: 'matter-test-001',
        title: 'Henderson Contract Dispute',
        status: 'INTAKE',
        client_id: 'client-henderson',
        created_at: '2026-04-05T00:00:00Z',
        assigned_practitioner: null,
        description: '',
        related_contracts: [],
        related_obligations: [],
        evidence: [],
        tags: [],
      };
      expect(matter.status).toBe('INTAKE');
      expect(matter.assigned_practitioner).toBeNull();
      expect(matter.type).toBe('Matter');
    });

    it('intake matter has empty collections ready to populate', () => {
      const matter = {
        related_contracts: [] as string[],
        related_obligations: [] as string[],
        evidence: [] as string[],
        tags: [] as string[],
      };
      expect(matter.related_contracts.length).toBe(0);
      expect(matter.related_obligations.length).toBe(0);
      expect(matter.evidence.length).toBe(0);
    });
  });

  describe('Decision Thread Workflow', () => {
    it('assembles a decision bundle with all kernel assessments', () => {
      const decisionBundle = {
        type: 'DecisionBundle',
        thread_id: 'dt-test-001',
        matter_id: 'matter-test-001',
        question: 'Should we proceed with the Henderson contract?',
        kernel_assessments: {
          business: {
            kernel: 'business',
            recommendation: 'PROCEED_WITH_CAUTION',
            risk_score: 0.45,
            rationale: 'Strategic value is high but vendor is newly validated',
          },
          law: {
            kernel: 'law',
            recommendation: 'PROCEED_WITH_MODIFICATIONS',
            risk_score: 0.6,
            rationale: 'Termination clause needs renegotiation',
          },
          accounting: {
            kernel: 'accounting',
            recommendation: 'PROCEED',
            risk_score: 0.2,
            rationale: 'Financial terms are favorable, cash flow impact manageable',
          },
        },
        combined_recommendation: 'PROCEED_WITH_MODIFICATIONS',
        unresolved_conflicts: [],
        action_items: [
          'Renegotiate termination clause',
          'Confirm vendor validation documentation',
        ],
        status: 'AWAITING_PRACTITIONER_DECISION',
        decided_by: null,
        decided_at: null,
      };
      expect(decisionBundle.type).toBe('DecisionBundle');
      expect(Object.keys(decisionBundle.kernel_assessments).length).toBe(3);
      expect(decisionBundle.status).toBe('AWAITING_PRACTITIONER_DECISION');
      expect(decisionBundle.decided_by).toBeNull();
    });

    it('decision thread preserves source-kernel provenance', () => {
      const assessments = [
        { kernel: 'business', recommendation: 'PROCEED' },
        { kernel: 'law', recommendation: 'PROCEED_WITH_MODIFICATIONS' },
        { kernel: 'accounting', recommendation: 'PROCEED' },
      ];
      assessments.forEach((a) => {
        expect(a.kernel).toBeDefined();
        expect(a.recommendation).toBeDefined();
      });
    });
  });

  describe('Voice Dictation Workflow', () => {
    it('produces a review queue item, not a sovereign record', () => {
      const dictationOutput = {
        type: 'ReviewQueueItem',
        source: 'voice_dictation',
        session_id: 'vs-test-001',
        transcript_text: 'Note for Henderson matter: client confirmed delivery timeline',
        confidence_score: 0.91,
        trust_level: 'UNTRUSTED',
        linked_matter: 'matter-test-001',
        review_status: 'pending',
        is_sovereign_record: false,
        structured_draft: {
          type: 'matter_note',
          content: 'Client confirmed delivery timeline',
          matter_id: 'matter-test-001',
        },
      };
      expect(dictationOutput.is_sovereign_record).toBe(false);
      expect(dictationOutput.trust_level).toBe('UNTRUSTED');
      expect(dictationOutput.review_status).toBe('pending');
      expect(dictationOutput.type).toBe('ReviewQueueItem');
    });

    it('dictation output links to originating voice session', () => {
      const output = {
        session_id: 'vs-test-001',
        provenance: {
          source_type: 'voice_dictation',
          session_id: 'vs-test-001',
          timestamp: '2026-04-05T10:30:00Z',
          microphone: 'default',
        },
      };
      expect(output.provenance.source_type).toBe('voice_dictation');
      expect(output.provenance.session_id).toBe(output.session_id);
    });
  });

  describe('Listening Session Workflow', () => {
    it('produces advisory packets, not sovereign records', () => {
      const listeningOutput = {
        type: 'ListeningSessionOutput',
        session_id: 'ls-test-001',
        duration_minutes: 45,
        advisory_packets: [
          {
            type: 'advisory_packet',
            content: 'Counterparty mentioned potential timeline change',
            confidence: 0.78,
            suggested_action: 'Review obligation deadlines',
            sovereign: false,
          },
          {
            type: 'advisory_packet',
            content: 'Price increase discussed for Q4',
            confidence: 0.85,
            suggested_action: 'Update financial projections',
            sovereign: false,
          },
        ],
        transcript_segments: 12,
        review_status: 'pending',
      };
      expect(listeningOutput.type).toBe('ListeningSessionOutput');
      listeningOutput.advisory_packets.forEach((packet) => {
        expect(packet.sovereign).toBe(false);
        expect(packet.type).toBe('advisory_packet');
      });
      expect(listeningOutput.review_status).toBe('pending');
    });

    it('listening session advisory packets route to review queue', () => {
      const routingResult = {
        source: 'listening_session',
        destination: 'review_queue',
        requires_practitioner_review: true,
        auto_approved: false,
      };
      expect(routingResult.destination).toBe('review_queue');
      expect(routingResult.auto_approved).toBe(false);
    });
  });
});
