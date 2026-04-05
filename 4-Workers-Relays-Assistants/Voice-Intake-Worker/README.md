# Voice-Intake-Worker

Processes voice intake from dictation and spoken commands. All outputs are non-sovereign.

## Purpose

Receives voice session data, creates TranscriptEnvelopes and SpokenNoteEnvelopes, routes through trust-boundary handling, and creates review queue items. NEVER creates sovereign domain records directly.

## Behavior

- Receives voice session data (dictation, commands)
- Creates TranscriptEnvelope for raw transcript data
- Creates SpokenNoteEnvelope for dictated notes
- Routes all output through trust-boundary handling
- Creates review queue items for practitioner review
- All outputs are non-sovereign until practitioner approval
- Emits domain receipts for all voice intake operations
