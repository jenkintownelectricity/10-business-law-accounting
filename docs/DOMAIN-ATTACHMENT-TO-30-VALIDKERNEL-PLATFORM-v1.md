# Domain Attachment to 30-validkernel-platform — v1

**FROZEN — v1**
**Domain**: Business Law Accounting Domain OS
**Product**: Commercial Control Tower
**Frozen Date**: 2026-04-05
**Authority**: L0_ARMAND_LEFEBVRE

> This document is FROZEN at v1. Changes require formal change control per `docs/DOMAIN-CHANGE-CONTROL-v1.md`.

---

## Attachment Posture

The Business Law Accounting Domain OS is a sovereign domain that attaches to the `30-validkernel-platform` shared platform. This is a sovereign-domain-to-platform attachment, not a subsystem integration.

**The domain is sovereign.** It owns all business, law, and accounting truth. The platform provides infrastructure patterns that the domain consumes through defined attachment paths. The platform does not inject truth, override constraints, or govern domain-specific decisions.

---

## What the Platform Provides

### Trust-Boundary Evaluation

The platform provides trust-boundary evaluation patterns that the domain uses to assess and promote data from untrusted to trusted status.

- Trust-boundary evaluation logic patterns
- Typed promotion path definitions
- Trust-level classification infrastructure

### Typed Promotion

The platform defines promotion patterns for moving data through trust levels:

- UNTRUSTED to PARTIALLY TRUSTED promotion patterns
- PARTIALLY TRUSTED to TRUSTED promotion patterns
- Promotion receipt generation
- Promotion audit trail infrastructure

### Receipt Infrastructure

The platform provides receipt emission and storage infrastructure:

- Receipt schema definitions
- Receipt emission API patterns
- Receipt storage and retrieval patterns
- Receipt chain integrity verification

### Replay Foundations

The platform provides replay foundation patterns:

- Event sourcing infrastructure patterns
- Replay sequencing support
- State reconstruction patterns
- Replay audit trail infrastructure

### API Runtime Patterns

The platform provides shared API runtime patterns:

- Request/response envelope patterns
- Authentication and authorization infrastructure
- Rate limiting and throttling patterns
- API versioning patterns

### Shared Adapter Contracts

The platform provides adapter contract definitions for external integrations:

- External service adapter interfaces
- Integration health monitoring patterns
- Adapter versioning contracts

---

## What the Domain Retains

The domain retains full sovereignty over:

### All Business Truth
- Entity definitions and management
- Vendor relationships and validation
- Client engagement and lifecycle
- Commercial matter organization
- Operational workflow definitions

### All Law Truth
- Contract definitions and lifecycle
- Obligation tracking and enforcement
- Legal risk assessment methodology
- Compliance determination authority
- Deadline enforcement rules
- Evidence chain management

### All Accounting Truth
- Financial classification authority
- Invoice processing rules
- Ledger entry definitions
- Tax posture determination
- Reconciliation methodology
- Financial reporting definitions

### All Domain Infrastructure
- Kernel boundary definitions
- Domain object type systems
- Constraint family definitions
- Cross-kernel orchestration rules
- UI surface definitions and layout
- Decision bundle assembly rules
- Domain-specific validation logic

---

## Typed Attachment Paths

The domain attaches to the platform through four defined typed paths. All attachment is explicit and typed. No hidden imports, no direct kernel-internal access.

### platformClient

The primary attachment path for general platform service consumption.

```
Domain -> platformClient -> Platform API Runtime
```

- Used for: API calls, service discovery, configuration retrieval
- Trust level: PARTIALLY TRUSTED (platform responses are validated by domain before use)
- Direction: Domain initiates, platform responds

### trustBoundaryBridge

The attachment path for trust-boundary evaluation operations.

```
Domain -> trustBoundaryBridge -> Platform Trust Evaluation
```

- Used for: Evaluating trust level of incoming data, requesting promotion assessments
- Trust level: TRUSTED (trust evaluation logic is platform-provided and domain-accepted)
- Direction: Domain submits data for evaluation, platform returns assessment

### receiptBridge

The attachment path for receipt emission and retrieval.

```
Domain -> receiptBridge -> Platform Receipt Infrastructure
```

- Used for: Emitting domain receipts, retrieving receipt chains, verifying receipt integrity
- Trust level: TRUSTED (receipt infrastructure is platform-governed)
- Direction: Bidirectional — domain emits, platform stores, domain retrieves

### replayBridge

The attachment path for replay foundation operations.

```
Domain -> replayBridge -> Platform Replay Infrastructure
```

- Used for: Event emission for replay, state reconstruction requests, replay sequencing
- Trust level: TRUSTED (replay infrastructure is platform-governed)
- Direction: Domain emits events, platform sequences, domain reconstructs

---

## Voice and Language Ingress Routes

Voice and language augmentation layers route through trust-boundary handling before reaching domain kernels.

### Voice Ingress Path

```
Audio Input -> Speech-to-Text -> [UNTRUSTED Transcript]
  -> trustBoundaryBridge -> Trust Evaluation
  -> [Candidate Envelope] -> Practitioner Review
  -> [TRUSTED Input] -> Commercial Orchestrator -> Kernel(s)
```

### Language Ingress Path

```
Text Input -> Language Interpretation -> [UNTRUSTED Semantic Map]
  -> trustBoundaryBridge -> Trust Evaluation
  -> [Candidate Envelope] -> Practitioner Review (if domain-truth-affecting)
  -> [TRUSTED Input] -> Commercial Orchestrator -> Kernel(s)
```

All voice and language ingress routes through the `trustBoundaryBridge`. No direct path from voice/language output to kernel truth mutation exists.

---

## No Hidden Direct Imports

The domain does not directly import platform kernel internals. All platform consumption goes through the four defined attachment paths.

### Prohibited Patterns

- Direct import of platform internal modules
- Direct database access to platform storage
- Direct event bus subscription to platform internal events
- Direct mutation of platform state from domain code
- Bypassing attachment paths for performance or convenience

### Required Patterns

- All platform access through typed attachment paths
- All platform responses validated by domain before use
- All platform errors handled by domain error boundaries
- All platform version changes verified for compatibility before adoption

---

## Receipt Emission Contract

The domain emits receipts for all significant state transitions. Receipts are emitted through the `receiptBridge` attachment path.

### Receipt-Producing Events

- Kernel truth mutations (create, update, delete of domain objects)
- Trust-level promotions (UNTRUSTED -> PARTIALLY TRUSTED -> TRUSTED)
- Cross-kernel decision bundle assembly
- Constraint evaluation results (especially HALT and WARNING)
- Voice/language intake processing results
- Matter lifecycle transitions
- Practitioner approvals and rejections
- Platform attachment operations

### Receipt Schema

Each receipt contains:

- `receiptId`: Unique identifier
- `timestamp`: ISO 8601 timestamp
- `domain`: `business-law-accounting`
- `sourceKernel`: Which kernel produced the receipt (or `orchestrator`)
- `eventType`: Category of the event
- `eventDetail`: Structured event payload
- `trustLevel`: Trust level at the time of the event
- `actorId`: Who or what initiated the event
- `precedingReceiptId`: Link to the prior receipt in the chain (if applicable)

---

## Replay Foundation Readiness

The domain is designed for replay readiness. All domain state transitions are emitted as events through the `replayBridge` attachment path.

### Replay Readiness Requirements

1. **Event completeness**: Every state transition emits an event sufficient to reconstruct the transition
2. **Event ordering**: Events carry sequence information sufficient for correct replay ordering
3. **Idempotency**: Replaying events produces the same domain state regardless of replay count
4. **Kernel isolation**: Each kernel's events can be replayed independently
5. **Cross-kernel coordination**: Orchestrator events capture the coordination sequence for multi-kernel operations

### Replay Scope

- Individual kernel state can be reconstructed from kernel events
- Full domain state can be reconstructed from all kernel events plus orchestrator events
- Voice/language intake events are included for audit but are not required for domain state reconstruction (they produce candidate envelopes, not truth)

---

## Platform Version Compatibility

The domain tracks platform version compatibility explicitly.

- Platform version changes are evaluated for attachment path compatibility before adoption
- Breaking changes to attachment path contracts require formal change control
- The domain maintains its own platform compatibility version record
- Platform downgrades that affect attachment paths are prohibited without formal review
