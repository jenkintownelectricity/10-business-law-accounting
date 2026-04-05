# Spoken Intake Acceptance Policy

**Domain:** Business Law Accounting (10-business-law-accounting)
**Version:** 1.0.0
**Effective:** 2026-04-05

---

## Core Principle

**All spoken intake is UNTRUSTED until typed.** No spoken input may directly produce sovereign domain records. Speech is a convenience input channel, not an authority channel.

## Acceptance Pipeline

All spoken intake must pass through the following pipeline before it may influence domain truth:

### Step 1: Transcription

- Raw audio is transcribed to text by the Voice Assist Layer.
- Transcription includes confidence score, speaker attribution (where available), timestamp, and source session ID.
- The transcript is stored as a TranscriptEnvelope with `trust_level: 'untrusted'`.

### Step 2: Typing into Candidate Envelope

- The transcribed text is parsed into a structured candidate envelope.
- For commands: SpokenCommandCandidate
- For notes: SpokenNoteEnvelope
- For meeting intake: AdvisoryIntakePacket
- Each candidate envelope carries the original transcript reference and is marked `review_status: 'pending'`.

### Step 3: Routing to Appropriate Kernel

- The Commercial Orchestrator receives the candidate envelope.
- Based on content analysis and routing hints, the orchestrator routes to the appropriate kernel(s).
- The candidate is placed in the kernel's review queue, not its active record set.

### Step 4: Practitioner Review

- A qualified practitioner reviews the candidate.
- The practitioner may: accept, modify, reject, or defer the candidate.
- Only upon explicit acceptance does the candidate become eligible for promotion to domain truth.
- Acceptance produces a receipt recording the practitioner, timestamp, and any modifications.

## Prohibitions

- **No direct sovereign action from speech.** A spoken command such as "sign the contract" must not trigger contract signing without typed confirmation.
- **No automatic record creation.** Spoken notes must not automatically create matter records, obligation records, or financial entries.
- **No automatic classification.** Spoken input must not automatically classify items into kernel domains without practitioner review.

## Trust Escalation

Spoken intake trust may only be escalated through the following path:

```
UNTRUSTED (raw audio)
  -> TRANSCRIBED (TranscriptEnvelope)
    -> CANDIDATE (SpokenCommandCandidate / SpokenNoteEnvelope)
      -> REVIEWED (practitioner review)
        -> ACCEPTED (typed confirmation)
          -> DOMAIN TRUTH (kernel record)
```

No step in this chain may be skipped.

---

**This policy ensures that the convenience of voice input never compromises the integrity of domain truth.**
