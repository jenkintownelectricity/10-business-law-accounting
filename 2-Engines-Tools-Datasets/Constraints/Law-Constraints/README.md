# Law Constraints

Constraint family for the Law Kernel within the Business Law Accounting sovereign domain.

## Purpose

Legal constraints enforce procedural and evidentiary integrity for contracts, obligations, evidence, deadlines, party identification, and legal risk assessment. These constraints protect against proceeding with legally incomplete or invalid states.

## Constraints

| ID | Name | Description |
|----|------|-------------|
| LAW-001 | unsigned-contract | Halts if a contract requires signature but is unsigned |
| LAW-002 | unreviewed-obligation | Warns or halts based on obligation criticality |
| LAW-003 | missing-evidence | Halts if evidence is required for a legal assertion |
| LAW-004 | expired-deadline | Halts if a legal deadline has passed |
| LAW-005 | incomplete-party-identification | Warns if parties are not fully identified |
| LAW-006 | unassessed-legal-risk | Warns if legal risk has not been evaluated |

## Result Types

- **PASS** — Constraint satisfied, proceed normally
- **WARNING** — Constraint partially met, proceed with caution
- **HALT** — Constraint violated, cannot proceed

## Integration

Law constraints are evaluated during contract execution, obligation tracking, evidence submission, and deadline management workflows. They integrate with Business and Accounting constraint families through the Cross-Domain constraint family.
