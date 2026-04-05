# Dictated Note Routing Policy

**Domain:** Business Law Accounting (10-business-law-accounting)
**Version:** 1.0.0
**Effective:** 2026-04-05

---

## Core Principle

**Dictated notes produce SpokenNoteEnvelope objects.** These envelopes are routed through the Commercial Orchestrator for kernel classification and become structured drafts for practitioner editing. Dictated notes never directly create domain records.

## SpokenNoteEnvelope Lifecycle

### 1. Capture

When a practitioner dictates a note, the Voice Assist Layer produces a SpokenNoteEnvelope containing:

- The raw transcript text
- Speaker identity (the dictating practitioner)
- Timestamp and session reference
- Confidence score
- Preliminary content classification hints

### 2. Routing via Commercial Orchestrator

The SpokenNoteEnvelope is submitted to the Commercial Orchestrator, which:

1. Analyzes the note content for kernel relevance.
2. Classifies the note as primarily **business**, **law**, or **accounting** (or multi-kernel).
3. Applies Language Intelligence Layer normalization if the content contains ambiguous terminology.
4. Routes the classified envelope to the appropriate kernel review queue(s).

### 3. Kernel Classification

Each receiving kernel processes the note according to its domain:

| Kernel | Processing |
|---|---|
| **Business** | Extracts entity references, vendor mentions, commercial matter context |
| **Law** | Extracts contract references, obligation mentions, legal deadline indicators, privilege markers |
| **Accounting** | Extracts financial figures, invoice references, ledger classification hints, tax implications |

### 4. Structured Draft Production

The kernel produces a structured draft from the note content. This draft:

- Maps note content to the kernel's typed fields.
- Flags uncertain or ambiguous mappings.
- Preserves the original SpokenNoteEnvelope reference.
- Is marked as `status: 'draft'` and `requires_review: true`.

### 5. Practitioner Editing

The practitioner reviews the structured draft and may:

- Accept the draft as-is (promoting it to an active record).
- Edit fields before acceptance.
- Reject the draft (returning it to the note archive).
- Split the draft into multiple records across kernels.

## Prohibitions

- Dictated notes must **never** directly create matter records, contract records, financial entries, or obligation records.
- Dictated notes must **never** trigger automated workflows without practitioner review.
- Dictated notes must **never** be treated as signed or executed documents.

## Multi-Kernel Notes

When a dictated note spans multiple kernels (e.g., "Invoice 4521 relates to the Smith contract and we need to review the vendor relationship"), the orchestrator:

1. Identifies all relevant kernels.
2. Routes the note to each kernel's review queue.
3. Each kernel independently produces its structured draft.
4. The practitioner reviews and coordinates across the drafts.

---

**This policy ensures dictated notes are a productivity aid, not an unreviewed path to domain truth.**
