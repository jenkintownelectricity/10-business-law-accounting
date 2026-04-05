# Voice-Language Constraints

Constraint family for the Voice and Language layers within the Business Law Accounting sovereign domain.

## Purpose

Voice and language constraints enforce integrity for all voice input, speech-to-text processing, language normalization, and spoken command handling. These constraints ensure that voice/language-derived data is properly enveloped, attributed, and routed before it can influence domain truth.

All voice and language inputs enter the domain as UNTRUSTED and must pass through trust-boundary evaluation before any further processing.

## Constraints

| ID | Name | Description |
|----|------|-------------|
| VOICE-001 | incomplete-transcript-envelope | Halts if transcript envelope missing required fields |
| VOICE-002 | low-confidence-utterance-classification | Warns if speech-to-text confidence below threshold |
| VOICE-003 | missing-speaker-session-provenance | Halts if no session/speaker provenance |
| VOICE-004 | ambiguous-legal-accounting-routing | Warns if cannot determine target kernel |
| VOICE-005 | unsafe-spoken-action-request | Halts if spoken command attempts direct truth mutation |
| VOICE-006 | unsupported-spoken-command | Returns UNSUPPORTED for unrecognized commands |
| VOICE-007 | language-normalization-uncertainty | Warns if normalization confidence is low |
| VOICE-008 | transcription-evidence-completeness | Returns PARTIAL if transcript is incomplete |

## Result Types

- **PASS** — Constraint satisfied, proceed normally
- **WARNING** — Constraint partially met, proceed with caution
- **HALT** — Constraint violated, cannot proceed
- **UNSUPPORTED** — Operation not supported (e.g., unrecognized spoken command)
- **PARTIAL** — Constraint partially evaluated (e.g., incomplete transcript)

## Integration

Voice-language constraints are evaluated at the ingress boundary for all voice and language inputs. They work in conjunction with the Voice-Language Boundary Bridge in the Platform Attachment layer to ensure all voice data passes through trust-boundary evaluation.
