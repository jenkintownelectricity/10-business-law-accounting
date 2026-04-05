# Practitioner Operating Guide v1

**Domain:** 10-business-law-accounting
**Date:** 2026-04-05

---

## Getting Started

The Commercial Control Tower is your unified workspace for managing all business, legal, and accounting operations. When you open the system, you land on the Overview page showing today's priorities.

### First Steps
1. Review the **Overview** page for today's due items, active matters, and unresolved risks
2. Check the **Review Queue** for items awaiting your attention
3. Open your first **Matter** to begin deep work
4. Familiarize yourself with **keyboard shortcuts** (Ctrl+K / Cmd+K for command palette)

---

## Organizing Matters

Matters are the central organizing unit. Every contract, obligation, decision, and piece of evidence connects to a matter.

### Creating a Matter
- Navigate to Matters page and select "New Matter"
- Or use command palette: Ctrl+K, type "new matter"
- Or say: "Create a new matter for [client/topic]" (requires confirmation)
- Provide: title, client, initial description
- Matter starts in INTAKE status

### Matter Lifecycle
```
INTAKE -> ACTIVE -> IN_REVIEW -> RESOLVED -> CLOSED
                                    |
                                    v
                                 ARCHIVED (via 6-Archive-Lineage)
```

### Organizing Within a Matter
- **Link contracts** — Associate relevant contracts
- **Track obligations** — Obligations from linked contracts appear automatically
- **Collect evidence** — Attach documents, correspondence, records
- **Create tasks** — Track follow-up actions
- **Add notes** — Write or dictate observations and analysis
- **Start decision threads** — For significant decisions requiring multi-kernel assessment

---

## Reviewing Contracts

### Starting a Contract Review
1. Navigate to the Contracts page
2. Open the contract or create a new contract record
3. The system automatically requests assessments from all three kernels:
   - **Law Kernel** — Obligations, risks, compliance, non-standard clauses
   - **Accounting Kernel** — Financial impact, payment terms, tax implications
   - **Business Kernel** — Strategic alignment, vendor status, relationship value
4. Review the assembled ContractReviewPacket
5. Accept, modify, or reject the combined recommendation

### What to Look For
- Non-standard clauses flagged by the Law Kernel
- Financial exposure calculated by the Accounting Kernel
- Strategic alignment assessment from the Business Kernel
- Any unresolved conflicts between kernel recommendations
- Constraint violations blocking progress

### Exporting a Contract Review
- From the contract detail page, select "Export Review Packet"
- Produces a print-ready ContractReviewPacket with all assessments and recommendations

---

## Tracking Obligations and Deadlines

### Viewing Obligations
- **Obligations page** — All obligations across all contracts
- **Matter detail** — Obligations specific to a matter
- **Deadlines page** — Calendar view of all upcoming deadlines

### Deadline Management
- Obligations with approaching deadlines appear on the Overview page
- Overdue obligations trigger the `EXPIRED_DEADLINE` constraint and escalate
- Sort obligations by urgency to prioritize work
- Use the deadline calendar for planning ahead

### Marking Fulfillment
1. Open the obligation
2. Attach evidence of fulfillment
3. Mark as fulfilled (the Law Kernel evaluates the evidence)
4. If evidence is insufficient, the `MISSING_EVIDENCE` constraint blocks the transition

---

## Making Decisions with the Decision Thread

### When to Use a Decision Thread
Use a decision thread for any significant commercial decision that benefits from structured multi-perspective analysis:
- Should we proceed with a contract?
- Should we engage a new vendor?
- How should we handle a breach?
- Should we renegotiate terms?

### Starting a Decision Thread
1. From a matter, select "New Decision Thread"
2. Frame the question clearly
3. Provide context (what prompted this decision?)
4. The system requests assessments from all relevant kernels

### Reviewing the Decision Bundle
The Commercial Orchestrator assembles all kernel assessments into a bundle:
- **Business assessment** — Strategic and risk perspective
- **Legal assessment** — Legal risk and compliance perspective
- **Financial assessment** — Financial impact perspective
- **Combined recommendation** — Orchestrator's synthesis (you may override)
- **Conflicts** — Any contradictions between kernels (you must resolve)
- **Action items** — Recommended next steps from each kernel

### Making Your Decision
1. Review all kernel assessments and their rationale
2. Resolve any flagged conflicts
3. Accept, modify, or override the combined recommendation
4. Record your decision rationale
5. Assign resulting action items
6. The decision and full provenance chain are recorded as a receipt

---

## Using Voice Features

### Quick Start
- **Dictate a note** — Click the mic button, speak, review the draft, approve
- **Listen to a meeting** — Start a listening session, review extracted candidates afterward
- **Navigate by voice** — "Go to matters" or "Show me the Henderson contract"
- **Search by voice** — "Search for overdue obligations"
- **Read-back** — "Read back today's deadlines"

### Important: Voice Produces Drafts, Not Records
Everything you speak is captured as a draft or candidate. Nothing becomes an official record until you review and approve it. This protects the integrity of your domain data.

---

## Working Hands-Free

The system supports full hands-free operation for situations where your hands are occupied:

### Hands-Free Workflow
1. Say "Start dictation" to begin capturing notes
2. Say "Stop dictation" to end capture
3. Say "Read back" to hear what was captured
4. Say "Approve" to confirm (after reviewing on screen, if possible)
5. Say "Start listening" for a meeting session
6. Say "End listening" when done
7. Say "Go to review queue" to review extracted items
8. Use voice commands for navigation throughout

### Voice Commands Reference
- **Navigation:** "Go to [page name]", "Open [matter/contract name]"
- **Dictation:** "Start dictation", "Stop dictation", "New paragraph"
- **Listening:** "Start listening", "End listening", "Pause"
- **Read-back:** "Read back [object]", "What are today's deadlines?"
- **Search:** "Search for [query]"
- **Focus:** "Enter focus mode", "Exit focus mode"
- **Control:** "Stop", "Cancel", "Go back"

---

## Using Search and Command Palette

### Command Palette (Ctrl+K / Cmd+K)
The fastest way to do anything:
- Type a matter name to jump to it
- Type "new matter" to create one
- Type "search" followed by your query
- Type any page name to navigate
- Recent commands appear at the top

### Global Search
- Available from the Search page or via command palette
- Searches across all domain objects: matters, contracts, obligations, entities, vendors, invoices
- Filter results by type, status, date range, or kernel
- Preview results inline before navigating

---

## Exporting Review Packets

### Available Exports
- **Matter Review Packet** — Complete matter with all kernel assessments
- **Contract Review Packet** — Full contract analysis with recommendations
- **Commercial Decision Packet** — Decision bundle with provenance chain
- **Receipt Compilation** — All receipts for an entity or matter
- **Listening Session Packet** — Transcript with advisory packets
- **Transcript Review Packet** — Full transcript with annotations

### How to Export
1. Navigate to the entity you want to export
2. Select "Export" from the action menu
3. Choose the packet type
4. Review the generated packet
5. Download or print

All exports are point-in-time snapshots. They reflect domain state at the moment of generation.

---

## Focus Mode for Deep Work

### Activating Focus Mode
- Keyboard shortcut (configured in settings)
- Command palette: "focus mode"
- Voice: "Enter focus mode"

### What Focus Mode Does
- Hides all navigation chrome (sidebar, header, breadcrumbs)
- Shows only the essential work panels for the current page
- On matter detail: matter core, evidence, constraints, decisions, tasks
- Reduces visual noise for concentrated analysis

### Exiting Focus Mode
- Same keyboard shortcut
- Command palette: "exit focus mode"
- Voice: "Exit focus mode"
- Escape key

### When to Use Focus Mode
- Deep contract analysis
- Complex matter review
- Decision thread evaluation
- Any time you need to concentrate without distraction
