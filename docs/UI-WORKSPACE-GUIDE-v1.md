# UI Workspace Guide v1 — Commercial Control Tower

**Domain:** 10-business-law-accounting
**Date:** 2026-04-05

---

## Overview

The Commercial Control Tower is the unified work environment for practitioners managing business, legal, and accounting operations. It is designed as a professional workstation: serious, high-signal, and capable of hands-free operation.

The UI is non-sovereign. It renders domain state and provides interaction surfaces but never determines domain truth. All truth flows from the three sovereign kernels.

---

## Navigation

The primary navigation provides access to all major surfaces:

| Nav Item | Page | Purpose |
|---|---|---|
| **Overview** | Dashboard | High-signal summary of current state |
| **Matters** | Matter list | Browse, search, and manage all matters |
| **Contracts** | Contract list | Contract lifecycle management |
| **Obligations** | Obligation list | Obligation tracking and deadline management |
| **Accounting** | Financial workspace | Invoices, ledger, reconciliation, tax |
| **Clients** | Client directory | Client records and relationship overview |
| **Vendors** | Vendor directory | Vendor records, validation status |
| **Deadlines** | Deadline calendar | All upcoming deadlines across matters |
| **Decisions** | Decision threads | Active and completed decision bundles |
| **Receipts** | Receipt log | Domain receipt history and export |
| **Review Queue** | Review queue | Items awaiting practitioner review |
| **Voice** | Voice workspace | Dictation, listening, commands, transcripts |
| **Search** | Global search | Full-text and structured search across domain |
| **Settings** | Configuration | User preferences, workspace configuration |

---

## Page Details

### Overview Page
The overview is the first thing the practitioner sees. It contains only high-signal panels:

- **Due Today** — Obligations, deadlines, and tasks due today
- **Active Matters** — Currently active matters with status indicators
- **Unresolved Risks** — Flagged risks across all kernels requiring attention
- **Review Queue** — Count and summary of items awaiting review
- **Recent Activity** — Last significant domain events
- **Upcoming Deadlines** — Next 7 days of deadlines

No weather, social feeds, news, or decorative widgets. Every pixel serves practitioner productivity.

### Matter Detail Page
The primary deep-work surface. When a practitioner opens a matter, they see:

- **Matter Core** — Title, status, client, assigned practitioner, description
- **Evidence** — All evidence linked to the matter
- **Constraints** — Active constraints and their resolution status
- **Decisions** — Decision threads related to this matter
- **Tasks** — Pending actions and follow-ups
- **Contracts** — Linked contracts
- **Obligations** — Linked obligations with deadline status
- **Timeline** — Chronological history of matter events
- **Notes** — Practitioner notes (including voice-dictated drafts pending review)

### Contracts Page
Contract lifecycle management:
- List of all contracts with status, parties, and key dates
- Filter by status (draft, in review, active, expired, terminated)
- Link to contract review packet export
- Obligation extraction view

### Obligations Page
Obligation tracking and deadline management:
- List of all obligations with deadline and status
- Filter by status (active, fulfilled, breached, waived)
- Sort by deadline urgency
- Link to originating contract

### Accounting Page
Financial workspace:
- Invoice list with payment status
- Ledger view with classification status
- Reconciliation status dashboard
- Tax assessment overview
- Financial impact summaries

### Review Queue
Items awaiting practitioner review:
- Voice-derived candidates pending approval
- Listening session advisory packets
- Language normalization suggestions
- Constraint violations requiring resolution
- Items sorted by urgency and age

### Voice Workspace
Full voice interaction surface (see detailed section below).

---

## Voice Workspace

The voice workspace enables hands-free operation with the following sections:

### Dictation Entry
- Microphone indicator (active/muted/off)
- Real-time transcript display
- Confidence score indicator
- Target matter selector (where the dictation will be routed)

### Listening Controls
- Start/stop listening session
- Session type selector (meeting, call, deposition, negotiation)
- Participant management
- Matter linking

### Transcript Review
- Full transcript with speaker attribution
- Segment-by-segment confidence display
- Edit capability for corrections
- Normalization notes from language layer

### Command History
- Recent spoken commands with execution status
- Confirmation prompts for domain-touching commands
- Rejection log for blocked commands

### Advisory Review
- Advisory packets from listening sessions
- Accept/reject/defer controls
- Routing hints showing suggested kernel targets
- Confidence scores for each advisory

### Language Review
- Terminology alignment suggestions
- Disambiguation options
- Normalization change log

### Session Controls
- Active session indicator
- Session duration
- Pause/resume
- Export session

### Read-Back Panel
- Request read-back of any domain object
- Matter summary read-back
- Obligation deadline read-back
- Contract terms read-back

### Mic Indicator
- Visual and audio feedback for microphone state
- Mute/unmute toggle
- Input level meter

### Routing Review
- Shows where voice-derived items will be routed
- Allows practitioner to adjust routing before confirmation

---

## Focus Mode

Focus mode is designed for deep work sessions. When activated:

- All navigation chrome is hidden
- Only the current work surface is visible
- Available on matter detail, contract review, and decision thread pages
- Shows only essential panels: core content, evidence, constraints, decisions, tasks
- Exit via keyboard shortcut or voice command

Focus mode configuration:
- `hides_chrome: true` — Navigation, header, and sidebar hidden
- `shows_only` — Matter core, evidence, constraints, decisions, tasks
- Keyboard shortcut to toggle
- Voice command: "Enter focus mode" / "Exit focus mode"

---

## Command Palette

The command palette provides keyboard-driven access to all domain operations:

- Open with keyboard shortcut (Ctrl+K / Cmd+K)
- Type to search commands, matters, contracts, entities
- Quick navigation to any page
- Quick actions: create matter, search, export, toggle focus mode
- Recent commands history

---

## Search

Global search across the entire domain:

- Full-text search across all domain objects
- Structured search with filters (type, status, date range, kernel)
- Results grouped by object type
- Quick preview of search results
- Direct navigation to any result
- Voice-activated: "Search for Henderson contracts"
