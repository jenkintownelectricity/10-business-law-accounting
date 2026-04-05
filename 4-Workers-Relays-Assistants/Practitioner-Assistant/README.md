# Practitioner-Assistant

AI-assisted practitioner support. Non-sovereign, advisory only.

## Purpose

Provides AI-assisted capabilities for practitioners including matter summarization, missing input identification, open loop tracking, draft review packet preparation, next task recommendation, work organization, spoken prompt processing, read-back summaries, and dictated note routing.

## Capabilities

- **summarizeMatter(matterId)**: Produces matter summary
- **highlightMissingInputs(matterId)**: Identifies incomplete data
- **showOpenLoops(matterId)**: Lists unresolved legal/accounting/business items
- **prepareDraftReviewPacket(matterId)**: Creates draft review packet
- **recommendNextTask(matterId)**: Suggests next action
- **organizeWork(practitionerId)**: Sorts matters by priority/deadline
- **acceptSpokenPrompt(transcript)**: Processes spoken request into actionable candidate
- **readBackSummary(matterId)**: Produces text for read-back
- **routeDictatedNote(spokenNote)**: Routes dictated note to structured draft

## Important

All assistant outputs are advisory and non-sovereign. They do not constitute domain truth and require practitioner review before any domain state changes.
