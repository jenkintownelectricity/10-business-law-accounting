# Export Artifacts Guide v1

**Domain:** 10-business-law-accounting
**Date:** 2026-04-05

---

## Overview

The Export system generates typed, print-ready packets from domain objects and workflow outputs. Every significant commercial artifact can be exported for review, sharing, archival, or presentation.

All exports are point-in-time snapshots. They reflect domain state at the moment of generation and may not reflect subsequent changes.

---

## Available Export Packets

### 1. Matter Review Packet

**Generator:** `matterReviewPacket.ts`
**Type:** `MatterReviewPacket`

**Contains:**
- Matter details (title, status, client, assigned practitioner)
- Business Kernel assessment (strategic alignment, risk score, vendor concerns)
- Law Kernel assessment (legal risk level, active obligations, compliance status)
- Accounting Kernel assessment (financial exposure, outstanding invoices, reconciliation status)
- Active constraints and their resolution status
- Evidence inventory with descriptions and dates
- Timeline of significant matter events
- Follow-up actions with assignments and deadlines

**Use Cases:**
- Periodic matter status review
- Client status reports
- Handoff documentation when reassigning matters
- Archival documentation when closing matters

### 2. Contract Review Packet

**Generator:** `contractReviewPacket.ts`
**Type:** `ContractReviewPacket`

**Contains:**
- Contract details (title, type, status, effective and expiry dates)
- Party details with roles, entity IDs, and signing status
- Extracted obligations with deadlines and risk levels
- Law Kernel risk assessment (risk flags, non-standard clauses, compliance concerns)
- Accounting Kernel financial impact (total value, payment schedule, cash flow, tax)
- Business Kernel assessment (strategic alignment, vendor status, relationship value)
- Combined recommendations
- Action items with assignments and priorities
- Provenance (reviewer, review date, kernels consulted)

**Use Cases:**
- Pre-signing contract review
- Contract renewal evaluation
- Dispute documentation
- Regulatory compliance evidence

### 3. Commercial Decision Packet

**Generator:** `commercialDecisionPacket.ts`
**Type:** `CommercialDecisionPacket`

**Contains:**
- Decision question and context
- Business Kernel assessment (recommendation, risk score, rationale, confidence)
- Law Kernel assessment (recommendation, risk score, rationale, confidence)
- Accounting Kernel assessment (recommendation, risk score, rationale, confidence)
- Combined recommendation with rationale
- Conflicts between kernels (if any) with resolution status
- Identified risks with severity, description, and mitigation
- Active constraints
- Action items with kernel attribution
- Decision status and outcome
- Full provenance chain from question to resolution

**Use Cases:**
- Documenting significant business decisions
- Board or stakeholder reporting
- Audit trail for regulatory inquiries
- Post-decision review and learning

### 4. Receipt Compilation Packet

**Generator:** `receiptPacket.ts`
**Type:** `ReceiptCompilationPacket`

**Contains:**
- Scope definition (entity, matter, or date range)
- Chronologically ordered receipt list
- Each receipt: ID, type, action, entity, actor, timestamp, source kernel, detail
- Summary by receipt type (counts)
- Summary by kernel (counts)
- Platform emission summary (emitted vs pending)

**Use Cases:**
- Audit trail documentation
- Compliance evidence
- Activity reporting for a specific entity or matter
- Platform integration verification

### 5. Listening Session Packet

**Generator:** `listeningSessionPacket.ts`
**Type:** `ListeningSessionPacket`

**Contains:**
- Session metadata (type, duration, participants, context, linked matter)
- Full transcript with speaker attribution and per-segment confidence
- Extracted candidates (obligations, deadlines, commitments, risks, action items)
- Advisory packets with suggested actions and confidence scores
- Routing hints (suggested kernel targets for each candidate)
- Review summary (total, reviewed, accepted, rejected, pending)

**Important:** This packet is explicitly marked as non-sovereign (`sovereign: false`, `trust_level: 'UNTRUSTED'`). It documents what was heard and extracted, not domain truth.

**Use Cases:**
- Post-meeting review
- Documentation of what was discussed
- Input for follow-up matter updates
- Training and quality review for listening accuracy

### 6. Transcript Review Packet

**Generator:** `transcriptReviewPacket.ts`
**Type:** `TranscriptReviewPacket`

**Contains:**
- Transcript metadata (source type, duration, segment count, average confidence)
- Speaker details (IDs, names, segment counts, speaking time)
- Full transcript segments with speaker attribution, timestamps, confidence, normalization notes
- Language normalization summary (normalizations, terminology alignments, disambiguation notes)
- Linked matters with relevance descriptions
- Linked entities with mention counts
- Review status and practitioner notes

**Important:** Also marked as non-sovereign. Transcripts are inputs to practitioner review, not domain truth.

**Use Cases:**
- Transcript quality review
- Verification of voice-derived candidates
- Documentation of spoken interactions
- Language normalization audit

---

## How to Generate Each Type

### From the UI
1. Navigate to the relevant entity (matter, contract, decision thread, etc.)
2. Open the action menu (or use command palette)
3. Select "Export [Packet Type]"
4. Review the generated packet
5. Download as file or send to print

### Programmatically
```typescript
import {
  generateMatterReviewPacket,
  generateContractReviewPacket,
  generateCommercialDecisionPacket,
  generateReceiptPacket,
  generateListeningSessionPacket,
  generateTranscriptReviewPacket,
} from '2-Engines-Tools-Datasets/Export/src';

// Generate a matter review packet
const matterPacket = generateMatterReviewPacket('matter-001', {
  includeTimeline: true,
  includeEvidence: true,
});

// Generate a contract review packet
const contractPacket = generateContractReviewPacket('contract-001', {
  includeFinancials: true,
  includeObligations: true,
});

// Generate a decision packet
const decisionPacket = generateCommercialDecisionPacket('thread-001', {
  includeProvenance: true,
  includeConstraints: true,
});

// Generate a receipt compilation
const receiptPacket = generateReceiptPacket({
  matterId: 'matter-001',
  dateFrom: '2026-01-01',
  dateTo: '2026-04-05',
});

// Generate a listening session packet
const listeningPacket = generateListeningSessionPacket('session-001', {
  includeTranscript: true,
  includeRoutingHints: true,
});

// Generate a transcript review packet
const transcriptPacket = generateTranscriptReviewPacket('transcript-001', {
  includeNormalization: true,
  includeLinkedEntities: true,
});
```

---

## Print/Export Formatting

All packets use the shared `packetFormatter` for consistent presentation:

### Header
Every packet begins with a formatted header containing:
- Domain name (Business / Law / Accounting)
- Packet type
- Title
- Generation timestamp
- Entity/matter ID

### Sections
Content is organized into clearly labeled sections with consistent formatting:
- Section titles in uppercase
- Horizontal separators between sections
- Consistent indentation

### Provenance Display
Kernel assessments and actions display provenance:
- Source kernel name in brackets
- Actor identification
- Timestamp
- Detail description

### Timestamps
- ISO 8601 format for machine readability
- Human-readable format for print output
- Consistent timezone handling

### Print Layout
The `formatPrintLayout` function wraps complete packets with:
- Full header
- All content sections
- Footer with generation notice and disclaimer
