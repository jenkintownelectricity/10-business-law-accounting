# Cross-Domain Constraints

Constraint family spanning multiple kernels within the Business Law Accounting sovereign domain.

## Purpose

Cross-domain constraints enforce integrity at the boundaries where Business, Law, and Accounting kernels interact. They ensure that decisions, matters, and outputs requiring input from multiple kernels are properly coordinated, routed, and attributed.

These constraints also govern the boundary between language-derived outputs and sovereign domain actions — ensuring that no language model output can directly mutate domain truth.

## Constraints

| ID | Name | Description |
|----|------|-------------|
| CROSS-001 | decision-without-all-kernel-inputs | Warns if decision bundle missing kernel assessments |
| CROSS-002 | unresolved-cross-kernel-conflict | Halts if kernels disagree without resolution |
| CROSS-003 | matter-missing-kernel-assignment | Halts if matter not routed to any kernel |
| CROSS-004 | spoken-intake-with-no-review-queue-routing | Halts if spoken intake not placed in review queue |
| CROSS-005 | advisory-packet-with-no-source-attribution | Halts if advisory packet has no source |
| CROSS-006 | listening-session-with-no-evidence-envelope | Warns if listening session not enveloped |
| CROSS-007 | language-derived-output-attempting-sovereign-action | Always halts — language outputs cannot take sovereign action |
| CROSS-008 | dictated-matter-with-unresolved-kernel-routing | Warns if dictated matter not yet routed |

## Result Types

- **PASS** — Constraint satisfied, proceed normally
- **WARNING** — Constraint partially met, proceed with caution
- **HALT** — Constraint violated, cannot proceed

## Integration

Cross-domain constraints are evaluated during multi-kernel decision assembly, matter routing, voice/language intake processing, and advisory packet generation. They serve as the coordination layer ensuring no kernel operates in isolation when cross-kernel input is required.
