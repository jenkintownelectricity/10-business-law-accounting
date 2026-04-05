# Platform Attachment Proof v1

**Domain:** 10-business-law-accounting
**Platform:** 30-validkernel-platform
**Date:** 2026-04-05
**Authority:** L0_ARMAND_LEFEBVRE

---

## Purpose

This document proves that 10-business-law-accounting is correctly attached to 30-validkernel-platform as a sovereign domain. The domain consumes platform infrastructure services without surrendering truth ownership.

---

## 1. Trust Boundary Requests Route Through platformClient and trustBoundaryBridge

All trust boundary evaluations follow a single, typed path:

```
Domain Code
  -> platformClient.ts (typed platform client)
    -> trustBoundaryBridge.ts (trust boundary evaluation)
      -> 30-validkernel-platform (external evaluation)
        -> typed response back to domain
```

**Key properties:**
- `platformClient.ts` is the sole entry point for platform communication
- `trustBoundaryBridge.ts` handles trust boundary evaluation requests specifically
- All requests and responses are typed via `platformAttachment.contract.ts`
- No domain code calls the platform directly outside these bridges

**Verification:** Search the codebase for any import from `30-validkernel-platform` that does not go through `4-Workers-Relays-Assistants/`. There should be zero results.

---

## 2. Receipt Bridge Emits Typed Receipts to Platform

Every significant state transition in the domain emits a receipt through the receipt bridge:

```
Domain State Transition
  -> receiptBridge.ts (receipt formatting and emission)
    -> 30-validkernel-platform (receipt storage)
```

**Key properties:**
- Receipts are typed via `ReceiptEnvelope` in the shared type system
- Every receipt includes: receipt_id, domain, action, entity_id, timestamp, source_kernel
- The receipt bridge handles serialization and platform-specific formatting
- Receipt emission is fire-and-forget (does not block domain operations)

**Receipt types emitted:**
- Matter state transitions (created, status changed, closed)
- Contract lifecycle events (drafted, reviewed, signed, expired)
- Obligation tracking events (created, fulfilled, breached)
- Decision thread events (opened, assessed, decided)
- Voice session events (started, completed, reviewed)

---

## 3. Replay Bridge Is Reserved/Operational

The replay bridge exists as a typed interface but is not yet fully operational:

```
replayBridge.ts
  status: RESERVED
  purpose: Future replay/audit trail capability
  interface: Defined in platformAttachment.contract.ts
```

**Key properties:**
- The replay bridge type interface is defined and exported
- Implementation returns RESERVED status for all requests
- No domain code depends on replay being operational
- When activated, replay will consume the existing receipt trail

---

## 4. Domain Remains Sovereign Over Commercial Truth

The platform provides infrastructure. The domain owns truth. This separation is enforced at multiple levels:

**Architectural enforcement:**
- Business Kernel evaluates business risk and entity validity independently
- Law Kernel evaluates legal compliance, obligations, and risk independently
- Accounting Kernel evaluates financial impact, reconciliation, and tax independently
- Commercial Orchestrator assembles kernel outputs but never overrides them
- Platform never injects truth into kernel evaluations

**Type-level enforcement:**
- `platformAttachment.contract.ts` defines the exact interface between domain and platform
- Platform responses are typed as infrastructure responses, not truth assertions
- Kernel assessments carry `source_kernel` provenance that platform cannot modify

**Runtime enforcement:**
- Trust boundary evaluations are requests, not directives
- Receipt emissions are notifications, not approvals
- Platform cannot initiate state transitions in the domain

---

## 5. No Forbidden Direct Import Shortcuts

The following import patterns are forbidden and verified absent:

| Forbidden Pattern | Status |
|---|---|
| Direct import from `30-validkernel-platform/kernel/` | NOT PRESENT |
| Direct import from `30-validkernel-platform/src/internal/` | NOT PRESENT |
| Direct import from `30-validkernel-platform/core/` | NOT PRESENT |
| Any platform import outside `4-Workers-Relays-Assistants/` | NOT PRESENT |

All platform interaction is mediated by the attachment layer in `4-Workers-Relays-Assistants/`.

---

## 6. All Attachment Paths Are Typed via platformAttachment.contract.ts

The platform attachment contract defines:

- `TrustBoundaryRequest` / `TrustBoundaryResponse` — trust evaluation types
- `ReceiptEmission` — receipt emission payload type
- `ReplayRequest` / `ReplayResponse` — replay interface types (RESERVED)
- `PlatformClientConfig` — platform connection configuration
- `VoiceLanguageBoundaryRequest` — voice/language ingress trust type

Every bridge implementation consumes and produces these types exclusively.

---

## 7. Voice/Language Ingress Routes Through voiceLanguageBoundaryBridge to Platform Trust Boundary

Voice and language input follows a specific trust chain:

```
Microphone / Text Input
  -> Voice Assist Layer (produces UNTRUSTED candidate)
    -> voiceLanguageBoundaryBridge.ts (enforces UNTRUSTED status)
      -> trustBoundaryBridge.ts (platform trust evaluation)
        -> Review Queue (practitioner reviews before domain mutation)
```

**Key properties:**
- Voice/language output is always typed as `UNTRUSTED` at ingress
- The voice/language boundary bridge enforces this trust level
- Trust boundary evaluation is required before any domain mutation
- Practitioner review is required before voice-derived input becomes domain truth
- No path exists from voice input to domain truth without trust boundary clearance

---

## Summary

| Attachment Capability | Status | Bridge |
|---|---|---|
| Trust Boundary Evaluation | OPERATIONAL | trustBoundaryBridge.ts |
| Receipt Emission | OPERATIONAL | receiptBridge.ts |
| Replay Foundation | RESERVED | replayBridge.ts |
| Typed Promotion | OPERATIONAL | platformClient.ts |
| API Runtime | OPERATIONAL | platformClient.ts |
| Voice/Language Boundary | OPERATIONAL | voiceLanguageBoundaryBridge.ts |

**Sovereignty preserved:** YES
**Forbidden imports detected:** NONE
**Attachment contract typed:** YES
