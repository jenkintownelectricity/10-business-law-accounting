# 6-Archive-Lineage

**Domain:** 10-business-law-accounting

---

## Purpose

This directory stores historical records, archived matters, and lineage tracking for all domain objects in the 10-business-law-accounting domain.

---

## What This Directory Contains

### Archived Matters
When a matter reaches CLOSED status and the retention period elapses, it moves to archive. Archived matters retain their full structure:
- Matter record with final status
- All linked contracts, obligations, and evidence
- Kernel assessments at time of closure
- Decision thread outcomes
- Complete receipt trail

### Historical Records
Point-in-time snapshots of domain objects for audit and reference:
- Contract versions (pre- and post-amendment)
- Obligation fulfillment records
- Financial period closings
- Vendor qualification history

### Lineage Tracking
Every domain object maintains a lineage chain documenting:
- Creation event (who, when, why, from what source)
- Every state transition with provenance
- Kernel assessments that influenced the object
- Decisions that affected the object
- Final disposition (archived, superseded, voided)

---

## Lineage Chain Structure

Each lineage entry contains:
- **Object ID** — The domain object being tracked
- **Event type** — created, updated, transitioned, assessed, decided, archived
- **Timestamp** — When the event occurred
- **Actor** — Who performed the action (practitioner ID or system)
- **Source kernel** — Which kernel was involved (if applicable)
- **Detail** — Description of what changed
- **Receipt ID** — Link to the corresponding receipt

---

## Retention Policy

- **Active matters:** Retained in primary state indefinitely while active
- **Closed matters:** Retained in primary state for the configured retention period, then archived here
- **Archived matters:** Retained indefinitely for audit and historical reference
- **Lineage records:** Never deleted; they form the permanent audit trail
- **Receipts:** Mirrored here from `5-State-Receipts-Signals/` for archival completeness

---

## Access Patterns

- **Audit queries:** "Show me the full history of matter M-001"
- **Historical reference:** "What was the contract status on March 15?"
- **Lineage traversal:** "What decisions affected this obligation?"
- **Compliance evidence:** "Produce the complete record for regulatory inquiry"

---

## Relationship to Other Directories

| Directory | Relationship |
|---|---|
| `5-State-Receipts-Signals/` | Active receipts flow here for long-term storage |
| `2-Engines-Tools-Datasets/Domain-Objects/` | Archived objects follow the same type definitions |
| `2-Engines-Tools-Datasets/Export/` | Receipt compilation packets can draw from archive |
| `docs/` | Retention policies documented in governance docs |
