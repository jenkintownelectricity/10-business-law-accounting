# Domain Intent Freeze — v1

**FROZEN — v1**
**Domain**: Business Law Accounting Domain OS
**Product**: Commercial Control Tower
**Frozen Date**: 2026-04-05
**Authority**: L0_ARMAND_LEFEBVRE

> This document is FROZEN at v1. Changes require formal change control per `docs/DOMAIN-CHANGE-CONTROL-v1.md`.

---

## Mission

Create a governed commercial operating system that evaluates and organizes business matters across three distinct professional disciplines:

1. **Business Operations** — entity management, vendor relationships, client engagement, commercial matters, operational workflows
2. **Contracts and Legal Obligations** — contract lifecycle, obligation tracking, legal risk assessment, compliance posture, deadline enforcement
3. **Accounting and Financial Treatment** — financial classification, invoice processing, ledger management, tax posture evaluation, reconciliation

The system serves practitioners who must coordinate across all three disciplines without losing the distinct truth each discipline produces.

---

## Target User

The primary user is a professional who operates at the intersection of business, law, and accounting:

- **Accountant** — requires precise financial classification, ledger integrity, tax posture clarity, and reconciliation confidence
- **Lawyer** — requires contract precision, obligation tracking, legal risk visibility, compliance assurance, and deadline enforcement
- **Business Specialist** — requires entity management, vendor coordination, client relationship oversight, and commercial matter organization

The system assumes the user may hold one, two, or all three roles. The Commercial Control Tower presents a unified workspace that respects the distinct truth boundaries of each discipline.

---

## Three-Kernel Model

The domain operates three sovereign internal kernels. Each kernel owns its own truth, defines its own types, enforces its own constraints, and validates its own outputs.

### Business Kernel
- Owns: entities, vendors, clients, matters, commercial relationships, operational workflows
- Truth boundary: business operations and commercial organization
- Constraints: entity completeness, vendor validation, matter lifecycle integrity

### Law Kernel
- Owns: contracts, obligations, legal risk assessments, compliance determinations, deadlines, evidence
- Truth boundary: legal interpretation and contractual obligation
- Constraints: contract signing status, obligation review, evidence completeness, deadline enforcement

### Accounting Kernel
- Owns: transactions, invoices, ledger entries, financial classifications, tax posture, reconciliation records
- Truth boundary: financial treatment and accounting classification
- Constraints: transaction classification, invoice completeness, reconciliation status, tax posture validity

No kernel may override another kernel's truth. Each kernel's output is sovereign within its domain.

---

## Commercial Orchestrator

The Commercial Orchestrator coordinates across the three kernels without overriding any individual kernel's truth.

**Responsibilities:**
- Route incoming matters, documents, and actions to the appropriate kernel(s)
- Assemble decision bundles that include assessments from each applicable kernel
- Preserve source-kernel provenance in all combined outputs
- Detect cross-kernel conflicts and surface them for practitioner resolution
- Manage matter lifecycle transitions that span multiple kernels
- Coordinate platform attachment operations

**Constraints:**
- The orchestrator never determines truth — it coordinates truth from sovereign sources
- All orchestrator outputs carry provenance tags indicating which kernel(s) contributed
- Cross-kernel conflicts are surfaced, never silently resolved

---

## Platform Attachment

This domain attaches to `30-validkernel-platform` for infrastructure capabilities:

- **Trust-boundary evaluation** — the platform provides trust-boundary assessment patterns
- **Typed promotion** — the platform defines promotion paths from untrusted to trusted data
- **Receipts** — the platform provides receipt emission infrastructure
- **Replay** — the platform provides replay foundation patterns
- **API runtime** — the platform provides shared API runtime patterns
- **Shared adapters** — the platform provides adapter contracts for external integrations

The domain retains full sovereignty over all business, law, and accounting truth. Platform attachment is for infrastructure, not truth ownership.

---

## Voice and Language Augmentation

The system includes two assistive augmentation layers:

### Voice Assist Layer
- Hands-free dictation for matter notes, contract annotations, and financial memos
- Spoken commands for navigation and common actions
- Meeting capture and transcript organization
- Iron Ear listening posture: system listens, organizes, drafts, routes — never approves or determines

### Language Intelligence Layer
- Terminology normalization across business, legal, and accounting vocabularies
- Phrase disambiguation for cross-discipline communication
- Multilingual support for international commercial operations

**Both layers are assistive and non-sovereign.** All voice and language input is UNTRUSTED until promoted through trust-boundary handling. No voice or language layer may directly mutate domain truth.

---

## Product Identity

**Commercial Control Tower**

A professional workstation for commercial practitioners. Dense, clear, enterprise-grade. Typography-driven. No visual noise. One workspace that presents three sovereign disciplines without collapsing their distinct truths.

---

## Non-Negotiable Outcomes

1. **One clean workspace** — a single, unified professional interface
2. **Three distinct kernels** — business, law, and accounting each maintain sovereign truth
3. **Governed orchestration** — cross-kernel coordination with full provenance
4. **No truth collapse** — no kernel's truth is overridden, merged, or silently resolved by another kernel, the orchestrator, the UI, or any augmentation layer
5. **Platform attachment without sovereignty loss** — infrastructure from the platform, truth from the domain
6. **Assistive augmentation without authority** — voice and language layers assist but never determine

---

## Change Control

This document is FROZEN at v1. Modifications require formal change control as defined in `docs/DOMAIN-CHANGE-CONTROL-v1.md`. Any proposed change must:

1. Be submitted as a formal change request
2. Include impact analysis across all three kernels
3. Receive explicit approval from domain authority
4. Produce a receipt documenting the change
