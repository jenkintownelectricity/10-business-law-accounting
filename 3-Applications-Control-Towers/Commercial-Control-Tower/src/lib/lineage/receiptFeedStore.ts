/**
 * Receipt Feed Store
 *
 * Store for receipt feed items. Tracks receipts from executed operations.
 * Read-only from the UI perspective -- receipts arrive via VKBUS subscription.
 */

export interface ReceiptFeedItem {
  receiptId: string;
  timestamp: string;
  operation: string;
  kernel: string;
  entityId: string;
  status: 'success' | 'failure' | 'pending';
  confidence: number;
  hasViolation: boolean;
  violationType?: 'WARNING' | 'CRITICAL';
  parentReceiptId?: string;
  isNew: boolean;
}

export interface ReceiptFeedState {
  items: ReceiptFeedItem[];
  lastUpdated: string | null;
  totalCount: number;
  unreadCount: number;
}

export function createReceiptFeedStore() {
  let state: ReceiptFeedState = {
    items: [],
    lastUpdated: null,
    totalCount: 0,
    unreadCount: 0,
  };

  const listeners: Set<(state: ReceiptFeedState) => void> = new Set();

  function notify() {
    listeners.forEach((listener) => listener(state));
  }

  return {
    getState(): ReceiptFeedState {
      return state;
    },

    subscribe(listener: (state: ReceiptFeedState) => void): () => void {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    addReceipt(item: ReceiptFeedItem): void {
      state = {
        ...state,
        items: [{ ...item, isNew: true }, ...state.items],
        lastUpdated: new Date().toISOString(),
        totalCount: state.totalCount + 1,
        unreadCount: state.unreadCount + 1,
      };
      notify();
    },

    markAllRead(): void {
      state = {
        ...state,
        items: state.items.map((item) => ({ ...item, isNew: false })),
        unreadCount: 0,
      };
      notify();
    },

    markRead(receiptId: string): void {
      const item = state.items.find((i) => i.receiptId === receiptId);
      if (item && item.isNew) {
        state = {
          ...state,
          items: state.items.map((i) =>
            i.receiptId === receiptId ? { ...i, isNew: false } : i
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        };
        notify();
      }
    },

    getReceiptsForEntity(entityId: string): ReceiptFeedItem[] {
      return state.items.filter((item) => item.entityId === entityId);
    },

    clear(): void {
      state = {
        items: [],
        lastUpdated: null,
        totalCount: 0,
        unreadCount: 0,
      };
      notify();
    },
  };
}

export type ReceiptFeedStore = ReturnType<typeof createReceiptFeedStore>;
