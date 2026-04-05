# Workflows

Core governed workflows for the **10-Business-Law-Accounting** sovereign domain.

## Purpose

Each workflow is a governed processing track that:

1. Accepts typed inputs (documents, voice transcripts, matter records, etc.)
2. Routes through appropriate kernels (Business, Law, Accounting)
3. Evaluates constraints at each stage
4. Produces typed, receipted outputs
5. Enforces practitioner review where required

Workflows are the primary orchestration mechanism that connects domain objects, kernel operations, and the constraint system into coherent practitioner-facing processes.

## Workflow Catalog

### Document and Record Workflows

| Workflow | Input | Output | Kernels |
|----------|-------|--------|---------|
| **Contract Review** | Contract document/reference | `ContractReviewPacket` with obligations, risks, financial impact, recommendations | Law, Accounting, Business |
| **Invoice Processing** | Invoice document/data | Classified invoice, ledger entries, constraint evaluations | Accounting, Business, Law (conditional) |
| **Matter Intake** | New matter (manual or spoken) | `Matter` in INTAKE status with kernel assignments | All (as determined) |

### Decision and Tracking Workflows

| Workflow | Input | Output | Kernels |
|----------|-------|--------|---------|
| **Decision Thread** | Matter requiring cross-domain decision | `CommercialDecisionBundle` with provenance | All |
| **Obligation Tracking** | Extracted or identified obligations | Updated obligation status, deadline signals | Law, Business, Accounting |

### Voice and Language Workflows

| Workflow | Input | Output | Kernels |
|----------|-------|--------|---------|
| **Hands-Free Dictation** | Spoken note/analysis/task | Practitioner-editable structured draft (never sovereign) | Routed kernel |
| **Iron Ear Listening** | Meeting/call audio | `ListeningSession` envelope with advisory packets | All (advisory) |
| **Language Expert** | Complex/multilingual/domain text | `LanguageNormalizationPacket` with interpretation support | All (routing) |

## Governance Invariants

1. **No workflow produces sovereign output from untrusted input without practitioner review.**
2. Every workflow stage that mutates state produces a receipt.
3. Constraint violations halt the workflow and surface to the practitioner.
4. Cross-domain workflows always route through the Commercial Orchestrator.
5. Voice/language workflows always produce UNTRUSTED candidates until reviewed.

## Usage

```typescript
import {
  executeContractReview,
  executeInvoiceProcessing,
  executeMatterIntake,
} from '@10-bla/workflows';
```
