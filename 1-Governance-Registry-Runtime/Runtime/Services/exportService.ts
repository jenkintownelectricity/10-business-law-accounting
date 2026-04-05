// ──────────────────────────────────────────────────────────────
//  ExportService — Export Packet Generation
//  Generates clean, print-ready typed packets for matters,
//  contracts, commercial decisions, receipts, listening sessions,
//  and transcript reviews.
//  All operations emit receipts.
// ─────────────────────────────────────────────���────────────────

import type {
  Matter,
  Contract,
  Obligation,
  CommercialDecisionBundle,
  TranscriptEnvelope,
  ListeningSession,
  KernelDomain,
} from '../../../2-Engines-Tools-Datasets/Domain-Objects/src/index.js';

import type { Receipt } from '../../Registry/catalogs/receipts.js';

// ── Export Packet Types ────────────────────────────────────────

export interface ExportMetadata {
  export_id: string;
  exported_at: string;
  exported_by: string;
  format_version: string;
  domain: string;
  packet_type: string;
}

export interface MatterReviewPacket {
  metadata: ExportMetadata;
  matter: Matter;
  related_contracts: Contract[];
  related_obligations: Obligation[];
  decision_bundle?: CommercialDecisionBundle;
  timeline: { event: string; timestamp: string; actor: string }[];
  notes_summary: { total: number; by_type: Record<string, number> };
  evidence_summary: { total: number; evidence_ids: string[] };
  export_receipts: Receipt[];
}

export interface ContractReviewPacket {
  metadata: ExportMetadata;
  contract: Contract;
  obligations: Obligation[];
  financial_summary: {
    total_value: number;
    currency: string;
    contingent_liabilities: number;
    payment_schedule_count: number;
  };
  risk_summary: {
    total_risks: number;
    by_severity: Record<string, number>;
    critical_risks: string[];
  };
  parties_summary: { name: string; role: string; signed: boolean }[];
  export_receipts: Receipt[];
}

export interface CommercialDecisionPacket {
  metadata: ExportMetadata;
  matter: Matter;
  decision_bundle: CommercialDecisionBundle;
  business_assessment_summary: string | null;
  legal_assessment_summary: string | null;
  accounting_assessment_summary: string | null;
  combined_recommendation: string;
  open_risks_count: number;
  unresolved_constraints_count: number;
  follow_up_actions: { title: string; kernel: KernelDomain; priority: string; status: string }[];
  export_receipts: Receipt[];
}

export interface ReceiptPacket {
  metadata: ExportMetadata;
  receipts: Receipt[];
  summary: {
    total: number;
    by_type: Record<string, number>;
    by_kernel: Record<string, number>;
    date_range: { from: string; to: string };
  };
}

export interface ListeningSessionPacket {
  metadata: ExportMetadata;
  session: ListeningSession;
  obligation_candidates_count: number;
  deadline_candidates_count: number;
  routing_hints: { kernel: KernelDomain; confidence: number }[];
  transcript_ids: string[];
  advisory_packets_count: number;
  export_receipts: Receipt[];
}

export interface TranscriptReviewPacket {
  metadata: ExportMetadata;
  transcript: TranscriptEnvelope;
  speaker_summary: { speaker: string; segments: number; total_time: number }[];
  flagged_terms_count: number;
  review_status: string;
  linked_matter_id?: string;
  confidence: number;
  export_receipts: Receipt[];
}

export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  receipt?: Receipt;
}

// ── Service Implementation ─────────────────────────────────────

export class ExportService {
  private receiptSequence = 0;

  // ── Matter Review Packet ───────────────────────────────────

  async exportMatterReviewPacket(params: {
    matter: Matter;
    related_contracts?: Contract[];
    related_obligations?: Obligation[];
    decision_bundle?: CommercialDecisionBundle;
    timeline?: { event: string; timestamp: string; actor: string }[];
    exported_by: string;
  }): Promise<ServiceResult<MatterReviewPacket>> {
    const metadata = this.createMetadata('matter_review', params.exported_by);

    const notesByType: Record<string, number> = {};
    for (const note of params.matter.notes) {
      notesByType[note.note_type] = (notesByType[note.note_type] ?? 0) + 1;
    }

    const receipt = this.emitReceipt({
      operation: 'export.matter_review_packet',
      description: `Matter review packet exported for "${params.matter.title}"`,
      actor: params.exported_by,
      target_id: params.matter.id,
      target_type: 'matter',
    });

    const packet: MatterReviewPacket = {
      metadata,
      matter: params.matter,
      related_contracts: params.related_contracts ?? [],
      related_obligations: params.related_obligations ?? [],
      decision_bundle: params.decision_bundle,
      timeline: params.timeline ?? [],
      notes_summary: { total: params.matter.notes.length, by_type: notesByType },
      evidence_summary: { total: params.matter.evidence_ids.length, evidence_ids: params.matter.evidence_ids },
      export_receipts: [receipt],
    };

    return { success: true, data: packet, receipt };
  }

  // ── Contract Review Packet ──────────────���──────────────────

  async exportContractReviewPacket(params: {
    contract: Contract;
    obligations?: Obligation[];
    exported_by: string;
  }): Promise<ServiceResult<ContractReviewPacket>> {
    const metadata = this.createMetadata('contract_review', params.exported_by);
    const { contract } = params;

    const bySeverity: Record<string, number> = {};
    const criticalRisks: string[] = [];
    for (const risk of contract.risk_assessments) {
      bySeverity[risk.severity] = (bySeverity[risk.severity] ?? 0) + 1;
      if (risk.severity === 'critical') criticalRisks.push(risk.description);
    }

    const contingent = contract.financial_summary.contingent_amounts.reduce((s, c) => s + c.estimated_amount, 0);

    const receipt = this.emitReceipt({
      operation: 'export.contract_review_packet',
      description: `Contract review packet exported for "${contract.title}"`,
      actor: params.exported_by,
      target_id: contract.id,
      target_type: 'contract',
    });

    const packet: ContractReviewPacket = {
      metadata,
      contract,
      obligations: params.obligations ?? [],
      financial_summary: {
        total_value: contract.financial_summary.total_value,
        currency: contract.financial_summary.currency,
        contingent_liabilities: contingent,
        payment_schedule_count: contract.financial_summary.payment_schedule.length,
      },
      risk_summary: {
        total_risks: contract.risk_assessments.length,
        by_severity: bySeverity,
        critical_risks: criticalRisks,
      },
      parties_summary: contract.parties.map(p => ({
        name: p.name,
        role: p.role,
        signed: !!p.signed_at,
      })),
      export_receipts: [receipt],
    };

    return { success: true, data: packet, receipt };
  }

  // ── Commercial Decision Packet ─────────────────────────────

  async exportCommercialDecisionPacket(params: {
    matter: Matter;
    decision_bundle: CommercialDecisionBundle;
    exported_by: string;
  }): Promise<ServiceResult<CommercialDecisionPacket>> {
    const metadata = this.createMetadata('commercial_decision', params.exported_by);
    const { decision_bundle } = params;

    const receipt = this.emitReceipt({
      operation: 'export.commercial_decision_packet',
      description: `Commercial decision packet exported for matter "${params.matter.title}"`,
      actor: params.exported_by,
      target_id: decision_bundle.id,
      target_type: 'decision_bundle',
    });

    const packet: CommercialDecisionPacket = {
      metadata,
      matter: params.matter,
      decision_bundle,
      business_assessment_summary: decision_bundle.business_assessment?.summary ?? null,
      legal_assessment_summary: decision_bundle.legal_assessment?.summary ?? null,
      accounting_assessment_summary: decision_bundle.accounting_assessment?.summary ?? null,
      combined_recommendation: decision_bundle.combined_recommendation,
      open_risks_count: decision_bundle.open_risks.length,
      unresolved_constraints_count: decision_bundle.unresolved_constraints.length,
      follow_up_actions: decision_bundle.follow_up_actions.map(a => ({
        title: a.title,
        kernel: a.assigned_kernel,
        priority: a.priority,
        status: a.status,
      })),
      export_receipts: [receipt],
    };

    return { success: true, data: packet, receipt };
  }

  // ── Receipt Packet ───────���─────────────────────────────────

  async exportReceiptPacket(params: {
    receipts: Receipt[];
    exported_by: string;
  }): Promise<ServiceResult<ReceiptPacket>> {
    const metadata = this.createMetadata('receipt_export', params.exported_by);

    const byType: Record<string, number> = {};
    const byKernel: Record<string, number> = {};
    let minDate = '';
    let maxDate = '';

    for (const r of params.receipts) {
      byType[r.receipt_type] = (byType[r.receipt_type] ?? 0) + 1;
      byKernel[r.source_kernel] = (byKernel[r.source_kernel] ?? 0) + 1;
      if (!minDate || r.timestamp < minDate) minDate = r.timestamp;
      if (!maxDate || r.timestamp > maxDate) maxDate = r.timestamp;
    }

    const receipt = this.emitReceipt({
      operation: 'export.receipt_packet',
      description: `Receipt packet exported: ${params.receipts.length} receipts`,
      actor: params.exported_by,
      target_id: 'receipts',
      target_type: 'receipt_collection',
    });

    const packet: ReceiptPacket = {
      metadata,
      receipts: params.receipts,
      summary: {
        total: params.receipts.length,
        by_type: byType,
        by_kernel: byKernel,
        date_range: { from: minDate, to: maxDate },
      },
    };

    return { success: true, data: packet, receipt };
  }

  // ── Listening Session Packet ────────────────��──────────────

  async exportListeningSessionPacket(params: {
    session: ListeningSession;
    exported_by: string;
  }): Promise<ServiceResult<ListeningSessionPacket>> {
    const metadata = this.createMetadata('listening_session', params.exported_by);
    const { session } = params;

    const receipt = this.emitReceipt({
      operation: 'export.listening_session_packet',
      description: `Listening session packet exported: "${session.title}"`,
      actor: params.exported_by,
      target_id: session.id,
      target_type: 'listening_session',
    });

    const packet: ListeningSessionPacket = {
      metadata,
      session,
      obligation_candidates_count: session.obligation_candidates.length,
      deadline_candidates_count: session.deadline_candidates.length,
      routing_hints: session.routing_hints.map(h => ({ kernel: h.kernel, confidence: h.confidence })),
      transcript_ids: session.transcript_envelope_ids,
      advisory_packets_count: session.advisory_packets.length,
      export_receipts: [receipt],
    };

    return { success: true, data: packet, receipt };
  }

  // ── Transcript Review Packet ──────────────���────────────────

  async exportTranscriptReviewPacket(params: {
    transcript: TranscriptEnvelope;
    exported_by: string;
  }): Promise<ServiceResult<TranscriptReviewPacket>> {
    const metadata = this.createMetadata('transcript_review', params.exported_by);
    const { transcript } = params;

    const speakerMap = new Map<string, { segments: number; total_time: number }>();
    for (const seg of transcript.segments) {
      const speaker = seg.speaker_label ?? seg.speaker_id ?? 'Unknown';
      const existing = speakerMap.get(speaker) ?? { segments: 0, total_time: 0 };
      existing.segments++;
      existing.total_time += seg.end_time - seg.start_time;
      speakerMap.set(speaker, existing);
    }

    const flaggedCount = transcript.segments.reduce((sum, s) => sum + s.flagged_terms.length, 0);

    const receipt = this.emitReceipt({
      operation: 'export.transcript_review_packet',
      description: `Transcript review packet exported: session ${transcript.session_id}`,
      actor: params.exported_by,
      target_id: transcript.id,
      target_type: 'transcript_envelope',
    });

    const packet: TranscriptReviewPacket = {
      metadata,
      transcript,
      speaker_summary: Array.from(speakerMap.entries()).map(([speaker, data]) => ({
        speaker,
        ...data,
      })),
      flagged_terms_count: flaggedCount,
      review_status: transcript.review_status,
      linked_matter_id: transcript.matter_id,
      confidence: transcript.overall_confidence,
      export_receipts: [receipt],
    };

    return { success: true, data: packet, receipt };
  }

  // ── Internal Helpers ─────────────────���─────────────────────

  private createMetadata(packetType: string, exportedBy: string): ExportMetadata {
    return {
      export_id: `export_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      exported_at: new Date().toISOString(),
      exported_by: exportedBy,
      format_version: '1.0.0',
      domain: '10-business-law-accounting',
      packet_type: packetType,
    };
  }

  private emitReceipt(params: {
    operation: string;
    description: string;
    actor: string;
    target_id: string;
    target_type: string;
  }): Receipt {
    this.receiptSequence++;
    const now = new Date().toISOString();
    return {
      id: `rcpt_${Date.now()}_${this.receiptSequence}`,
      receipt_type: 'platform_emission',
      operation: params.operation,
      description: params.description,
      actor: params.actor,
      actor_type: 'practitioner',
      target_id: params.target_id,
      target_type: params.target_type,
      source_kernel: 'orchestrator',
      previous_state: null,
      new_state: null,
      payload_hash: `sha256_${Date.now()}`,
      parent_receipt_id: null,
      related_receipt_ids: [],
      timestamp: now,
      replay_sequence: this.receiptSequence,
      idempotency_key: `${params.operation}_${params.target_id}_${this.receiptSequence}`,
      notes: '',
      created_at: now,
      updated_at: now,
      status: 'emitted',
    };
  }
}
