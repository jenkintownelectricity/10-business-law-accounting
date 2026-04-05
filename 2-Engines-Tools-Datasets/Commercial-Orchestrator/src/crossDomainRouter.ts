/**
 * Cross-Domain Router
 * Routes work items to appropriate kernel(s) based on content analysis.
 * Determines which kernels need to be engaged for a given matter.
 */

export interface RoutingDecision {
  target_kernel: string;
  routed: boolean;
  reason?: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  decided_at: string;
}

export interface Routable {
  matter_id: string;
  title: string;
  description: string;
  matter_type?: string;
  domains?: string[];
  priority: 'critical' | 'high' | 'medium' | 'low';
}

const KERNEL_KEYWORDS: Record<string, string[]> = {
  business: ['entity', 'vendor', 'commercial', 'business', 'risk', 'assessment', 'partner', 'acquisition', 'merger'],
  law: ['contract', 'legal', 'obligation', 'compliance', 'evidence', 'deadline', 'court', 'litigation', 'clause', 'agreement', 'license'],
  accounting: ['invoice', 'ledger', 'tax', 'financial', 'reconciliation', 'payment', 'revenue', 'expense', 'audit', 'fiscal'],
};

export class CrossDomainRouter {
  /**
   * Analyze a routable item and determine which kernels should be engaged.
   */
  route(item: Routable): RoutingDecision[] {
    const decisions: RoutingDecision[] = [];

    // If explicit domains are specified, use those
    if (item.domains && item.domains.length > 0) {
      for (const domain of item.domains) {
        decisions.push({
          target_kernel: domain,
          routed: true,
          reason: `Explicitly requested domain: ${domain}`,
          priority: item.priority,
          decided_at: new Date().toISOString(),
        });
      }
      return decisions;
    }

    // Otherwise, analyze content to determine routing
    const content = `${item.title} ${item.description} ${item.matter_type ?? ''}`.toLowerCase();

    for (const [kernel, keywords] of Object.entries(KERNEL_KEYWORDS)) {
      const matches = keywords.filter(kw => content.includes(kw));
      if (matches.length > 0) {
        decisions.push({
          target_kernel: kernel,
          routed: true,
          reason: `Content matches keywords: ${matches.join(', ')}`,
          priority: item.priority,
          decided_at: new Date().toISOString(),
        });
      }
    }

    // If no kernels matched, route to business as default with a note
    if (decisions.length === 0) {
      decisions.push({
        target_kernel: 'business',
        routed: true,
        reason: 'Default routing — no specific domain keywords detected',
        priority: item.priority,
        decided_at: new Date().toISOString(),
      });
    }

    return decisions;
  }

  /**
   * Determine if a matter requires cross-domain coordination.
   */
  isCrossDomain(item: Routable): boolean {
    const decisions = this.route(item);
    return decisions.filter(d => d.routed).length > 1;
  }
}
