# Business Constraints

Constraint family for the Business Kernel within the Business Law Accounting sovereign domain.

## Purpose

Business constraints enforce structural and operational integrity for business entities, matters, vendors, and risk assessments. These constraints gate workflow progression — a `HALT` result prevents further processing until the constraint is satisfied.

## Constraints

| ID | Name | Description |
|----|------|-------------|
| BUS-001 | missing-entity | Halts if a matter has no associated business entity |
| BUS-002 | incomplete-matter | Warns or halts based on number of missing matter fields |
| BUS-003 | unvalidated-vendor | Halts if vendor is not verified; warns if tax ID missing |
| BUS-004 | business-risk-threshold | Warns or halts based on computed business risk score |

## Result Types

- **PASS** — Constraint satisfied, proceed normally
- **WARNING** — Constraint partially met, proceed with caution
- **HALT** — Constraint violated, cannot proceed
- **UNSUPPORTED** — Operation not supported in current context
- **PARTIAL** — Constraint partially evaluated

## Integration

Business constraints are evaluated during matter creation, vendor onboarding, and risk assessment workflows. They integrate with the Cross-Domain constraint family when decisions span multiple kernels.
