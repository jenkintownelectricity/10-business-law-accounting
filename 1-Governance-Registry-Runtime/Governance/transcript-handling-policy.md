# Transcript Handling Policy

**Domain:** Business Law Accounting (10-business-law-accounting)
**Version:** 1.0.0
**Effective:** 2026-04-05

---

## Core Principle

**Transcripts are evidence artifacts.** They record what was said, by whom, and when. Transcripts alone are not domain truth. They serve as provenance material for practitioner review and decision-making.

## Storage Requirements

Every transcript must be stored as a TranscriptEnvelope containing:

| Field | Required | Description |
|---|---|---|
| `id` | Yes | Unique transcript identifier |
| `session_id` | Yes | Reference to the originating voice/meeting session |
| `transcript_text` | Yes | The transcribed text content |
| `speaker_attribution` | Where available | Identification of the speaker(s) |
| `timestamp` | Yes | ISO 8601 timestamp of when the speech occurred |
| `source_device_id` | Yes | Identifier of the device that captured the audio |
| `source_session_id` | Yes | Identifier of the session context |
| `confidence_score` | Yes | Transcription confidence (0.0 to 1.0) |
| `source_type` | Yes | Type of source: 'dictation', 'meeting', 'command', 'conversation' |
| `review_status` | Yes | Current review status: 'pending', 'reviewed', 'accepted', 'rejected' |

## Provenance Chain

Each transcript must maintain a provenance chain linking it to:

1. The originating audio session.
2. Any derived candidate envelopes (SpokenCommandCandidate, SpokenNoteEnvelope, AdvisoryIntakePacket).
3. Any practitioner review actions taken.
4. Any domain records ultimately created from the transcript content.

## Retention

- Transcripts are retained as evidence artifacts for the duration of the associated matter or engagement.
- Transcripts may not be deleted while any derived domain record remains active.
- Archived transcripts follow the domain archive policy in 6-Archive-Lineage.

## Limitations

- **Transcripts are not domain truth.** A transcript stating "the contract is signed" does not constitute a signed contract.
- **Transcripts are not authoritative records.** They supplement but do not replace typed, reviewed domain records.
- **Transcripts with low confidence scores** (below 0.7) must be flagged for manual review before any derived candidates are routed.

## Access Control

- Transcripts containing privileged communications must be tagged with appropriate privilege markers.
- Access to transcripts follows the same access controls as the associated matter or engagement.

---

**This policy ensures transcripts are properly handled as evidence while preventing their misuse as authoritative domain records.**
