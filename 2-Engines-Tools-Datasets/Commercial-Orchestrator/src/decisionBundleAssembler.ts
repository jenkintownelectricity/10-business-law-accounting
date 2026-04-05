/**
 * Decision Bundle Assembler
 * Assembles CommercialDecisionBundles from individual kernel assessments.
 * Preserves source_kernel provenance on all assembled outputs.
 */

export interface KernelAssessment {
  kernel: string;
  matter_id: string;
  assessment_type: string;
  result: 'pass' | 'warning' | 'halt' | 'pending' | 'unsupported';
  summary: string;
  constraints_evaluated: any[];
  receipt_id: string;
  assessed_at: string;
}

export interface CommercialDecisionBundle {
  bundle_id: string;
  matter_id: string;
  assessments: KernelAssessment[];
  source_kernel_receipts: string[];
  aggregate_result: 'clear' | 'warnings_present' | 'blocked' | 'incomplete';
  summary: string;
  assembled_at: string;
}

export class DecisionBundleAssembler {
  /**
   * Assemble a decision bundle from kernel assessments.
   * All source_kernel_receipts are preserved.
   */
  assemble(matterId: string, assessments: KernelAssessment[]): CommercialDecisionBundle {
    const receipts = assessments.map(a => a.receipt_id);
    const aggregateResult = this.computeAggregateResult(assessments);
    const summary = this.generateSummary(assessments, aggregateResult);

    return {
      bundle_id: `bundle-${matterId}-${Date.now()}`,
      matter_id: matterId,
      assessments,
      source_kernel_receipts: receipts,
      aggregate_result: aggregateResult,
      summary,
      assembled_at: new Date().toISOString(),
    };
  }

  private computeAggregateResult(assessments: KernelAssessment[]): CommercialDecisionBundle['aggregate_result'] {
    if (assessments.some(a => a.result === 'halt')) return 'blocked';
    if (assessments.some(a => a.result === 'pending' || a.result === 'unsupported')) return 'incomplete';
    if (assessments.some(a => a.result === 'warning')) return 'warnings_present';
    return 'clear';
  }

  private generateSummary(assessments: KernelAssessment[], aggregateResult: string): string {
    const kernelNames = [...new Set(assessments.map(a => a.kernel))];
    const kernelList = kernelNames.join(', ');

    switch (aggregateResult) {
      case 'blocked':
        return `Decision bundle BLOCKED. Kernels consulted: ${kernelList}. One or more kernels returned HALT.`;
      case 'incomplete':
        return `Decision bundle INCOMPLETE. Kernels consulted: ${kernelList}. Some assessments are pending or unsupported.`;
      case 'warnings_present':
        return `Decision bundle assembled with WARNINGS. Kernels consulted: ${kernelList}.`;
      default:
        return `Decision bundle CLEAR. All kernels (${kernelList}) returned passing assessments.`;
    }
  }
}
