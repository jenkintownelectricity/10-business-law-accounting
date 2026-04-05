/**
 * Trust Boundary Bridge
 * Domain: Business Law Accounting
 *
 * Mediates trust boundary evaluations between the domain and platform.
 * Wraps platform client trust boundary operations with domain-specific context.
 *
 * All ingress into the domain passes through this bridge to ensure
 * proper trust-level assessment before data enters the sovereign domain.
 */

import type {
  PlatformClient,
  PlatformResponse,
  TrustBoundaryRequest,
  TrustBoundaryResult
} from './platformClient';

import type { TrustLevel } from './platformAttachment.contract';

// --- Bridge Configuration ---

export interface TrustBoundaryBridgeConfig {
  domain_id: string;
  default_ingress_trust_level: TrustLevel;
  require_review_for_promotions: boolean;
  audit_all_crossings: boolean;
}

// --- Domain-Contextualized Request ---

export interface DomainTrustBoundaryRequest {
  source_kernel: 'business' | 'law' | 'accounting' | 'cross-domain' | 'voice-language' | 'external';
  entity_type: string;
  entity_id: string;
  direction: 'ingress' | 'egress';
  payload_type: string;
  trust_level: TrustLevel;
  context?: Record<string, unknown>;
}

// --- Audit Entry ---

export interface TrustBoundaryCrossingAudit {
  audit_id: string;
  request: DomainTrustBoundaryRequest;
  platform_request_id: string;
  result: TrustBoundaryResult | null;
  success: boolean;
  error?: string;
  timestamp: string;
}

// --- Bridge Implementation ---

export class TrustBoundaryBridge {
  private client: PlatformClient;
  private config: TrustBoundaryBridgeConfig;
  private auditLog: TrustBoundaryCrossingAudit[] = [];

  constructor(client: PlatformClient, config: TrustBoundaryBridgeConfig) {
    this.client = client;
    this.config = config;
  }

  /**
   * Evaluate a trust boundary crossing with domain-specific context.
   * Wraps the platform client call with domain metadata and audit logging.
   */
  async evaluateIngress(request: DomainTrustBoundaryRequest): Promise<PlatformResponse<TrustBoundaryResult>> {
    const platformRequest: TrustBoundaryRequest = {
      request_id: `tb_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      boundary_type: 'ingress',
      source: request.source_kernel,
      target: this.config.domain_id,
      payload_type: request.payload_type,
      trust_level: this.mapTrustLevel(request.trust_level),
      metadata: {
        entity_type: request.entity_type,
        entity_id: request.entity_id,
        source_kernel: request.source_kernel,
        domain_context: request.context
      }
    };

    const response = await this.client.evaluateTrustBoundary(platformRequest);

    if (this.config.audit_all_crossings) {
      this.recordAudit(request, platformRequest.request_id, response);
    }

    return response;
  }

  /**
   * Evaluate a trust boundary crossing for data leaving the domain.
   */
  async evaluateEgress(request: DomainTrustBoundaryRequest): Promise<PlatformResponse<TrustBoundaryResult>> {
    const platformRequest: TrustBoundaryRequest = {
      request_id: `tb_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      boundary_type: 'egress',
      source: this.config.domain_id,
      target: request.source_kernel,
      payload_type: request.payload_type,
      trust_level: this.mapTrustLevel(request.trust_level),
      metadata: {
        entity_type: request.entity_type,
        entity_id: request.entity_id,
        direction: 'egress',
        domain_context: request.context
      }
    };

    const response = await this.client.evaluateTrustBoundary(platformRequest);

    if (this.config.audit_all_crossings) {
      this.recordAudit(request, platformRequest.request_id, response);
    }

    return response;
  }

  /**
   * Evaluate a trust boundary crossing for cross-domain communication.
   */
  async evaluateCrossDomain(
    request: DomainTrustBoundaryRequest,
    targetDomainId: string
  ): Promise<PlatformResponse<TrustBoundaryResult>> {
    const platformRequest: TrustBoundaryRequest = {
      request_id: `tb_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      boundary_type: 'cross-domain',
      source: this.config.domain_id,
      target: targetDomainId,
      payload_type: request.payload_type,
      trust_level: this.mapTrustLevel(request.trust_level),
      metadata: {
        entity_type: request.entity_type,
        entity_id: request.entity_id,
        source_kernel: request.source_kernel,
        domain_context: request.context
      }
    };

    const response = await this.client.evaluateTrustBoundary(platformRequest);

    if (this.config.audit_all_crossings) {
      this.recordAudit(request, platformRequest.request_id, response);
    }

    return response;
  }

  /**
   * Get the full audit log of trust boundary crossings.
   */
  getAuditLog(): readonly TrustBoundaryCrossingAudit[] {
    return [...this.auditLog];
  }

  /**
   * Get audit entries for a specific entity.
   */
  getAuditForEntity(entityId: string): TrustBoundaryCrossingAudit[] {
    return this.auditLog.filter(a => a.request.entity_id === entityId);
  }

  // --- Private Helpers ---

  private mapTrustLevel(level: TrustLevel): 'UNTRUSTED' | 'PARTIALLY_TRUSTED' | 'TRUSTED' {
    switch (level) {
      case 'UNTRUSTED': return 'UNTRUSTED';
      case 'PARTIALLY_TRUSTED': return 'PARTIALLY_TRUSTED';
      case 'TRUSTED': return 'TRUSTED';
      case 'SOVEREIGN': return 'TRUSTED'; // Sovereign maps to TRUSTED at platform level
      default: return 'UNTRUSTED';
    }
  }

  private recordAudit(
    request: DomainTrustBoundaryRequest,
    platformRequestId: string,
    response: PlatformResponse<TrustBoundaryResult>
  ): void {
    this.auditLog.push({
      audit_id: `audit_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      request,
      platform_request_id: platformRequestId,
      result: response.data ?? null,
      success: response.success,
      error: response.error,
      timestamp: new Date().toISOString()
    });
  }
}
