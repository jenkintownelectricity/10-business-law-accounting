// ───────────────────────────────────────────────────────────���──
//  Services — Re-export Index
//  All domain API services for the 10-Business-Law-Accounting
//  sovereign domain runtime.
// ───────────────────────────────────────��──────────────────────

export { MatterService } from './matterService.js';
export type {
  CreateMatterRequest,
  UpdateMatterRequest,
  ListMattersFilter,
  AddNoteRequest,
  AddEvidenceRequest,
  TimelineEntry,
} from './matterService.js';

export { ContractService } from './contractService.js';
export type {
  CreateContractRequest,
  UpdateContractRequest,
  ListContractsFilter,
  ObligationExtractionResult,
  ExtractedObligation,
  FinancialImpactAssessment,
  BusinessImpactAssessment,
} from './contractService.js';

export { ObligationService } from './obligationService.js';
export type {
  CreateObligationRequest,
  UpdateObligationRequest,
  ListObligationsFilter,
} from './obligationService.js';

export { AccountingService } from './accountingService.js';
export type {
  CreateAccountingEventRequest,
  ClassifyTransactionRequest,
  AssignPeriodRequest,
  CreateInvoiceRequest,
  ProcessInvoiceRequest,
  ReconcileEntryRequest,
  TaxAssessmentResult,
  FinancialSummary,
} from './accountingService.js';

export { ReviewQueueService } from './reviewQueueService.js';
export type {
  ReviewItem,
  ReviewItemType,
  ReviewItemStatus,
  AddToQueueRequest,
  ReviewItemRequest,
  ApproveItemRequest,
  RejectItemRequest,
} from './reviewQueueService.js';

export { SearchService } from './searchService.js';
export type {
  SearchableType,
  SearchResult,
  SearchQuery,
  SavedView,
  SavedFilter,
  GlobalSearchResponse,
  SearchFacets,
} from './searchService.js';

export { VoiceIntakeService } from './voiceIntakeService.js';
export type {
  StartDictationRequest,
  DictationSession,
  ProcessSpokenCommandRequest,
  SpokenCommandResult,
  CreateTranscriptEnvelopeRequest,
  RouteSpokenNoteRequest,
} from './voiceIntakeService.js';

export { TranscriptReviewService } from './transcriptReviewService.js';
export type {
  TranscriptReviewFilter,
  ApproveTranscriptRequest,
  ApproveTranscriptResult,
  RejectTranscriptRequest,
  EditTranscriptRequest,
  LinkTranscriptRequest,
} from './transcriptReviewService.js';

export { LanguageNormalizationService } from './languageNormalizationService.js';
export type {
  NormalizeTextRequest,
  AlignTerminologyRequest,
  DisambiguatePhraseRequest,
  RoutingHintResult,
} from './languageNormalizationService.js';

export { ListeningSessionService } from './listeningSessionService.js';
export type {
  StartSessionRequest,
  ExtractedCandidates,
  AdvisoryPacketData,
} from './listeningSessionService.js';

export { AdvisoryRoutingService } from './advisoryRoutingService.js';
export type {
  RoutePacketRequest,
  ValidationResult,
  RoutingOutcome,
  AdvisoryOutcomeRecord,
} from './advisoryRoutingService.js';

export { ExportService } from './exportService.js';
export type {
  ExportMetadata,
  MatterReviewPacket,
  ContractReviewPacket,
  CommercialDecisionPacket,
  ReceiptPacket,
  ListeningSessionPacket,
  TranscriptReviewPacket,
} from './exportService.js';
