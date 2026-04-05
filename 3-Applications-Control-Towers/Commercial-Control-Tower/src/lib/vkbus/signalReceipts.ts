/**
 * Signal Receipts
 * Receipt tracking for emitted signals.
 * Stores emission receipts and correlates with execution spine responses.
 */

export interface SignalReceipt {
  receipt_id: string;
  signal_id: string;
  signal_type: string;
  status: 'EMITTED' | 'ACKNOWLEDGED' | 'ROUTED' | 'EXECUTED' | 'REJECTED' | 'CONSTRAINT_HALT';
  emitted_at: string;
  acknowledged_at?: string;
  completed_at?: string;
  error?: string;
  execution_result?: Record<string, unknown>;
}

export class SignalReceiptStore {
  private receipts = new Map<string, SignalReceipt>();

  recordEmission(signalId: string, signalType: string, receiptId: string): SignalReceipt {
    const receipt: SignalReceipt = {
      receipt_id: receiptId,
      signal_id: signalId,
      signal_type: signalType,
      status: 'EMITTED',
      emitted_at: new Date().toISOString(),
    };
    this.receipts.set(receiptId, receipt);
    return receipt;
  }

  updateStatus(
    receiptId: string,
    status: SignalReceipt['status'],
    result?: Record<string, unknown>,
    error?: string,
  ): SignalReceipt | undefined {
    const receipt = this.receipts.get(receiptId);
    if (!receipt) return undefined;

    receipt.status = status;
    if (status === 'ACKNOWLEDGED') {
      receipt.acknowledged_at = new Date().toISOString();
    }
    if (status === 'EXECUTED' || status === 'REJECTED' || status === 'CONSTRAINT_HALT') {
      receipt.completed_at = new Date().toISOString();
    }
    if (result) {
      receipt.execution_result = result;
    }
    if (error) {
      receipt.error = error;
    }

    return receipt;
  }

  getReceipt(receiptId: string): SignalReceipt | undefined {
    return this.receipts.get(receiptId);
  }

  getReceiptBySignalId(signalId: string): SignalReceipt | undefined {
    for (const receipt of this.receipts.values()) {
      if (receipt.signal_id === signalId) return receipt;
    }
    return undefined;
  }

  getPendingReceipts(): SignalReceipt[] {
    return Array.from(this.receipts.values()).filter(
      (r) => r.status === 'EMITTED' || r.status === 'ACKNOWLEDGED' || r.status === 'ROUTED',
    );
  }

  getCompletedReceipts(): SignalReceipt[] {
    return Array.from(this.receipts.values()).filter(
      (r) => r.status === 'EXECUTED' || r.status === 'REJECTED' || r.status === 'CONSTRAINT_HALT',
    );
  }

  getAllReceipts(): SignalReceipt[] {
    return Array.from(this.receipts.values());
  }
}
