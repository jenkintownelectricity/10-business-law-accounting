# Accounting Kernel — Frozen Surface v1

FROZEN — v1

## Owned Types
- AccountingEvent
- Invoice
- LedgerEntry
- TaxPosture
- FinancialImpact
- AccountingAssessment
- ReconciliationStatus

## Owned Constraints
- unclassified-transaction
- missing-invoice
- unreconciled-entry
- incomplete-tax-posture

## Evaluation Capabilities
- evaluate()
- classifyTransaction()
- assessTaxImplications()
- reconcileEntry()
- assessFinancialImpact()

## Truth Boundary
The Accounting Kernel is the sole authority for financial truth.
No other kernel or layer may override financial assessments.
The Commercial Orchestrator may request assessments but cannot modify them.
