# Domain Architecture and Sovereignty — v1

**FROZEN — v1**
**Domain**: Business Law Accounting Domain OS
**Product**: Commercial Control Tower
**Frozen Date**: 2026-04-05
**Authority**: L0_ARMAND_LEFEBVRE

> This document is FROZEN at v1. Changes require formal change control per `docs/DOMAIN-CHANGE-CONTROL-v1.md`.

---

## Sovereign Domain Architecture

The Business Law Accounting Domain OS operates as a sovereign domain. It owns all truth related to business operations, legal obligations, and accounting treatment. No external system, platform, user interface, or augmentation layer may override, merge, or silently resolve domain truth.

The domain is architecturally organized around three sovereign internal kernels, one governed orchestrator, one attached platform runtime, one unified UI projection surface, and one assistive voice/language augmentation layer.

---

## Three Kernel Boundaries

Each kernel is a sovereign truth authority within its discipline. Kernels do not share truth storage, do not merge type systems, and do not silently resolve conflicts between disciplines.

### Business Kernel

- **Scope**: Business operations, commercial matters, entity management, vendor relationships, client engagement, operational workflows
- **Truth Boundary**: The Business Kernel is the sole authority on what constitutes a business entity, a commercial matter, a vendor relationship, or a client engagement within this domain
- **Owned Types**: Entity, Vendor, Client, Matter, CommercialRelationship, OperationalWorkflow
- **Owned Constraints**: Entity completeness, vendor validation, matter lifecycle integrity, client relationship status
- **Validation**: The Business Kernel validates all business-domain objects before they are considered truth

### Law Kernel

- **Scope**: Contracts, obligations, legal risk assessments, compliance determinations, deadlines, evidence chains
- **Truth Boundary**: The Law Kernel is the sole authority on what constitutes a contractual obligation, a legal risk, a compliance determination, or an enforceable deadline within this domain
- **Owned Types**: Contract, Obligation, LegalRisk, ComplianceDetermination, Deadline, Evidence, LegalReview
- **Owned Constraints**: Contract signing status, obligation review completeness, evidence chain integrity, deadline enforcement, compliance posture validity
- **Validation**: The Law Kernel validates all legal-domain objects before they are considered truth

### Accounting Kernel

- **Scope**: Financial transactions, invoices, ledger entries, financial classifications, tax posture, reconciliation records
- **Truth Boundary**: The Accounting Kernel is the sole authority on what constitutes a financial classification, a ledger entry, a tax posture determination, or a reconciliation status within this domain
- **Owned Types**: Transaction, Invoice, LedgerEntry, FinancialClassification, TaxPosture, ReconciliationRecord
- **Owned Constraints**: Transaction classification completeness, invoice validity, reconciliation status, tax posture accuracy, ledger integrity
- **Validation**: The Accounting Kernel validates all accounting-domain objects before they are considered truth

---

## Commercial Orchestrator

The Commercial Orchestrator coordinates across the three kernels. It does not own truth. It does not override kernel determinations. It does not silently resolve conflicts.

### Orchestrator Responsibilities

1. **Routing**: Direct incoming matters, documents, and actions to the appropriate kernel(s)
2. **Assembly**: Assemble decision bundles that include assessments from each applicable kernel
3. **Provenance**: Preserve source-kernel provenance in all combined outputs
4. **Conflict Detection**: Detect cross-kernel conflicts and surface them for practitioner resolution
5. **Lifecycle Management**: Manage matter lifecycle transitions that span multiple kernels
6. **Platform Coordination**: Coordinate platform attachment operations on behalf of kernels

### Orchestrator Constraints

- The orchestrator never determines truth — it coordinates truth from sovereign sources
- All orchestrator outputs carry provenance tags indicating which kernel(s) contributed
- Cross-kernel conflicts are surfaced to the practitioner, never silently resolved
- The orchestrator does not maintain its own truth store
- The orchestrator does not define its own types that override kernel types

---

## Platform Attachment Posture

The domain attaches to `30-validkernel-platform` for infrastructure services. This attachment is for infrastructure, not for truth ownership.

### What the Platform Provides
- Trust-boundary evaluation patterns
- Typed promotion infrastructure
- Receipt emission infrastructure
- Replay foundation patterns
- API runtime patterns
- Shared adapter contracts

### What the Platform Does NOT Provide
- Business truth
- Legal truth
- Accounting truth
- Domain-specific constraints
- Kernel boundary definitions
- Domain object type definitions

The platform is an infrastructure dependency. The domain remains the sole authority on all business, law, and accounting truth.

---

## UI as Projection Surface

The Commercial Control Tower UI is a projection surface. It renders domain truth but does not own domain truth.

### UI Posture Rules

1. The UI does not store authoritative domain state — it projects kernel state
2. The UI does not resolve conflicts between kernels — it surfaces them
3. The UI does not validate domain objects — kernels validate
4. The UI does not promote untrusted data to trusted — trust boundaries do
5. Browser UI state is UNTRUSTED — it must be confirmed against kernel truth before any domain operation

---

## Voice and Language Layers as Assistive Ingress

Voice and language layers are assistive ingress mechanisms. They help practitioners input information and navigate the system. They do not own truth.

### Voice/Language Posture Rules

1. All spoken input is UNTRUSTED until promoted through trust-boundary handling
2. All speech-to-text output is UNTRUSTED until promoted through trust-boundary handling
3. All semantic interpretation is UNTRUSTED until promoted through trust-boundary handling
4. Voice commands that touch sovereign domain truth require practitioner review
5. Language normalization is suggestive, never authoritative
6. No voice or language layer may directly mutate domain truth
7. No silent approvals from voice or language pathways

---

## Trust Stack Definition

The domain enforces a layered trust model. Each layer has a defined trust level that governs what operations it may perform.

| Layer | Trust Level | Notes |
|-------|-------------|-------|
| Universal Truth Kernel (UTK) | TRUSTED | Foundation truth axioms |
| Domain Kernels (Business, Law, Accounting) | TRUSTED | Sovereign truth authorities |
| Constraint Ports | TRUSTED | Kernel-owned validation |
| Execution Spine | TRUSTED | Governed execution path |
| Service Adapters | PARTIALLY TRUSTED | External integration boundary |
| Client Data | PARTIALLY TRUSTED | Requires validation before use |
| AI Semantic Mapping | UNTRUSTED until typed | Must be promoted through trust boundary |
| Browser UI State | UNTRUSTED | Projection only, not authoritative |
| Voice/Audio Intake | UNTRUSTED until typed | Must be promoted through trust boundary |
| Speech-to-Text Output | UNTRUSTED until typed | Must be promoted through trust boundary |
| External APIs | UNTRUSTED | Must be validated and typed before domain use |

---

## Domain Boundary Enforcement Rules

1. **No cross-kernel truth mutation**: One kernel may not directly modify another kernel's truth objects
2. **No orchestrator truth override**: The orchestrator coordinates but does not override
3. **No UI truth storage**: The UI projects but does not store authoritative truth
4. **No platform truth injection**: The platform provides infrastructure, not truth
5. **No voice/language direct mutation**: Assistive layers suggest but do not determine
6. **No silent conflict resolution**: All cross-kernel conflicts are surfaced to the practitioner
7. **No unreceipted transitions**: All trust-level transitions produce receipts
8. **No untyped promotion**: Data must be explicitly typed before promotion from untrusted to trusted

---

## The No Truth Collapse Principle

Truth collapse occurs when distinct truth sources are merged, overridden, or silently resolved without preserving the distinct identity and authority of each source.

This domain prohibits truth collapse in all forms:

- **Kernel-to-kernel collapse**: The Business Kernel's determination about a matter's commercial status does not override the Law Kernel's determination about the same matter's legal risk
- **Orchestrator collapse**: The orchestrator does not blend kernel outputs into a single undifferentiated determination
- **UI collapse**: The UI does not present blended kernel outputs as if they came from a single source
- **Platform collapse**: Platform infrastructure does not impose truth on domain objects
- **Augmentation collapse**: Voice and language layers do not inject truth into domain objects without explicit trust-boundary promotion

Every output that combines information from multiple kernels must preserve the provenance of each kernel's contribution. The practitioner always sees which kernel said what.
