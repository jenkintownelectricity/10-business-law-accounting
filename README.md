# 10-Business-Law-Accounting

**Business Law Accounting Domain OS — Commercial Control Tower**

A sovereign domain operating system for business, law, and accounting practitioners.
Attached to `30-validkernel-platform` for trust-boundary enforcement, receipts, and replay foundations.

## Domain Identity

- **Repository**: `10-business-law-accounting`
- **Domain Operating Identity**: Business Law Accounting Domain OS
- **Working Product Identity**: Commercial Control Tower
- **Augmented Identity**: Commercial Control Tower with Voice Assist, Iron Ear Intake, and Language Intelligence

## Architecture

One UI. Three sovereign internal kernels. One governed orchestrator. One attached platform runtime. One assistive voice/language layer. No truth collapse.

### Three Sovereign Kernels
1. **Business Kernel** — business operations, commercial matters, entity management
2. **Law Kernel** — contracts, obligations, legal risk, compliance
3. **Accounting Kernel** — financial treatment, invoices, ledger classification, tax posture

### Augmentation Layers (Non-Sovereign)
- **Voice Assist Layer** — hands-free dictation, spoken commands, meeting capture
- **Language Intelligence Layer** — terminology normalization, phrase disambiguation, multilingual support

## Monorepo Taxonomy

```
10-business-law-accounting/
├── 0-Frozen-Doctrine/          # Immutable domain truth definitions
├── 1-Governance-Registry-Runtime/  # Policies, catalogs, runtime
├── 2-Engines-Tools-Datasets/   # Domain kernels, orchestrator, tools
├── 3-Applications-Control-Towers/  # UI surfaces
├── 4-Workers-Relays-Assistants/    # Background processors
├── 5-State-Receipts-Signals/   # State management, receipts, events
├── 6-Archive-Lineage/          # Historical records, lineage tracking
├── docs/                       # Documentation
└── receipts/                   # Platform attachment receipts
```

## Trust Stack

| Layer | Trust Level |
|-------|-------------|
| UTK | TRUSTED |
| Domain Kernels | TRUSTED |
| Constraint Ports | TRUSTED |
| Execution Spine | TRUSTED |
| Service Adapters | PARTIALLY TRUSTED |
| Client Data | PARTIALLY TRUSTED |
| AI Semantic Mapping | UNTRUSTED until typed |
| Browser UI State | UNTRUSTED |
| Voice/Audio Intake | UNTRUSTED until typed |
| Speech-to-Text Output | UNTRUSTED until typed |
| External APIs | UNTRUSTED |

## Platform Attachment

This domain attaches to `30-validkernel-platform` for:
- Trust-boundary evaluation
- Typed promotion patterns
- Receipt emission and replay foundations
- API runtime patterns
- Shared adapter contracts

The domain remains sovereign over all business, law, and accounting truth.

## Getting Started

```bash
pnpm install
pnpm build
pnpm test
```
