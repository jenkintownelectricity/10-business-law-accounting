# Commercial Orchestrator

**Domain:** Business Law Accounting
**Role:** Cross-Kernel Coordination
**Trust Level:** ORCHESTRATOR (coordinates, never overrides kernel truth)

## Purpose

The Commercial Orchestrator coordinates across all three sovereign kernels (Business, Law, Accounting) and both assist layers (Voice, Language). It:

- Routes matters to the appropriate kernel(s) based on content analysis
- Assembles CommercialDecisionBundles from individual kernel assessments
- Preserves source_kernel provenance on all assembled outputs
- Coordinates cross-domain decisions
- Routes advisory intake from voice/language layers to review queues
- **Never** overrides individual kernel truth
- **Never** fabricates assessments for non-responding kernels

## Components

- **commercialOrchestrator.ts** — Main orchestrator coordinating kernel interactions
- **decisionBundleAssembler.ts** — Assembles decision bundles from kernel assessments
- **crossDomainRouter.ts** — Routes work items to appropriate kernel(s)

## Constraints

- The orchestrator must preserve all source_kernel_receipts in decision bundles
- If a kernel returns UNSUPPORTED, the orchestrator surfaces this to the practitioner
- Advisory intake is routed to review queues, never directly to domain truth
