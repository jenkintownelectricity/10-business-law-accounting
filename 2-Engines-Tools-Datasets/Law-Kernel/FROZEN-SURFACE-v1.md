# Law Kernel — Frozen Surface v1

FROZEN — v1

## Owned Types
- LegalContract
- Obligation
- LegalRisk
- ComplianceStatus
- LegalAssessment
- EvidenceItem

## Owned Constraints
- unsigned-contract
- unreviewed-obligation
- missing-evidence
- expired-deadline
- incomplete-party-identification
- unassessed-legal-risk

## Evaluation Capabilities
- evaluate()
- extractObligations()
- assessLegalRisk()
- checkCompliance()

## Truth Boundary
The Law Kernel is the sole authority for legal truth.
No other kernel or layer may override legal assessments.
The Commercial Orchestrator may request assessments but cannot modify them.
