# Voice Workflow Guide v1

**Domain:** 10-business-law-accounting
**Date:** 2026-04-05

---

## Overview

Voice capabilities enable hands-free operation of the Commercial Control Tower. All voice features are non-sovereign — they produce candidates, drafts, and advisory packets that require practitioner review before becoming domain truth.

---

## 1. Hands-Free Dictation Workflow

### Purpose
Capture practitioner notes, observations, and instructions via voice, producing structured drafts linked to matters.

### How It Works

1. **Activate dictation** — Press the mic button or say "Start dictation"
2. **Select target matter** — Choose which matter the dictation relates to (optional)
3. **Speak naturally** — The system captures and transcribes in real time
4. **View live transcript** — Real-time display with confidence indicators
5. **End dictation** — Press mic button again or say "Stop dictation"
6. **Review draft** — System produces a structured draft from the transcript
7. **Edit and approve** — Practitioner reviews, edits if needed, and approves
8. **Draft becomes record** — Only after approval does the note enter domain state

### Trust Boundaries
- Raw transcript is typed as UNTRUSTED
- Structured draft requires practitioner review
- Approved draft enters domain state through trust boundary
- No dictated content becomes a sovereign record without review

### Tips
- Speak in complete thoughts for better structure
- Name entities clearly ("Henderson matter", "Acme Corp contract")
- Pause briefly between distinct notes
- Use "new paragraph" or "next item" for structure cues
- Say "read back" to hear what was captured

---

## 2. Iron Ear Listening Workflow

### Purpose
Capture and analyze ambient audio from meetings, calls, depositions, and negotiations to extract actionable candidates.

### How It Works

1. **Start listening session** — Open Voice Workspace, select "Start Listening"
2. **Configure session** — Set session type (meeting, call, deposition, negotiation)
3. **Add participants** — Name the participants for speaker attribution
4. **Link matter** — Associate the session with a matter (optional)
5. **Listening runs continuously** — System transcribes and extracts candidates in real time
6. **Candidates flagged** — Obligations, deadlines, commitments, risks, and action items are extracted
7. **Advisory packets generated** — Non-sovereign observations for practitioner review
8. **End session** — Say "End listening" or press the stop button
9. **Review extracted items** — All candidates appear in the review queue
10. **Accept or reject** — Practitioner reviews each candidate individually

### What Gets Extracted
- **Obligations** — "We agree to deliver by September 30th"
- **Deadlines** — "The filing deadline is next Friday"
- **Commitments** — "I will send the revised terms tomorrow"
- **Risks** — "There may be a regulatory issue with the import clause"
- **Action Items** — "Let's schedule a follow-up for next week"

### Trust Boundaries
- All extracted candidates are UNTRUSTED
- Advisory packets are non-sovereign
- Nothing from a listening session directly modifies domain truth
- Each candidate must be individually reviewed and approved
- Routing hints suggest which kernel should evaluate, but the practitioner decides

---

## 3. Language Expert Workflow

### Purpose
Leverage language intelligence for terminology alignment, normalization, and disambiguation in domain documents and transcripts.

### How It Works

1. **Automatic normalization** — When text enters the system (from dictation, import, or input), the language layer normalizes it
2. **Terminology suggestions** — Domain-specific terms are flagged with alignment suggestions
3. **Disambiguation prompts** — Ambiguous terms present options to the practitioner
4. **Practitioner confirms** — All suggestions require explicit confirmation
5. **Applied normalizations logged** — Every change is recorded for audit

### Examples
- "NDA" normalized to "Non-Disclosure Agreement" with reference to domain glossary
- "Acme" disambiguated: "Did you mean Acme Corp (vendor) or Acme Holdings (client)?"
- Dates normalized to consistent format (ISO 8601)
- Currency amounts standardized with explicit currency codes

### Trust Boundaries
- Language output is ADVISORY only
- Suggestions require practitioner confirmation
- No terminology change is applied silently
- All normalizations are reversible

---

## 4. Spoken Command Usage

### Available Commands

#### Navigation (no confirmation needed)
- "Go to overview" / "Show me the overview"
- "Open matter Henderson" / "Navigate to contracts"
- "Show upcoming deadlines" / "Open review queue"

#### Search (no confirmation needed)
- "Search for Henderson contracts"
- "Find all overdue obligations"
- "Look up Acme Corp vendor status"

#### Read-Back (no confirmation needed)
- "Read back the Henderson matter summary"
- "What are today's deadlines?"
- "Summarize the Acme contract obligations"

#### Domain Actions (confirmation required)
- "Create a new matter for Henderson" -> Confirmation prompt
- "Mark obligation OBL-001 as fulfilled" -> Confirmation prompt
- "Add a note to the Henderson matter" -> Routes to dictation, then review
- "Start a decision thread for the Acme contract" -> Confirmation prompt

#### Destructive Actions (confirmation + verification)
- "Delete the Henderson matter" -> Confirmation + verbal verification
- "Archive all closed matters" -> Confirmation + verbal verification

### Command Feedback
- Visual confirmation of recognized command
- Audio feedback for successful execution
- Explicit prompt for commands requiring confirmation
- Error feedback for unrecognized commands

---

## 5. Read-Back Support

### Purpose
Allow the practitioner to hear domain state read aloud without looking at the screen.

### Available Read-Backs
- **Matter summary** — Title, status, client, key constraints, next deadline
- **Obligation status** — Obligation description, deadline, fulfillment status
- **Contract terms** — Key terms, parties, value, expiry
- **Today's agenda** — Due-today items, upcoming deadlines, review queue count
- **Decision thread status** — Question, kernel recommendations, current status

### How to Use
- Say "Read back [object]" or "What is the status of [object]?"
- System reads the information aloud
- No domain state is modified
- Read-back can be interrupted: "Stop" or "Skip"

### Trust Boundaries
- Read-back is strictly read-only
- No domain mutation occurs during read-back
- Read-back accesses current domain state (does not create new state)

---

## 6. Trust Boundaries for Voice Input

### The Fundamental Rule
No voice input becomes domain truth without passing through the trust boundary and receiving practitioner review.

### Trust Levels

| Input Type | Trust Level | Review Required | Can Mutate Domain |
|---|---|---|---|
| Raw transcript | UNTRUSTED | Yes | No (until reviewed) |
| Structured draft | UNTRUSTED | Yes | No (until approved) |
| Advisory packet | UNTRUSTED | Yes | No (until accepted) |
| Spoken command (read-only) | N/A | No | No |
| Spoken command (domain-touching) | UNTRUSTED | Yes | Only after confirmation |
| Spoken command (destructive) | UNTRUSTED | Yes + verification | Only after verification |
| Read-back request | N/A | No | No (read-only) |

### What Happens When Trust Is Cleared
1. Practitioner reviews the voice-derived item
2. Practitioner approves (possibly with edits)
3. Approved item passes through `voiceLanguageBoundaryBridge`
4. Bridge routes to `trustBoundaryBridge` for platform evaluation
5. Trust boundary cleared
6. Item enters domain state as a sovereign record
7. Receipt emitted documenting the full provenance chain
