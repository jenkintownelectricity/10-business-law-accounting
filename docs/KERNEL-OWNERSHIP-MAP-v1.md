# Kernel Ownership Map v1

**Domain:** 10-business-law-accounting
**Date:** 2026-04-05

---

## Overview

The domain is composed of three sovereign kernels, one orchestrator, and two non-sovereign assistive layers. Each has exclusive ownership over specific domain objects and evaluation authority.

---

## Business Kernel

**Location:** `2-Engines-Tools-Datasets/Business-Kernel/`
**Sovereignty:** SOVEREIGN — owns business truth independently

### Owned Domain Objects
- **Entities** — Business entities (companies, organizations, individuals acting in commercial capacity)
- **Vendors** — Vendor records, validation status, performance history
- **Commercial Matters** — Matter lifecycle, status management, practitioner assignment
- **Business Risk** — Business risk assessment, strategic alignment evaluation

### Evaluation Authority
- Entity validity and completeness
- Vendor validation and ongoing qualification
- Matter readiness for progression through lifecycle stages
- Business risk scoring and threshold evaluation
- Strategic alignment assessment for contracts and decisions
- Relationship value assessment

### Constraints Owned
- `MISSING_ENTITY` — Entity must exist before matter creation
- `INCOMPLETE_MATTER` — Matter fields must meet minimum completeness
- `UNVALIDATED_VENDOR` — Vendor must be validated before engagement
- `RISK_THRESHOLD_EXCEEDED` — Business risk exceeds acceptable threshold

---

## Law Kernel

**Location:** `2-Engines-Tools-Datasets/Law-Kernel/`
**Sovereignty:** SOVEREIGN — owns legal truth independently

### Owned Domain Objects
- **Contracts** — Contract records, terms, clauses, signing status
- **Obligations** — Contractual obligations, deadlines, fulfillment tracking
- **Legal Risk** — Legal risk assessment, liability evaluation
- **Compliance** — Regulatory compliance status and requirements
- **Evidence** — Evidence records, chain of custody, admissibility assessment

### Evaluation Authority
- Contract validity and enforceability
- Obligation identification and deadline tracking
- Legal risk scoring and liability assessment
- Compliance evaluation against applicable regulations
- Evidence sufficiency for legal determinations
- Non-standard clause identification
- Termination and renewal analysis

### Constraints Owned
- `UNSIGNED_CONTRACT` — Contract must be signed before enforcement
- `UNREVIEWED_OBLIGATION` — Obligations require periodic review
- `MISSING_EVIDENCE` — Evidence must be present for legal determinations
- `EXPIRED_DEADLINE` — Overdue obligations escalate automatically

---

## Accounting Kernel

**Location:** `2-Engines-Tools-Datasets/Accounting-Kernel/`
**Sovereignty:** SOVEREIGN — owns financial truth independently

### Owned Domain Objects
- **Invoices** — Invoice records, line items, payment status
- **Ledger Entries** — General ledger entries, classifications, reconciliation
- **Tax** — Tax assessment, jurisdiction handling, compliance
- **Reconciliation** — Account reconciliation, discrepancy tracking
- **Financial Impact** — Financial impact assessment for contracts and decisions

### Evaluation Authority
- Invoice validity and payment processing readiness
- Transaction classification and ledger accuracy
- Tax obligation calculation and jurisdiction handling
- Account reconciliation and discrepancy resolution
- Financial impact assessment for proposed decisions
- Cash flow projection for contract obligations
- Budget alignment verification

### Constraints Owned
- `UNCLASSIFIED_TRANSACTION` — Transactions must be classified before posting
- `MISSING_INVOICE` — Expected invoices must be present for payment
- `UNRECONCILED_ENTRY` — Ledger discrepancies must be resolved

---

## Commercial Orchestrator

**Location:** `2-Engines-Tools-Datasets/Commercial-Orchestrator/`
**Sovereignty:** NON-SOVEREIGN over individual kernel truth. Sovereign over assembly and coordination.

### Owned Processes
- **Decision Bundles** — Assembly of kernel assessments into unified decision packages
- **Cross-Domain Coordination** — Routing evaluation requests to appropriate kernels
- **Conflict Detection** — Identifying contradictions between kernel assessments
- **Provenance Preservation** — Ensuring source-kernel attribution is never lost

### Key Properties
- Never overrides individual kernel assessments
- Assembles but does not evaluate domain truth
- Detects conflicts but requires practitioner resolution
- Preserves `source_kernel` field on every assessment in a bundle
- Routes cross-domain questions to all relevant kernels

### Constraints Owned
- `DECISION_WITHOUT_KERNEL_INPUTS` — All relevant kernels must contribute before decision
- `UNRESOLVED_CONFLICT` — Kernel contradictions must be resolved by practitioner

---

## Voice Assist Layer

**Location:** `2-Engines-Tools-Datasets/Voice-Assist-Layer/`
**Sovereignty:** NON-SOVEREIGN — produces candidates, never truth

### Owned Capabilities
- **Voice Sessions** — Session lifecycle, microphone management, recording state
- **Transcripts** — Raw and processed transcript envelopes
- **Spoken Commands** — Command parsing, intent extraction, routing classification
- **Iron Ear Listening** — Ambient/meeting listening, candidate extraction, advisory generation
- **Dictation** — Structured draft production from spoken input
- **Read-Back** — Reading domain state aloud (read-only, no mutation)

### Key Properties
- All output typed as UNTRUSTED
- Produces candidates and drafts, never sovereign records
- Spoken commands that touch domain truth require practitioner confirmation
- Read-only operations (read-back, navigation) can execute directly
- Listening sessions produce advisory packets routed to review queue

---

## Language Intelligence Layer

**Location:** `2-Engines-Tools-Datasets/Language-Intelligence-Layer/`
**Sovereignty:** NON-SOVEREIGN — produces suggestions, never truth

### Owned Capabilities
- **Normalization** — Text normalization, standardization, formatting consistency
- **Terminology Alignment** — Domain-specific term mapping and suggestion
- **Disambiguation** — Resolving ambiguous terms by presenting options to practitioner

### Key Properties
- All output typed as ADVISORY
- Terminology alignment is suggestive with confidence scores
- Disambiguation presents options but never selects authoritatively
- No language output directly modifies domain records
- Practitioner confirmation required for all terminology decisions
