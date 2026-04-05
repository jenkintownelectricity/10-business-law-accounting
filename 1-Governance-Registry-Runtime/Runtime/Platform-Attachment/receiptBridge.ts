/**
 * Receipt Bridge
 * Domain: Business Law Accounting
 *
 * Formats domain events into platform receipt format.
 * Ensures all domain state changes produce receipts through
 * the 30-validkernel-platform receipt emission infrastructure.
 */

import type {
  PlatformClient,
  PlatformResponse,
  DomainReceipt
} from './platformClient';

import type { DomainEvent, DomainEventType } from './platformAttachment.contract';

// --- Receipt Bridge Configuration ---

export interface ReceiptBridgeConfig {
  domain_id: string;
  auto_emit: boolean;
  batch_size: number;
  batch_interval_ms: number;
  require_receipt_confirmation: boolean;
}

// --- Receipt Emission Result ---

export interface ReceiptEmissionResult {
  event_type: DomainEventType;
  entity_id: string;
  receipt_id: string | null;
  success: boolean;
  error?: string;
  emitted_at: string;
}

// --- Receipt Buffer Entry ---

interface BufferedReceipt {
  receipt: DomainReceipt;
  event: DomainEvent;
  buffered_at: string;
}

// --- Receipt Bridge Implementation ---

export class ReceiptBridge {
  private client: PlatformClient;
  private config: ReceiptBridgeConfig;
  private buffer: BufferedReceipt[] = [];
  private emissionLog: ReceiptEmissionResult[] = [];

  constructor(client: PlatformClient, config: ReceiptBridgeConfig) {
    this.client = client;
    this.config = config;
  }

  /**
   * Convert a domain event into a platform receipt and emit it.
   * This is the primary method for ensuring all domain state changes
   * produce receipts.
   */
  async emitForEvent(event: DomainEvent): Promise<ReceiptEmissionResult> {
    const receipt = this.formatReceipt(event);

    if (!this.config.auto_emit) {
      this.buffer.push({
        receipt,
        event,
        buffered_at: new Date().toISOString()
      });

      return {
        event_type: event.event_type,
        entity_id: event.entity_id,
        receipt_id: null,
        success: true,
        emitted_at: new Date().toISOString()
      };
    }

    return this.emitReceipt(receipt, event);
  }

  /**
   * Emit all buffered receipts.
   * Used when auto_emit is false and receipts are batched.
   */
  async flushBuffer(): Promise<ReceiptEmissionResult[]> {
    const results: ReceiptEmissionResult[] = [];
    const batch = [...this.buffer];
    this.buffer = [];

    for (const entry of batch) {
      const result = await this.emitReceipt(entry.receipt, entry.event);
      results.push(result);
    }

    return results;
  }

  /**
   * Get the current buffer size.
   */
  getBufferSize(): number {
    return this.buffer.length;
  }

  /**
   * Get the full emission log.
   */
  getEmissionLog(): readonly ReceiptEmissionResult[] {
    return [...this.emissionLog];
  }

  /**
   * Get emission log entries for a specific entity.
   */
  getEmissionsForEntity(entityId: string): ReceiptEmissionResult[] {
    return this.emissionLog.filter(e => e.entity_id === entityId);
  }

  /**
   * Check if a receipt was emitted for a specific event.
   */
  hasReceiptFor(entityId: string, eventType: DomainEventType): boolean {
    return this.emissionLog.some(
      e => e.entity_id === entityId && e.event_type === eventType && e.success
    );
  }

  // --- Private Helpers ---

  /**
   * Format a domain event into the platform receipt structure.
   */
  private formatReceipt(event: DomainEvent): DomainReceipt {
    return {
      domain: event.domain,
      action: event.event_type,
      source_kernel: event.source_kernel,
      entity_type: event.entity_type,
      entity_id: event.entity_id,
      timestamp: event.timestamp,
      metadata: {
        payload: event.payload,
        correlation_id: event.correlation_id,
        formatted_by: 'receipt-bridge',
        domain_id: this.config.domain_id
      }
    };
  }

  /**
   * Emit a single receipt through the platform client.
   */
  private async emitReceipt(receipt: DomainReceipt, event: DomainEvent): Promise<ReceiptEmissionResult> {
    try {
      const response: PlatformResponse<{ receipt_id: string }> = await this.client.emitReceipt(receipt);

      const result: ReceiptEmissionResult = {
        event_type: event.event_type,
        entity_id: event.entity_id,
        receipt_id: response.data?.receipt_id ?? null,
        success: response.success,
        error: response.error,
        emitted_at: new Date().toISOString()
      };

      this.emissionLog.push(result);
      return result;
    } catch (error) {
      const result: ReceiptEmissionResult = {
        event_type: event.event_type,
        entity_id: event.entity_id,
        receipt_id: null,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during receipt emission',
        emitted_at: new Date().toISOString()
      };

      this.emissionLog.push(result);
      return result;
    }
  }
}
