/**
 * Export Packet Generation System
 *
 * Re-exports all export generators for the 10-business-law-accounting domain.
 * Each generator produces a typed, print-ready packet from domain objects.
 */

// ── Matter Review ──────────────────────────────────────────────
export {
  generateMatterReviewPacket,
  type MatterReviewPacket,
  type MatterReviewSection,
} from './matterReviewPacket';

// ── Contract Review ────────────────────────────────────────────
export {
  generateContractReviewPacket,
  type ContractReviewPacket,
  type ContractPartyDetail,
} from './contractReviewPacket';

// ── Commercial Decision ────────────────────────────────────────
export {
  generateCommercialDecisionPacket,
  type CommercialDecisionPacket,
  type KernelAssessmentExport,
} from './commercialDecisionPacket';

// ── Receipt Compilation ────────────────────────────────────────
export {
  generateReceiptPacket,
  type ReceiptCompilationPacket,
  type ReceiptEntry,
} from './receiptPacket';

// ── Listening Session ──────────────────────────────────────────
export {
  generateListeningSessionPacket,
  type ListeningSessionPacket,
  type AdvisoryPacketExport,
} from './listeningSessionPacket';

// ── Transcript Review ──────────────────────────────────────────
export {
  generateTranscriptReviewPacket,
  type TranscriptReviewPacket,
  type TranscriptSegmentExport,
} from './transcriptReviewPacket';

// ── Shared Formatting ──────────────────────────────────────────
export {
  formatPacketHeader,
  formatSection,
  formatTimestamp,
  formatProvenance,
  formatPrintLayout,
} from './packetFormatter';
