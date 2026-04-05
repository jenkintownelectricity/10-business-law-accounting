# Accounting Constraints

Constraint family for the Accounting Kernel within the Business Law Accounting sovereign domain.

## Purpose

Accounting constraints enforce financial integrity for transactions, invoices, ledger entries, tax posture, financial periods, and currency handling. These constraints ensure that no financial state change proceeds without proper classification, reconciliation, and compliance.

## Constraints

| ID | Name | Description |
|----|------|-------------|
| ACCT-001 | unclassified-transaction | Halts if transaction has no ledger classification |
| ACCT-002 | missing-invoice | Warns or halts based on transaction amount threshold |
| ACCT-003 | unreconciled-entry | Warns if ledger entry has not been reconciled |
| ACCT-004 | incomplete-tax-posture | Halts if tax implications have not been assessed |
| ACCT-005 | missing-financial-period | Warns if no financial period has been assigned |
| ACCT-006 | unsupported-currency | Returns UNSUPPORTED if currency is not handled by the system |

## Result Types

- **PASS** — Constraint satisfied, proceed normally
- **WARNING** — Constraint partially met, proceed with caution
- **HALT** — Constraint violated, cannot proceed
- **UNSUPPORTED** — Operation not supported (e.g., unrecognized currency)

## Integration

Accounting constraints are evaluated during transaction recording, invoice processing, ledger reconciliation, and tax assessment workflows. They integrate with Business and Law constraint families through the Cross-Domain constraint family.
