# Repository Map v1

**Domain:** 10-business-law-accounting
**Date:** 2026-04-05

---

## Top-Level Structure

```
10-business-law-accounting/
├── 0-Frozen-Doctrine/           Immutable governance and constitutional documents
├── 1-Governance-Registry-Runtime/  Runtime governance, registries, and configuration
├── 2-Engines-Tools-Datasets/    Kernels, layers, domain objects, constraints, exports
├── 3-Applications-Control-Towers/  UI components and Commercial Control Tower
├── 4-Workers-Relays-Assistants/  Platform attachment bridges and relay workers
├── 5-State-Receipts-Signals/    State management, receipt storage, signal routing
├── 6-Archive-Lineage/           Historical records, archived matters, lineage tracking
├── docs/                        Architecture documentation and guides
├── receipts/                    Attachment and operational receipts
├── tests/                       Domain sovereignty, workflow, and constitutional tests
├── package.json                 Root package configuration
├── pnpm-workspace.yaml          Workspace configuration
├── tsconfig.base.json           Shared TypeScript configuration
├── turbo.json                   Turborepo build configuration
└── README.md                    Repository overview
```

---

## Directory Details

### 0-Frozen-Doctrine/
**Owner:** Constitutional authority (L0)
**Purpose:** Stores immutable governance documents that define the domain's constitutional boundaries. These documents are frozen and cannot be modified without L0 authority.
**Contains:** Domain intent freeze, sovereignty declarations, foundational principles.

### 1-Governance-Registry-Runtime/
**Owner:** Domain governance
**Purpose:** Runtime governance configuration, type registries, and operational rules that govern how the domain operates day-to-day.
**Contains:** Registry definitions, runtime configuration, governance rules, change control policies.

### 2-Engines-Tools-Datasets/
**Owner:** Multiple (kernel-specific ownership below)
**Purpose:** The core engine layer containing all three sovereign kernels, voice/language layers, domain objects, constraints, workflows, and export generators.

**Subdirectories:**

| Directory | Owner | Purpose |
|---|---|---|
| `Business-Kernel/` | Business Kernel | Entity validation, vendor management, commercial matters, business risk assessment |
| `Law-Kernel/` | Law Kernel | Contracts, obligations, legal risk, compliance, evidence management |
| `Accounting-Kernel/` | Accounting Kernel | Invoices, ledger entries, tax handling, reconciliation, financial impact |
| `Commercial-Orchestrator/` | Orchestrator | Cross-kernel decision assembly, conflict detection, provenance preservation |
| `Voice-Assist-Layer/` | Voice Layer (non-sovereign) | Voice sessions, transcripts, spoken commands, Iron Ear listening, dictation |
| `Language-Intelligence-Layer/` | Language Layer (non-sovereign) | Text normalization, terminology alignment, disambiguation |
| `Domain-Objects/` | Shared | Typed domain object definitions (Matter, Contract, Obligation, Invoice, etc.) |
| `Shared-Commercial-Type-System/` | Shared | Cross-cutting types, enums, and interfaces used across kernels |
| `Constraints/` | Shared | Constraint families: business, law, accounting, cross-domain, voice-language |
| `Workflows/` | Shared | Workflow track definitions: contract review, matter intake, decision thread, etc. |
| `Seeds/` | Shared | Seed data and initialization scripts for development |
| `Export/` | Shared | Export packet generators for matter review, contract review, decisions, receipts |

### 3-Applications-Control-Towers/
**Owner:** UI layer (non-sovereign)
**Purpose:** Commercial Control Tower UI components. Renders domain state and provides interaction surfaces. Never determines domain truth.
**Contains:** Page components (overview, matter detail, contracts, obligations, accounting, voice workspace), navigation, command palette, focus mode, search.

### 4-Workers-Relays-Assistants/
**Owner:** Platform attachment layer
**Purpose:** Bridges between the sovereign domain and 30-validkernel-platform. All platform interaction routes through this layer.
**Contains:**
- `platformClient.ts` — Typed platform client (sole entry point)
- `trustBoundaryBridge.ts` — Trust boundary evaluation bridge
- `receiptBridge.ts` — Receipt emission bridge
- `replayBridge.ts` — Replay foundation bridge (RESERVED)
- `voiceLanguageBoundaryBridge.ts` — Voice/language ingress trust enforcement
- `platformAttachment.contract.ts` — Typed interface contract

### 5-State-Receipts-Signals/
**Owner:** State management layer
**Purpose:** Domain state management, receipt storage, and signal routing for event-driven operations.
**Contains:** State store definitions, receipt storage, signal definitions, event routing.

### 6-Archive-Lineage/
**Owner:** Archive layer
**Purpose:** Historical records, archived matters, and lineage tracking for all domain objects. Provides audit trail and historical reference.
**Contains:** Archived matter records, historical snapshots, lineage chains, retention policies.

### docs/
**Owner:** Documentation
**Purpose:** Architecture documentation, guides, proofs, and operational references.
**Contains:**
- Domain architecture and sovereignty documentation
- Platform attachment proofs
- Voice/language attachment proofs
- UI workspace guide
- Workflow guides
- Practitioner operating guide
- Kernel ownership map
- Repository map (this document)

### receipts/
**Owner:** Operational receipts
**Purpose:** Stores attachment receipts and operational proof artifacts.
**Contains:** Platform attachment receipt, voice/language attachment receipt.

### tests/
**Owner:** Quality assurance
**Purpose:** Domain sovereignty tests, workflow integrity tests, constraint evaluation tests, UI rendering tests, platform attachment tests, constitutional audit.
**Contains:**
- `domain-sovereignty.test.ts` — Kernel independence and platform attachment tests
- `voice-sovereignty.test.ts` — Voice layer non-sovereignty tests
- `language-sovereignty.test.ts` — Language layer non-sovereignty tests
- `constraint-evaluation.test.ts` — All constraint family evaluation tests
- `workflow-integrity.test.ts` — Workflow track output verification
- `ui-rendering.test.ts` — Commercial Control Tower rendering tests
- `platform-attachment.test.ts` — Platform bridge correctness tests
- `constitutional-audit.test.ts` — 15-question constitutional audit
