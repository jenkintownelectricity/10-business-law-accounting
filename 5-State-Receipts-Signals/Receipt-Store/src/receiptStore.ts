/**
 * Receipt-Store
 *
 * Stores all domain operation receipts.
 */

export interface DomainReceipt {
  receipt_id: string;
  domain: string;
  action: string;
  source_kernel: 'business' | 'law' | 'accounting' | 'orchestrator' | 'voice' | 'language' | 'platform';
  entity_type: string;
  entity_id: string;
  details: Record<string, unknown>;
  timestamp: string;
  platform_receipt_id?: string;
}

export class ReceiptStore {
  private receipts: DomainReceipt[] = [];
  private indexByEntity: Map<string, number[]> = new Map();
  private indexByKernel: Map<string, number[]> = new Map();
  private indexByAction: Map<string, number[]> = new Map();

  /**
   * Emit (store) a receipt and return its receipt_id.
   */
  emit(receipt: DomainReceipt): string {
    const index = this.receipts.length;
    this.receipts.push({ ...receipt });

    // Index by entity
    const entityIndices = this.indexByEntity.get(receipt.entity_id) ?? [];
    entityIndices.push(index);
    this.indexByEntity.set(receipt.entity_id, entityIndices);

    // Index by kernel
    const kernelIndices = this.indexByKernel.get(receipt.source_kernel) ?? [];
    kernelIndices.push(index);
    this.indexByKernel.set(receipt.source_kernel, kernelIndices);

    // Index by action
    const actionIndices = this.indexByAction.get(receipt.action) ?? [];
    actionIndices.push(index);
    this.indexByAction.set(receipt.action, actionIndices);

    return receipt.receipt_id;
  }

  /**
   * Get all receipts for a given entity.
   */
  getByEntity(entityId: string): DomainReceipt[] {
    const indices = this.indexByEntity.get(entityId) ?? [];
    return indices.map((i) => ({ ...this.receipts[i] }));
  }

  /**
   * Get all receipts from a given kernel.
   */
  getByKernel(kernel: string): DomainReceipt[] {
    const indices = this.indexByKernel.get(kernel) ?? [];
    return indices.map((i) => ({ ...this.receipts[i] }));
  }

  /**
   * Get all receipts for a given action.
   */
  getByAction(action: string): DomainReceipt[] {
    const indices = this.indexByAction.get(action) ?? [];
    return indices.map((i) => ({ ...this.receipts[i] }));
  }

  /**
   * Get all receipts within a time range (inclusive).
   */
  getByTimeRange(from: string, to: string): DomainReceipt[] {
    return this.receipts
      .filter((r) => r.timestamp >= from && r.timestamp <= to)
      .map((r) => ({ ...r }));
  }

  /**
   * Get all receipts.
   */
  getAll(): DomainReceipt[] {
    return this.receipts.map((r) => ({ ...r }));
  }
}
