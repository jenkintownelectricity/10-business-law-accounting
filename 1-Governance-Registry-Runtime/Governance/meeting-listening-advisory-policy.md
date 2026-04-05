# Meeting Listening Advisory Policy

**Domain:** Business Law Accounting (10-business-law-accounting)
**Version:** 1.0.0
**Effective:** 2026-04-05

---

## Core Principle

**Meeting and listening sessions (Iron Ear) produce advisory packets only.** All extracted candidates — obligations, deadlines, routing hints — require explicit practitioner review and acceptance before becoming domain truth.

## Iron Ear Operation

The Iron Ear listening mode operates during meetings, calls, and discussions to passively capture and analyze spoken content. It produces:

1. **Obligation Candidates** — Potential obligations mentioned during the session.
2. **Deadline Candidates** — Potential deadlines or time-sensitive items referenced.
3. **Routing Hints** — Suggested kernel assignments based on discussion content.
4. **Action Item Candidates** — Potential follow-up actions mentioned by participants.
5. **Entity References** — Mentions of clients, vendors, contracts, or matters.

## Advisory Packet Structure

Each listening session produces an AdvisoryIntakePacket containing:

- Session metadata (ID, timestamp, duration, participants where known)
- Obligation candidates with confidence scores
- Deadline candidates with confidence scores
- Routing hints mapping content segments to kernel domains
- Action item candidates with suggested assignees
- Raw transcript reference (TranscriptEnvelope ID)

## Review Requirements

### Mandatory Practitioner Review

Every AdvisoryIntakePacket must undergo practitioner review before any contained candidate may influence domain truth. The review process:

1. The packet is placed in the practitioner's review queue.
2. The practitioner reviews each candidate individually.
3. For each candidate, the practitioner may:
   - **Accept** — The candidate is promoted to a typed domain object in the appropriate kernel.
   - **Modify** — The candidate is edited before acceptance.
   - **Reject** — The candidate is discarded (archived with the session record).
   - **Defer** — The candidate is held for later review.
4. Acceptance produces a receipt linking the advisory candidate to the created domain record.

### No Automatic Promotion

- Advisory packets must **never** automatically create obligations, deadlines, or action items.
- Advisory packets must **never** trigger automated notifications or escalations.
- Advisory packets must **never** modify existing domain records without practitioner action.

## Confidence Thresholds

While all candidates require review regardless of confidence, the system applies visual priority based on confidence:

| Confidence | Priority | Handling |
|---|---|---|
| 0.8 - 1.0 | High | Presented first in review queue |
| 0.5 - 0.79 | Medium | Standard review queue position |
| Below 0.5 | Low | Flagged as uncertain, presented with additional context |

## Session Types

| Session Type | Description | Output |
|---|---|---|
| `client-meeting` | Meeting with client present | Full advisory packet |
| `internal-review` | Internal team discussion | Advisory packet with internal-only marking |
| `opposing-counsel` | Meeting with opposing counsel | Advisory packet with privilege review flag |
| `vendor-call` | Call with vendor/service provider | Advisory packet routed to Business Kernel queue |
| `court-proceeding` | Court or hearing attendance | Advisory packet with legal proceeding markers |

---

**This policy ensures that the convenience of passive listening never bypasses the practitioner's judgment in creating domain truth.**
