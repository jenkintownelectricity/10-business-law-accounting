# Shared Commercial Type System

Shared type definitions used across all kernels, the Commercial Orchestrator, and assist layers in the Business Law Accounting domain.

## Modules

- **base.ts** — Foundational types: ID, Timestamp, Status, KernelSource, TrustLevel
- **matter.ts** — Matter type with full field definitions
- **decisionBundle.ts** — CommercialDecisionBundle with cross-kernel assessment typing
- **receipt.ts** — Receipt types for domain operations and platform attachment
- **constraint.ts** — Base constraint types with PASS/WARNING/HALT/UNSUPPORTED/PARTIAL outputs
- **voiceLanguage.ts** — Voice and language layer types (TranscriptEnvelope, SpokenCommandCandidate, etc.)
- **workflow.ts** — Workflow step, track, and state types
- **export.ts** — Export packet types for review and reporting

## Usage

All kernels and the orchestrator import from this shared type system to ensure consistent typing across the domain.
