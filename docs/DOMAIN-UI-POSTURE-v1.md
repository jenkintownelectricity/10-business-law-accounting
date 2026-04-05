# Domain UI Posture — v1

**FROZEN — v1**
**Domain**: Business Law Accounting Domain OS
**Product**: Commercial Control Tower
**Frozen Date**: 2026-04-05
**Authority**: L0_ARMAND_LEFEBVRE

> This document is FROZEN at v1. Changes require formal change control per `docs/DOMAIN-CHANGE-CONTROL-v1.md`.

---

## Product Identity

**Commercial Control Tower**

The Commercial Control Tower is a professional workstation for business, law, and accounting practitioners. It is the single unified interface through which practitioners interact with all three sovereign kernels, the orchestrator, voice/language augmentation, and platform-attached infrastructure.

The UI is a projection surface — it renders domain truth but does not own domain truth.

---

## Workstation Mode

The Commercial Control Tower operates in workstation mode:

- **High clarity**: Every element on screen serves a purpose. Labels are precise. Status indicators are unambiguous. Data density is high but never overwhelming.
- **Low visual noise**: No gratuitous animations, no distracting background patterns, no unnecessary color variation. The interface recedes so the work advances.
- **Dense but not cramped**: Information density is high — practitioners need to see many data points simultaneously. But spacing is deliberate, and visual grouping is clear. No element crowds another.

---

## Visual Design Principles

### Polished Enterprise Feel

The Commercial Control Tower looks and feels like professional-grade enterprise software. Subtle borders separate sections. Crisp spacing creates visual hierarchy. Surfaces are clean and neutral.

### No Rainbow Palette

Color is used sparingly and purposefully:
- Status indicators use a controlled palette (success, warning, error, neutral)
- Kernel provenance may use subtle, muted color coding for quick identification
- No gradient backgrounds, no bright accent bars, no decorative color bands

### No Giant Hero Panels

Every pixel earns its place. There are no large empty hero sections, no oversized welcome banners, no splash screens. The practitioner lands in their workspace immediately.

### No Toy Hacker Aesthetic

The interface is not a terminal emulator, a code editor, or a dashboard playground. It is a professional tool for practitioners who bill by the hour. The aesthetic communicates competence, precision, and reliability.

### Typography Does the Work

- Headings establish hierarchy without requiring color or icons
- Body text is legible at professional reading distances
- Monospace is reserved for codes, reference numbers, and identifiers
- Font weights (not colors) distinguish labels from values
- Consistent type scale throughout the application

---

## Primary Navigation

The Commercial Control Tower provides the following primary navigation items:

| Navigation Item | Purpose |
|----------------|---------|
| **Overview** | Dashboard view: active matters, upcoming deadlines, pending reviews, recent activity |
| **Matters** | All commercial matters across kernels, filterable by kernel, status, client, date |
| **Contracts** | Contract registry, lifecycle tracking, signing status (Law Kernel) |
| **Obligations** | Obligation tracking, compliance status, enforcement deadlines (Law Kernel) |
| **Accounting** | Financial workspace: transactions, invoices, ledger, reconciliation (Accounting Kernel) |
| **Clients** | Client registry, engagement history, cross-kernel client view (Business Kernel) |
| **Vendors** | Vendor registry, validation status, relationship management (Business Kernel) |
| **Deadlines** | Unified deadline view across all kernels, urgency ranking, calendar integration |
| **Decision Threads** | Cross-kernel decision bundles, provenance tracking, conflict resolution queue |
| **Receipts** | Domain receipt log, trust transitions, audit trail |
| **Review Queue** | Items awaiting practitioner review: voice intake candidates, constraint warnings, draft items |
| **Voice Workspace** | Voice and language augmentation controls, transcripts, spoken command history |
| **Workspace Search** | Full-domain search across all kernels, matters, contracts, transactions, and documents |
| **Settings** | User preferences, kernel configuration, platform attachment settings, voice/language preferences |

---

## Voice Workspace

The Voice Workspace is the dedicated space for voice and language augmentation features.

### Voice Workspace Components

- **Dictation Panel**: Active dictation interface with real-time transcript preview. Supports matter-context-aware dictation (dictating within a specific matter automatically routes to that matter's context).

- **Listening Indicator**: Clear, compact indicator showing when Iron Ear is actively listening. Professional appearance — no pulsing microphone animations or waveform theatrics.

- **Transcript Review**: List of recent transcripts with confidence indicators, kernel routing suggestions, and review/approve/reject controls. Each transcript shows its trust status (UNTRUSTED until reviewed).

- **Spoken Command History**: Log of spoken commands with their interpreted actions, execution status, and any review requirements. Commands that affected domain truth show the review chain.

- **Advisory Review**: AI-generated advisory packets from voice/language interpretation. Each advisory shows its source, confidence, suggested kernel routing, and required review actions.

- **Hands-Free Controls**: Compact control bar for starting/stopping dictation, switching contexts, navigating between matters, and triggering common actions — all via voice. Controls are visible but not dominant.

### Voice Controls Design

- Compact and professional
- Not gimmicky — no oversized microphone buttons, no voice waveform visualizers, no "AI assistant" chat bubbles
- Status is conveyed through text labels and subtle indicators
- Voice controls integrate with the workstation aesthetic, not against it

---

## Focus Mode

Matter detail pages support Focus Mode:

- Focus Mode strips away global navigation and secondary panels
- The practitioner sees only the current matter and its cross-kernel details
- Split-pane layout remains available in Focus Mode
- Exit Focus Mode returns to the previous navigation state
- Keyboard shortcut for toggling Focus Mode

---

## Split-Pane Matter Layout

Matter detail pages use a split-pane layout:

- **Left pane**: Matter summary, kernel assessments, status indicators, timeline
- **Right pane**: Detail view — contracts, obligations, transactions, documents, notes, decision threads

The split can be resized. Either pane can be collapsed. The layout preserves kernel provenance — each assessment clearly shows which kernel produced it.

---

## Command Palette

The Commercial Control Tower includes a command palette:

- Activated by keyboard shortcut (Cmd/Ctrl + K)
- Supports navigation, search, and common actions
- Context-aware: available commands change based on current view
- Type-ahead search across matters, clients, vendors, contracts, and transactions
- Supports voice-triggered activation when Voice Workspace is active

---

## Print and Export-Ready Packets

The Commercial Control Tower supports professional document output:

### Printable Packets
- Matter summary packets with cross-kernel assessments
- Contract review packets with obligation schedules
- Financial summary packets with ledger excerpts
- Decision thread packets with full provenance chains
- Receipt audit packets

### Export Formats
- PDF for formal documents and filings
- CSV for financial data and transaction logs
- Structured JSON for system-to-system transfer

### Print/Export Rules
- All exported documents carry kernel provenance markers
- All exported documents include generation timestamps
- All exported documents include domain receipt references where applicable
- Print layouts use professional typography consistent with the workstation aesthetic
