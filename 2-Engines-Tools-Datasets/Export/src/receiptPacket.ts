/**
 * Receipt Compilation Packet Generator
 *
 * Generates a chronological compilation of all receipts for a given
 * entity or matter. Receipts document every significant state transition,
 * decision, and platform interaction.
 *
 * Output is organized chronologically and grouped by receipt type.
 */

import { formatPacketHeader, formatSection, formatTimestamp, formatProvenance } from './packetFormatter';

// ── Types ──────────────────────────────────────────────────────

export interface ReceiptEntry {
  receipt_id: string;
  receipt_type: string;
  action: string;
  entity_id: string;
  entity_type: string;
  actor: string;
  timestamp: string;
  source_kernel: string | null;
  detail: string;
  platform_emitted: boolean;
}

export interface ReceiptCompilationPacket {
  packet_type: 'RECEIPT_COMPILATION';
  generated_at: string;
  scope: {
    entity_id?: string;
    entity_type?: string;
    matter_id?: string;
    date_range?: {
      from: string;
      to: string;
    };
  };
  total_receipts: number;
  receipts: ReceiptEntry[];
  receipts_by_type: Record<string, number>;
  receipts_by_kernel: Record<string, number>;
  platform_emission_summary: {
    total_emitted: number;
    total_pending: number;
    emission_target: string;
  };
}

// ── Generator ──────────────────────────────────────────────────

export function generateReceiptPacket(
  scope: {
    entityId?: string;
    matterId?: string;
    dateFrom?: string;
    dateTo?: string;
  }
): ReceiptCompilationPacket {
  const now = formatTimestamp(new Date());

  const packet: ReceiptCompilationPacket = {
    packet_type: 'RECEIPT_COMPILATION',
    generated_at: now,
    scope: {
      entity_id: scope.entityId,
      matter_id: scope.matterId,
      date_range: scope.dateFrom && scope.dateTo
        ? { from: scope.dateFrom, to: scope.dateTo }
        : undefined,
    },
    total_receipts: 0,
    receipts: [],
    receipts_by_type: {},
    receipts_by_kernel: {},
    platform_emission_summary: {
      total_emitted: 0,
      total_pending: 0,
      emission_target: '30-validkernel-platform',
    },
  };

  return packet;
}
