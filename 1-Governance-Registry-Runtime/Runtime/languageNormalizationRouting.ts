/**
 * Language Normalization Routing
 * Domain: Business Law Accounting
 *
 * Routes language normalization requests through the Language Intelligence Layer.
 * Receives complex/ambiguous text, produces normalization packets,
 * and routes suggestions to appropriate kernels.
 * All outputs are ADVISORY — never authoritative.
 */

export type KernelTarget = 'business' | 'law' | 'accounting';

export interface NormalizationRequest {
  request_id: string;
  input_text: string;
  input_source_type: 'spoken_note' | 'transcript' | 'manual_entry' | 'meeting_intake' | 'document_extract';
  input_source_id: string | null;
  target_kernels: KernelTarget[] | null;
  requested_by: string;
  priority: 'high' | 'normal' | 'low';
}

export interface NormalizationPacket {
  packet_id: string;
  request_id: string;
  trust_level: 'advisory';
  terminology_alignments: {
    original: string;
    suggested: string;
    kernel: KernelTarget;
    confidence: number;
  }[];
  disambiguations: {
    phrase: string;
    interpretations: {
      text: string;
      kernel: KernelTarget;
      confidence: number;
    }[];
  }[];
  routing_suggestions: {
    kernel: KernelTarget;
    relevance: number;
    reason: string;
  }[];
  overall_confidence: number;
  produced_at: string;
}

export interface NormalizationRoutingResult {
  success: boolean;
  packet: NormalizationPacket;
  routed_to_kernels: KernelTarget[];
  receipt_id: string;
  warnings: string[];
}

export class LanguageNormalizationRouter {
  /**
   * Processes a normalization request and produces a routing result.
   * All normalization outputs carry trust_level: 'advisory'.
   */
  async processNormalizationRequest(request: NormalizationRequest): Promise<NormalizationRoutingResult> {
    const warnings: string[] = [];

    // Produce terminology alignments
    const alignments = this.extractTerminologyAlignments(request.input_text);

    // Produce phrase disambiguations
    const disambiguations = this.extractDisambiguations(request.input_text);

    // Determine routing suggestions
    const routingSuggestions = this.determineRoutingSuggestions(alignments, disambiguations);

    // Calculate overall confidence
    const allConfidences = [
      ...alignments.map(a => a.confidence),
      ...disambiguations.flatMap(d => d.interpretations.map(i => i.confidence)),
    ];
    const overallConfidence = allConfidences.length > 0
      ? allConfidences.reduce((sum, c) => sum + c, 0) / allConfidences.length
      : 0.5;

    if (overallConfidence < 0.5) {
      warnings.push('Low overall normalization confidence. Practitioner review strongly recommended.');
    }

    // Build the packet — always ADVISORY
    const packet: NormalizationPacket = {
      packet_id: `norm-${request.request_id}-${Date.now()}`,
      request_id: request.request_id,
      trust_level: 'advisory',
      terminology_alignments: alignments,
      disambiguations,
      routing_suggestions: routingSuggestions,
      overall_confidence: overallConfidence,
      produced_at: new Date().toISOString(),
    };

    // Route to target kernels or to all suggested kernels
    const targetKernels = request.target_kernels
      ?? routingSuggestions.filter(s => s.relevance > 0.3).map(s => s.kernel);

    const receiptId = `receipt-norm-route-${packet.packet_id}-${Date.now()}`;

    return {
      success: true,
      packet,
      routed_to_kernels: targetKernels,
      receipt_id: receiptId,
      warnings,
    };
  }

  /**
   * Extract terminology alignments from input text.
   * These are suggestions, not authoritative classifications.
   */
  private extractTerminologyAlignments(text: string): NormalizationPacket['terminology_alignments'] {
    const alignments: NormalizationPacket['terminology_alignments'] = [];
    const lower = text.toLowerCase();

    const termMap: { pattern: string; suggested: string; kernel: KernelTarget; confidence: number }[] = [
      { pattern: 'the deal', suggested: 'contract / agreement', kernel: 'law', confidence: 0.7 },
      { pattern: 'what we owe', suggested: 'obligation / payable', kernel: 'law', confidence: 0.65 },
      { pattern: 'the other side', suggested: 'counterparty', kernel: 'law', confidence: 0.75 },
      { pattern: 'tax stuff', suggested: 'tax posture / tax treatment', kernel: 'accounting', confidence: 0.6 },
      { pattern: 'the numbers', suggested: 'financial statements / metrics', kernel: 'accounting', confidence: 0.55 },
      { pattern: 'our people', suggested: 'personnel / staff', kernel: 'business', confidence: 0.6 },
      { pattern: 'the vendor', suggested: 'service provider / vendor entity', kernel: 'business', confidence: 0.8 },
    ];

    for (const mapping of termMap) {
      if (lower.includes(mapping.pattern)) {
        alignments.push({
          original: mapping.pattern,
          suggested: mapping.suggested,
          kernel: mapping.kernel,
          confidence: mapping.confidence,
        });
      }
    }

    return alignments;
  }

  /**
   * Extract phrase disambiguations from input text.
   */
  private extractDisambiguations(text: string): NormalizationPacket['disambiguations'] {
    const disambiguations: NormalizationPacket['disambiguations'] = [];
    const lower = text.toLowerCase();

    const ambiguousPhrases: { pattern: string; interpretations: { text: string; kernel: KernelTarget; confidence: number }[] }[] = [
      {
        pattern: 'close this',
        interpretations: [
          { text: 'Close the matter', kernel: 'business', confidence: 0.4 },
          { text: 'Execute the contract', kernel: 'law', confidence: 0.3 },
          { text: 'Close the books / period', kernel: 'accounting', confidence: 0.3 },
        ],
      },
      {
        pattern: 'file it',
        interpretations: [
          { text: 'File a legal document', kernel: 'law', confidence: 0.45 },
          { text: 'File a tax return', kernel: 'accounting', confidence: 0.35 },
          { text: 'File in business records', kernel: 'business', confidence: 0.2 },
        ],
      },
      {
        pattern: 'review the numbers',
        interpretations: [
          { text: 'Financial review / audit', kernel: 'accounting', confidence: 0.5 },
          { text: 'Contract value analysis', kernel: 'law', confidence: 0.3 },
          { text: 'Business performance metrics', kernel: 'business', confidence: 0.2 },
        ],
      },
    ];

    for (const phrase of ambiguousPhrases) {
      if (lower.includes(phrase.pattern)) {
        disambiguations.push({
          phrase: phrase.pattern,
          interpretations: phrase.interpretations,
        });
      }
    }

    return disambiguations;
  }

  /**
   * Determine routing suggestions based on alignments and disambiguations.
   */
  private determineRoutingSuggestions(
    alignments: NormalizationPacket['terminology_alignments'],
    disambiguations: NormalizationPacket['disambiguations'],
  ): NormalizationPacket['routing_suggestions'] {
    const kernelScores: Record<KernelTarget, { total: number; count: number; reasons: string[] }> = {
      business: { total: 0, count: 0, reasons: [] },
      law: { total: 0, count: 0, reasons: [] },
      accounting: { total: 0, count: 0, reasons: [] },
    };

    for (const alignment of alignments) {
      kernelScores[alignment.kernel].total += alignment.confidence;
      kernelScores[alignment.kernel].count += 1;
      kernelScores[alignment.kernel].reasons.push(`Terminology: "${alignment.original}"`);
    }

    for (const disambiguation of disambiguations) {
      for (const interp of disambiguation.interpretations) {
        kernelScores[interp.kernel].total += interp.confidence;
        kernelScores[interp.kernel].count += 1;
        kernelScores[interp.kernel].reasons.push(`Disambiguation: "${disambiguation.phrase}"`);
      }
    }

    const suggestions: NormalizationPacket['routing_suggestions'] = [];
    for (const [kernel, score] of Object.entries(kernelScores) as [KernelTarget, typeof kernelScores[KernelTarget]][]) {
      if (score.count > 0) {
        suggestions.push({
          kernel,
          relevance: score.total / score.count,
          reason: score.reasons.join('; '),
        });
      }
    }

    return suggestions.sort((a, b) => b.relevance - a.relevance);
  }
}
