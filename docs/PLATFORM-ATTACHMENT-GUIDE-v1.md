# Platform Attachment Guide v1

**Domain:** 10-business-law-accounting
**Platform:** 30-validkernel-platform
**Date:** 2026-04-05

---

## Overview

This guide explains how the domain connects to and interacts with 30-validkernel-platform. The domain is sovereign; the platform provides infrastructure. All interaction is mediated by typed bridges in `4-Workers-Relays-Assistants/`.

---

## Architecture

```
┌──────────────────────────────────────────────────────┐
│  10-business-law-accounting (Sovereign Domain)       │
│                                                      │
│  ┌─────────────┐ ┌──────────┐ ┌───────────────┐    │
│  │ Business    │ │ Law      │ │ Accounting    │    │
│  │ Kernel     │ │ Kernel   │ │ Kernel        │    │
│  └──────┬──────┘ └────┬─────┘ └───────┬───────┘    │
│         │              │               │             │
│         └──────────────┼───────────────┘             │
│                        │                             │
│              ┌─────────┴─────────┐                   │
│              │ Commercial        │                   │
│              │ Orchestrator      │                   │
│              └─────────┬─────────┘                   │
│                        │                             │
│  ┌─────────────────────┴─────────────────────────┐  │
│  │  4-Workers-Relays-Assistants (Attachment)     │  │
│  │                                                │  │
│  │  platformClient.ts ──────────────────────┐    │  │
│  │  trustBoundaryBridge.ts ─────────────────┤    │  │
│  │  receiptBridge.ts ──────────────────────┤    │  │
│  │  replayBridge.ts (RESERVED) ─────────────┤    │  │
│  │  voiceLanguageBoundaryBridge.ts ─────────┤    │  │
│  │  platformAttachment.contract.ts (types) ──┘    │  │
│  └───────────────────────┬───────────────────────┘  │
│                          │                           │
└──────────────────────────┼───────────────────────────┘
                           │
              ┌────────────┴────────────┐
              │ 30-validkernel-platform │
              │ (Shared Infrastructure) │
              └─────────────────────────┘
```

---

## Connection Components

### platformClient.ts
The sole entry point for all platform communication. Manages:
- Connection configuration
- Request serialization
- Response deserialization
- Error handling
- Retry logic

All other bridges use `platformClient` internally. No domain code calls the platform directly.

### platformAttachment.contract.ts
The typed interface contract defining all interactions between domain and platform. Contains:
- `TrustBoundaryRequest` / `TrustBoundaryResponse`
- `ReceiptEmission`
- `ReplayRequest` / `ReplayResponse`
- `PlatformClientConfig`
- `VoiceLanguageBoundaryRequest`

This file is the single source of truth for the attachment interface.

---

## Trust Boundary Evaluation Flow

### When Trust Boundary Evaluation Occurs
- Voice-derived content is submitted for domain inclusion
- External data enters the domain
- Cross-domain requests arrive from other sovereign domains
- Sensitive state transitions require platform-level verification

### Flow

```
1. Domain code calls trustBoundaryBridge.evaluate(request)
2. trustBoundaryBridge validates the request against TrustBoundaryRequest type
3. trustBoundaryBridge calls platformClient.send(request)
4. platformClient serializes and transmits to 30-validkernel-platform
5. Platform evaluates and returns TrustBoundaryResponse
6. trustBoundaryBridge deserializes and returns typed response
7. Domain code acts on the evaluation result
```

### Request Fields
- `source_domain` — Always "business-law-accounting"
- `entity_type` — Type of entity being evaluated
- `entity_id` — ID of the specific entity
- `action` — What action is being requested
- `context` — Additional context for evaluation
- `trust_level` — Current trust level of the input

### Response Fields
- `status` — EVALUATED, REJECTED, ERROR
- `trust_level` — Resulting trust level after evaluation
- `evaluation_id` — Unique ID for audit trail
- `constraints` — Any platform-level constraints applied
- `timestamp` — When evaluation occurred

---

## Receipt Emission Flow

### When Receipts Are Emitted
- Matter state transitions (created, status changed, closed)
- Contract lifecycle events (drafted, reviewed, signed, expired)
- Obligation tracking events (created, fulfilled, breached)
- Decision thread events (opened, assessed, decided)
- Voice session events (started, completed, reviewed)
- Any significant domain state change

### Flow

```
1. Domain state transition occurs
2. Code calls receiptBridge.emit(receipt)
3. receiptBridge validates against ReceiptEmission type
4. receiptBridge calls platformClient.send(receipt)
5. Platform stores the receipt
6. receiptBridge returns confirmation (fire-and-forget)
```

### Receipt Fields
- `receipt_id` — Unique receipt identifier
- `domain` — "business-law-accounting"
- `action` — What happened (e.g., "matter_created", "contract_signed")
- `entity_id` — ID of the affected entity
- `entity_type` — Type of entity
- `source_kernel` — Which kernel originated the action (if applicable)
- `actor` — Who performed the action
- `timestamp` — When it happened
- `detail` — Additional context

### Important Properties
- Receipt emission is fire-and-forget (does not block domain operations)
- Every receipt includes full provenance chain
- Receipts are immutable once emitted
- Platform stores receipts for audit and replay

---

## Replay Readiness

### Current Status: RESERVED

The replay bridge exists as a typed interface but is not yet operational.

### Future Capability
When activated, replay will:
- Consume the receipt trail to reconstruct historical state
- Support point-in-time queries ("What was the matter status on March 15?")
- Enable audit trail verification
- Provide state reconstruction for dispute resolution

### Current Interface
- `replayBridge.query(request)` — Returns `{ status: 'RESERVED' }`
- Type definitions exist in `platformAttachment.contract.ts`
- No domain code depends on replay being operational

---

## Voice/Language Boundary Handling

### Purpose
The `voiceLanguageBoundaryBridge` enforces trust boundaries specifically for voice and language layer output entering the domain.

### Flow

```
Voice/Language Layer Output (UNTRUSTED)
  -> voiceLanguageBoundaryBridge.ingest(input)
    -> Validates UNTRUSTED trust level
    -> Routes to trustBoundaryBridge for evaluation
      -> platformClient -> platform evaluation
    -> Returns evaluation result
  -> If cleared: routes to review queue for practitioner review
  -> If rejected: logs rejection and notifies
```

### Enforcement Rules
- Input MUST be typed as UNTRUSTED
- Bridge rejects any input claiming higher trust level
- All domain-touching content routes through trust boundary evaluation
- Read-only operations (read-back, navigation) bypass trust evaluation
- Results always route to review queue (never directly to domain state)

---

## Forbidden Patterns

The following patterns are architecturally forbidden:

| Pattern | Why Forbidden |
|---|---|
| Direct import from `30-validkernel-platform/kernel/` | Bypasses attachment layer |
| Direct import from `30-validkernel-platform/src/internal/` | Accesses platform internals |
| Direct HTTP calls to platform APIs | Bypasses typed bridges |
| Platform writing to domain state | Violates sovereignty |
| Domain bypassing trust boundary for external input | Compromises trust model |
| Voice output directly modifying domain state | Bypasses review requirement |

All platform interaction MUST route through `4-Workers-Relays-Assistants/` bridges.
