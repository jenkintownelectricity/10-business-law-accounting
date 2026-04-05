# Business Law Accounting Trust Stack — v1

**FROZEN — v1**
**Document ID**: trust-stack-v1
**Domain**: Business Law Accounting Domain OS
**Product**: Commercial Control Tower
**Frozen Date**: 2026-04-05
**Authority**: L0_ARMAND_LEFEBVRE

> This is frozen doctrine. Changes require formal change control per `docs/DOMAIN-CHANGE-CONTROL-v1.md`.

---

## Full Trust Stack

The domain enforces a layered trust model. Each layer has a defined trust level that governs what operations it may perform and what authority it carries.

### TRUSTED Layers

These layers are authoritative truth sources or governed execution paths.

| Layer | Trust Level | Authority |
|-------|-------------|-----------|
| Universal Truth Kernel (UTK) | TRUSTED | Foundation truth axioms from `00-Universal_Truth_Kernel` |
| Business Kernel | TRUSTED | Sovereign truth authority for business operations |
| Law Kernel | TRUSTED | Sovereign truth authority for legal obligations |
| Accounting Kernel | TRUSTED | Sovereign truth authority for financial treatment |
| Constraint Ports | TRUSTED | Kernel-owned validation enforcement |
| Execution Spine | TRUSTED | Governed execution path for domain operations |

### PARTIALLY TRUSTED Layers

These layers provide useful data or services but require validation before their output is treated as domain truth.

| Layer | Trust Level | Authority |
|-------|-------------|-----------|
| Service Adapters | PARTIALLY TRUSTED | External integration boundary — data must be validated by kernels |
| Client Data | PARTIALLY TRUSTED | User-provided data — requires kernel validation before becoming truth |

### UNTRUSTED Layers

These layers produce data that must be explicitly promoted through trust-boundary handling before any domain use.

| Layer | Trust Level | Authority |
|-------|-------------|-----------|
| AI Semantic Mapping | UNTRUSTED until typed | Machine interpretation — requires promotion through trust boundary |
| Browser UI State | UNTRUSTED | Client-side state — projection only, never authoritative |
| Voice/Audio Intake | UNTRUSTED until typed | Spoken input — requires full trust-boundary promotion path |
| Speech-to-Text Output | UNTRUSTED until typed | Transcription output — requires review and promotion |
| Language Interpretation Output | UNTRUSTED until typed | Semantic interpretation — requires validation and promotion |
| External APIs | UNTRUSTED | Third-party data — requires validation, typing, and promotion |

---

## Voice and Language Trust Levels

Voice and language augmentation layers carry specific trust classifications:

### Voice Layer Trust

| Component | Trust Level | Notes |
|-----------|-------------|-------|
| Raw audio input | UNTRUSTED | Ambient audio, microphone capture |
| Speech-to-text transcription | UNTRUSTED until typed | Transcribed text, not yet validated |
| Speaker identification | UNTRUSTED until typed | Speaker labels are probabilistic |
| Spoken command interpretation | UNTRUSTED until typed | Interpreted intent, not yet confirmed |
| Voice navigation commands | UNTRUSTED (low risk) | Non-truth-affecting, may execute with reduced friction |
| Voice truth-affecting commands | UNTRUSTED (high risk) | Requires explicit practitioner review before execution |

### Language Layer Trust

| Component | Trust Level | Notes |
|-----------|-------------|-------|
| Terminology normalization suggestions | UNTRUSTED until typed | Suggestive, not authoritative |
| Cross-kernel terminology alignment | UNTRUSTED until typed | Suggestive, requires kernel validation |
| Semantic interpretation | UNTRUSTED until typed | Machine-derived meaning, requires promotion |
| Multilingual translation | UNTRUSTED until typed | Translation output, requires validation |
| Phrase disambiguation | UNTRUSTED until typed | Probabilistic interpretation |

---

## Trust Boundary Enforcement Rules

### Rule 1: No Promotion Without Explicit Action

Data does not automatically promote from UNTRUSTED to TRUSTED. Every promotion requires:
- Trust-boundary evaluation (via `trustBoundaryBridge`)
- Explicit practitioner action (review, approval, confirmation)
- Receipt emission documenting the promotion

### Rule 2: No Bypass for Convenience

High confidence scores, repeated inputs, known speakers, and familiar patterns do not bypass trust-boundary handling. The trust level is determined by the source layer, not the content quality.

### Rule 3: Kernel Validation Is Required

Even after trust-boundary promotion, data must be validated by the relevant kernel before becoming domain truth. Promotion makes data eligible for kernel processing — it does not make it truth.

### Rule 4: Cross-Kernel Trust Is Not Transitive

A determination by the Business Kernel does not automatically carry trust in the Law Kernel's domain. Each kernel independently validates data within its truth boundary.

### Rule 5: Platform Trust Is Scoped

Platform-provided infrastructure (trust evaluation, receipts, replay) is TRUSTED for its defined purpose. Platform trust does not extend to domain truth determination.

---

## Typed Promotion Requirements

### Promotion Path: UNTRUSTED -> PARTIALLY TRUSTED

Requirements:
1. Data has been received through a defined ingress path
2. Data has passed basic structural validation
3. Data has been classified by type (what kind of data is it)
4. Trust-boundary evaluation has been requested and completed
5. A receipt has been emitted documenting the promotion

### Promotion Path: PARTIALLY TRUSTED -> TRUSTED

Requirements:
1. Data has been validated by the relevant kernel
2. Kernel constraints have been evaluated (PASS required, WARNING acceptable with acknowledgment)
3. Practitioner has reviewed and approved (for human-sourced data)
4. Data has been typed into the kernel's type system
5. A receipt has been emitted documenting the promotion

### Promotion Path: UNTRUSTED -> TRUSTED (Voice/Language)

This is the full promotion path for voice and language input:
1. Audio/text captured and processed (UNTRUSTED)
2. Transcription/interpretation produced (UNTRUSTED)
3. Candidate envelope created with metadata (UNTRUSTED)
4. Placed in Review Queue (UNTRUSTED)
5. Practitioner reviews candidate (UNTRUSTED)
6. Practitioner approves candidate (promoting to PARTIALLY TRUSTED)
7. Kernel validates and types the data (promoting to TRUSTED)
8. Receipts emitted at each promotion step

---

## Receipt Requirements for Trust Transitions

Every trust-level transition produces a receipt. No exceptions.

### Receipt Content for Trust Transitions

- `receiptId`: Unique identifier
- `transitionType`: The promotion path (e.g., UNTRUSTED -> PARTIALLY_TRUSTED)
- `sourceLayer`: Which layer produced the data
- `targetKernel`: Which kernel will receive the promoted data (if applicable)
- `evaluationResult`: Trust-boundary evaluation outcome
- `promotedBy`: Who or what performed the promotion
- `timestamp`: ISO 8601 timestamp
- `dataReference`: Reference to the data being promoted (not the data itself)
- `precedingReceiptId`: Link to prior receipt in the chain

### Receipt Chain Integrity

Trust transition receipts form chains. Each receipt references its predecessor. The chain provides a complete audit trail from initial data ingress through final kernel truth acceptance.

Breaking the receipt chain is prohibited. If a receipt cannot be emitted, the trust transition does not proceed.
