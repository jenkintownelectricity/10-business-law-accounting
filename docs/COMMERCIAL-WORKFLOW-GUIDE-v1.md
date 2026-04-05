# Commercial Workflow Guide v1

**Domain:** 10-business-law-accounting
**Date:** 2026-04-05

---

## Overview

This guide describes the primary commercial workflows in the domain. Each workflow produces typed outputs, preserves kernel provenance, and enforces constraints at every stage transition.

---

## 1. Contract Review Flow

### Purpose
Evaluate a contract from business, legal, and financial perspectives to produce a comprehensive review packet.

### Flow

```
1. Contract Intake
   -> Contract record created (status: DRAFT)
   -> Linked to matter (if applicable)
   -> Parties identified

2. Obligation Extraction (Law Kernel)
   -> Obligations identified from contract text
   -> Deadlines extracted and typed
   -> Each obligation linked to obligated party

3. Legal Risk Assessment (Law Kernel)
   -> Non-standard clauses identified
   -> Compliance concerns flagged
   -> Risk level scored (LOW / MEDIUM / HIGH / CRITICAL)
   -> Recommendation generated

4. Financial Impact Assessment (Accounting Kernel)
   -> Total contract value calculated
   -> Payment schedule analyzed
   -> Cash flow impact projected
   -> Tax implications identified
   -> Recommendation generated

5. Business Assessment (Business Kernel)
   -> Strategic alignment evaluated
   -> Vendor status confirmed
   -> Relationship value assessed
   -> Recommendation generated

6. Review Assembly (Commercial Orchestrator)
   -> All three kernel assessments assembled
   -> Conflicts detected (if any)
   -> Combined recommendation generated
   -> ContractReviewPacket produced

7. Practitioner Review
   -> Practitioner reviews assembled packet
   -> Accepts, modifies, or rejects recommendations
   -> Decision recorded with provenance

8. Contract Finalization
   -> Status updated (ACTIVE / REJECTED / MODIFIED)
   -> Receipts emitted
   -> Obligations activated (if approved)
```

### Output Type
`ContractReviewPacket` — Contains all kernel assessments, obligations, risks, financial impact, and recommendations.

### Constraints Enforced
- `UNSIGNED_CONTRACT` blocks enforcement
- `MISSING_EVIDENCE` blocks legal determination
- `UNVALIDATED_VENDOR` blocks vendor-side obligations
- `DECISION_WITHOUT_KERNEL_INPUTS` blocks premature approval

---

## 2. Invoice Processing Flow

### Purpose
Process an invoice through validation, classification, reconciliation, and payment readiness.

### Flow

```
1. Invoice Receipt
   -> Invoice record created
   -> Linked to vendor and contract (if applicable)
   -> Line items captured

2. Classification (Accounting Kernel)
   -> Each line item classified to ledger accounts
   -> Tax categories assigned
   -> Currency and amount validated

3. Reconciliation Check (Accounting Kernel)
   -> Invoice matched against purchase orders or contract terms
   -> Discrepancies flagged
   -> Reconciliation status set

4. Financial Validation (Accounting Kernel)
   -> Budget alignment checked
   -> Cash flow impact assessed
   -> Approval thresholds evaluated

5. Business Validation (Business Kernel)
   -> Vendor validation confirmed
   -> Matter linkage verified
   -> Business authorization confirmed

6. Payment Readiness
   -> All constraints resolved
   -> Invoice marked as ready for payment
   -> Receipt emitted
```

### Constraints Enforced
- `MISSING_INVOICE` blocks payment without proper documentation
- `UNCLASSIFIED_TRANSACTION` requires classification before posting
- `UNRECONCILED_ENTRY` requires discrepancy resolution
- `UNVALIDATED_VENDOR` blocks payment to unvalidated vendors

---

## 3. Matter Intake Flow

### Purpose
Create and initialize a new commercial matter with proper structure and assignments.

### Flow

```
1. Matter Creation
   -> Matter record created (status: INTAKE)
   -> Client linked
   -> Initial description captured
   -> Matter ID assigned

2. Initial Assessment (Business Kernel)
   -> Matter type classified
   -> Preliminary risk assessment
   -> Resource requirements estimated
   -> Practitioner assignment recommended

3. Evidence Gathering
   -> Initial evidence collected and linked
   -> Document inventory created
   -> Gaps identified

4. Contract Linkage (Law Kernel)
   -> Related contracts identified and linked
   -> Existing obligations surfaced
   -> Deadline inventory created

5. Financial Setup (Accounting Kernel)
   -> Budget established
   -> Billing structure configured
   -> Financial tracking initialized

6. Matter Activation
   -> Status transitions: INTAKE -> ACTIVE
   -> All constraints checked
   -> Receipt emitted
   -> Practitioner notified
```

### Constraints Enforced
- `MISSING_ENTITY` blocks creation without valid entity
- `INCOMPLETE_MATTER` warns on missing required fields
- `RISK_THRESHOLD_EXCEEDED` triggers senior review

---

## 4. Decision Thread Flow

### Purpose
Assemble multi-kernel assessments for a significant commercial decision.

### Flow

```
1. Decision Question Posed
   -> Decision thread created
   -> Question and context recorded
   -> Linked to matter
   -> Relevant kernels identified

2. Business Assessment (Business Kernel)
   -> Strategic impact evaluated
   -> Business risk scored
   -> Recommendation generated with rationale

3. Legal Assessment (Law Kernel)
   -> Legal risk evaluated
   -> Compliance implications assessed
   -> Recommendation generated with rationale

4. Financial Assessment (Accounting Kernel)
   -> Financial impact calculated
   -> Cash flow implications projected
   -> Recommendation generated with rationale

5. Bundle Assembly (Commercial Orchestrator)
   -> All assessments collected
   -> Source-kernel provenance preserved
   -> Conflicts detected and flagged
   -> Combined recommendation generated
   -> Action items compiled

6. Practitioner Decision
   -> Practitioner reviews full bundle
   -> Accepts, modifies, or overrides recommendation
   -> Decision recorded with rationale
   -> Action items assigned

7. Decision Execution
   -> Status: DECIDED
   -> Action items tracked
   -> Receipts emitted
   -> Affected matters/contracts updated
```

### Constraints Enforced
- `DECISION_WITHOUT_KERNEL_INPUTS` blocks premature decision
- `UNRESOLVED_CONFLICT` requires practitioner resolution before finalization

---

## 5. Obligation Tracking Flow

### Purpose
Track contractual obligations through their lifecycle from identification to fulfillment or breach.

### Flow

```
1. Obligation Identification (Law Kernel)
   -> Obligation extracted from contract
   -> Parties and roles assigned
   -> Deadline set
   -> Status: ACTIVE

2. Monitoring
   -> Deadline tracking (upcoming, due, overdue)
   -> Periodic review scheduling
   -> Evidence collection for fulfillment proof

3. Fulfillment Assessment (Law Kernel)
   -> Evidence reviewed
   -> Fulfillment criteria evaluated
   -> Status updated: FULFILLED / PARTIALLY_FULFILLED

4. Breach Detection (Law Kernel)
   -> Deadline passed without fulfillment
   -> Breach flagged automatically
   -> Status: BREACHED
   -> Escalation triggered

5. Financial Impact Update (Accounting Kernel)
   -> Financial implications of fulfillment/breach calculated
   -> Ledger entries created as needed
   -> Liability adjustments made

6. Resolution
   -> Waiver, renegotiation, or enforcement action
   -> Final status recorded
   -> Receipt emitted
```

### Constraints Enforced
- `UNREVIEWED_OBLIGATION` flags obligations needing periodic review
- `EXPIRED_DEADLINE` escalates overdue obligations
- `MISSING_EVIDENCE` blocks fulfillment claims without proof
