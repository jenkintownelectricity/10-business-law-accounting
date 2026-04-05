/**
 * Business Kernel
 * Sovereign kernel for business operations truth.
 * Owns: entities, vendors, commercial matters, business risk.
 */

import { BusinessEntity, VendorAssessment, CommercialMatter, BusinessRisk, BusinessAssessment } from './types';
import { evaluateMissingEntity, evaluateIncompleteVendor, evaluateCommercialMatterCompleteness, evaluateBusinessRiskLevel } from './constraints';

export class BusinessKernel {
  readonly kernelId = 'business' as const;
  readonly trustLevel = 'TRUSTED' as const;

  evaluate(matter: CommercialMatter): BusinessAssessment {
    const entityConstraint = evaluateMissingEntity(matter.entity_id);
    const matterConstraint = evaluateCommercialMatterCompleteness(matter);
    const riskConstraint = evaluateBusinessRiskLevel(matter.risk_score ?? 0);

    const constraints = [entityConstraint, matterConstraint, riskConstraint];
    const hasHalt = constraints.some(c => c.result === 'HALT');
    const hasWarning = constraints.some(c => c.result === 'WARNING');

    return {
      kernel: 'business',
      matter_id: matter.id,
      summary: hasHalt
        ? 'Business assessment blocked — critical constraints unresolved'
        : hasWarning
        ? 'Business assessment complete with warnings'
        : 'Business assessment clear — no issues identified',
      impact_level: hasHalt ? 'high' : hasWarning ? 'medium' : 'low',
      risks: matter.identified_risks ?? [],
      recommendations: this.generateRecommendations(matter, constraints),
      constraints_evaluated: constraints,
      assessed_at: new Date().toISOString(),
    };
  }

  assessVendor(vendor: { id: string; name: string; verified: boolean; tax_id?: string }): VendorAssessment {
    const constraint = evaluateIncompleteVendor(vendor);
    return {
      vendor_id: vendor.id,
      vendor_name: vendor.name,
      verified: vendor.verified,
      tax_id_present: !!vendor.tax_id,
      constraint_result: constraint.result,
      assessment: constraint.result === 'PASS' ? 'Vendor fully validated' : constraint.message,
      assessed_at: new Date().toISOString(),
    };
  }

  assessBusinessRisk(riskScore: number): BusinessRisk {
    const constraint = evaluateBusinessRiskLevel(riskScore);
    return {
      risk_score: riskScore,
      risk_level: riskScore <= 0.3 ? 'low' : riskScore <= 0.7 ? 'medium' : 'high',
      constraint_result: constraint.result,
      assessed_at: new Date().toISOString(),
    };
  }

  private generateRecommendations(matter: CommercialMatter, constraints: any[]): string[] {
    const recs: string[] = [];
    for (const c of constraints) {
      if (c.result === 'HALT') recs.push(`RESOLVE: ${c.message}`);
      if (c.result === 'WARNING') recs.push(`REVIEW: ${c.message}`);
    }
    return recs;
  }
}
