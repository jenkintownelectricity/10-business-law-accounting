# Domain Change Control — v1

**FROZEN — v1**
**Domain**: Business Law Accounting Domain OS
**Product**: Commercial Control Tower
**Frozen Date**: 2026-04-05
**Authority**: L0_ARMAND_LEFEBVRE

> This document is FROZEN at v1. Changes require formal change control as defined herein.

---

## Purpose

This document defines the change control process for the Business Law Accounting Domain OS. All modifications to frozen doctrine, kernel boundaries, constraint families, platform attachment, voice/language capabilities, and UI posture must follow this process.

---

## Frozen Doctrine

Frozen doctrine documents may not be modified without formal review and explicit approval.

### Rules

1. No frozen document may be edited in place. All changes produce a new version.
2. A change request must be submitted documenting the proposed modification, the rationale, and the impact assessment.
3. The impact assessment must address all three kernels (business, law, accounting), the orchestrator, the platform attachment, and the voice/language augmentation layer.
4. The domain authority must explicitly approve the change request before a new version is produced.
5. The new version must carry an incremented version number (e.g., v1 -> v2).
6. A receipt must be emitted documenting the version transition, the approver, and the rationale.
7. The previous version remains in the archive for lineage tracking.

---

## Kernel Boundary Changes

Kernel boundary changes affect the fundamental truth ownership structure of the domain. These changes carry the highest scrutiny.

### What Constitutes a Kernel Boundary Change

- Adding a new kernel
- Removing an existing kernel
- Moving types from one kernel to another
- Changing a kernel's truth boundary definition
- Merging two or more kernels
- Splitting a kernel into multiple kernels

### Required Approval

1. Formal change request with detailed rationale
2. Impact assessment across all existing kernels
3. Impact assessment on the Commercial Orchestrator
4. Impact assessment on the UI (navigation, layout, provenance display)
5. Impact assessment on platform attachment paths
6. Impact assessment on constraint families
7. Explicit approval from domain authority
8. Receipt emission documenting the change

---

## Constraint Family Changes

Constraint families define the validation rules that govern domain truth. Changes to constraint families must be versioned and traceable.

### Rules

1. All constraint family changes must be versioned. The version is incremented on every modification.
2. New constraints may be added without removing existing constraints.
3. Removing or modifying an existing constraint requires a change request with impact assessment.
4. Constraint output normalization values (PASS, WARNING, HALT, UNSUPPORTED, PARTIAL) may not be modified without formal review.
5. Cross-domain constraints (those spanning multiple kernels) require impact assessment from all affected kernels.
6. Voice/language constraints require trust-boundary review.
7. A receipt must be emitted for every constraint family version transition.

---

## Platform Attachment Changes

Platform attachment changes affect the infrastructure foundation of the domain. Compatibility must be verified before adoption.

### What Constitutes a Platform Attachment Change

- Changing an attachment path contract (platformClient, trustBoundaryBridge, receiptBridge, replayBridge)
- Upgrading the platform version dependency
- Adding a new attachment path
- Removing an existing attachment path
- Changing the trust level of an attachment path

### Required Verification

1. Compatibility verification against current domain usage of all attachment paths
2. Impact assessment on receipt emission and replay readiness
3. Impact assessment on trust-boundary evaluation behavior
4. Regression testing of all platform-consuming domain operations
5. Explicit approval from domain authority
6. Receipt emission documenting the change

---

## Voice and Language Capability Changes

Voice and language capability changes affect the assistive ingress layer. All changes must be reviewed for trust-boundary compliance.

### What Constitutes a Voice/Language Capability Change

- Adding new voice commands or spoken action types
- Changing speech-to-text processing behavior
- Modifying Iron Ear listening posture
- Changing language normalization rules
- Adding or modifying terminology alignment logic
- Changing the Review Queue routing rules for voice/language output
- Modifying confidence thresholds or scoring

### Required Trust-Boundary Review

1. Verify that the change does not create a path for direct truth mutation from voice/language input
2. Verify that the change does not introduce silent approvals
3. Verify that all new voice/language output types are classified as UNTRUSTED until typed
4. Verify that the Review Queue correctly handles any new candidate envelope types
5. Impact assessment on the Voice Workspace UI components
6. Explicit approval from domain authority
7. Receipt emission documenting the change

---

## UI Changes

UI changes must preserve the workstation posture defined in `docs/DOMAIN-UI-POSTURE-v1.md`.

### Rules

1. UI changes must not introduce visual noise (animations, decorative elements, gratuitous color)
2. UI changes must preserve high-clarity, dense-but-not-cramped workstation aesthetics
3. UI changes must preserve kernel provenance visibility in all cross-kernel views
4. Navigation changes must be documented and must not remove access to any kernel's workspace
5. New UI components must follow the established typography-driven design system
6. Voice Workspace changes must maintain compact, professional appearance
7. Print/export layouts must remain professional and provenance-tagged
8. UI changes that affect trust-boundary visibility (e.g., trust status indicators) require trust-boundary review

---

## Receipt Requirements

All changes produce receipts. No change to the domain occurs without a documented trail.

### Receipt Content for Change Control

Each change control receipt contains:

- `changeRequestId`: Unique identifier for the change request
- `changeType`: Category (doctrine, kernel-boundary, constraint, platform, voice-language, ui)
- `description`: What was changed and why
- `impactAssessment`: Summary of cross-domain impact analysis
- `approvedBy`: Domain authority who approved the change
- `approvedAt`: ISO 8601 timestamp of approval
- `previousVersion`: Reference to the prior version (if applicable)
- `newVersion`: Reference to the new version
- `receiptId`: Unique receipt identifier
- `timestamp`: ISO 8601 timestamp of receipt emission

---

## Change Request Template

```
Change Request ID: [CR-YYYY-NNN]
Date: [YYYY-MM-DD]
Requestor: [Name/Role]
Change Type: [doctrine | kernel-boundary | constraint | platform | voice-language | ui]

## Proposed Change
[Description of what is being changed]

## Rationale
[Why this change is necessary]

## Impact Assessment

### Business Kernel Impact
[Assessment]

### Law Kernel Impact
[Assessment]

### Accounting Kernel Impact
[Assessment]

### Orchestrator Impact
[Assessment]

### Platform Attachment Impact
[Assessment]

### Voice/Language Impact
[Assessment]

### UI Impact
[Assessment]

## Approval
- [ ] Domain authority review
- [ ] Impact assessment review
- [ ] Trust-boundary review (if applicable)
- [ ] Compatibility verification (if applicable)

## Receipt
[Generated upon approval]
```
