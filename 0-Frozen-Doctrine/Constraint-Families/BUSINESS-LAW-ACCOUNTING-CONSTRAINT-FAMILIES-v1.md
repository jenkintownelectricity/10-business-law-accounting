# Business Law Accounting Constraint Families — v1

**FROZEN — v1**
**Document ID**: constraint-families-v1
**Domain**: Business Law Accounting Domain OS
**Product**: Commercial Control Tower
**Frozen Date**: 2026-04-05
**Authority**: L0_ARMAND_LEFEBVRE

> This is frozen doctrine. Changes require formal change control per `docs/DOMAIN-CHANGE-CONTROL-v1.md`.

---

## Constraint Output Normalization

All constraints in the Business Law Accounting Domain OS produce one of the following normalized outputs:

| Output | Meaning |
|--------|---------|
| **PASS** | The constraint is satisfied. The operation may proceed. |
| **WARNING** | The constraint detected an issue that should be reviewed but does not block the operation. The practitioner is notified. |
| **HALT** | The constraint detected a blocking issue. The operation may not proceed until the issue is resolved. |
| **UNSUPPORTED** | The constraint cannot evaluate the given input. The input type or context is outside the constraint's scope. |
| **PARTIAL** | The constraint can only partially evaluate the input. Some required information is missing. The practitioner is notified of what is missing. |

These five output values are the only permitted constraint outputs across all kernels. No kernel may introduce additional output values without formal change control.

---

## Business Constraints

Business constraints are owned and enforced by the Business Kernel. They govern the integrity of business operations, commercial entities, and matter lifecycle.

### Missing Entity

**Constraint ID**: `BIZ-001-MISSING-ENTITY`

- **Trigger**: An operation references a business entity that does not exist in the Business Kernel's registry
- **Outputs**: HALT (entity required), WARNING (entity recommended but not required)
- **Resolution**: Create the entity in the Business Kernel, or confirm the operation does not require entity association
- **Scope**: All operations that reference business entities

### Incomplete Matter

**Constraint ID**: `BIZ-002-INCOMPLETE-MATTER`

- **Trigger**: A matter is missing required fields for its current lifecycle stage
- **Outputs**: HALT (required fields missing for stage transition), WARNING (recommended fields missing), PARTIAL (some fields present, others missing)
- **Resolution**: Complete the missing fields, or request a stage-appropriate waiver if the field is genuinely not applicable
- **Scope**: Matter creation, matter stage transitions, matter closure

### Unvalidated Vendor

**Constraint ID**: `BIZ-003-UNVALIDATED-VENDOR`

- **Trigger**: An operation involves a vendor that has not completed the validation process
- **Outputs**: HALT (vendor validation required before engagement), WARNING (vendor validation recommended)
- **Resolution**: Complete vendor validation process, or escalate for expedited review
- **Scope**: Vendor engagement, payment authorization, contract association with vendor

### Incomplete Client Engagement

**Constraint ID**: `BIZ-004-INCOMPLETE-CLIENT`

- **Trigger**: A client engagement record is missing required documentation or status confirmation
- **Outputs**: WARNING (engagement documentation incomplete), HALT (engagement cannot proceed without documentation)
- **Resolution**: Complete client engagement documentation
- **Scope**: Client matter creation, billing operations, client-facing deliverables

### Invalid Workflow Transition

**Constraint ID**: `BIZ-005-INVALID-WORKFLOW`

- **Trigger**: A workflow stage transition violates the defined stage sequence
- **Outputs**: HALT (transition not permitted), UNSUPPORTED (workflow type not recognized)
- **Resolution**: Follow the defined stage sequence, or submit a change request for the workflow definition
- **Scope**: All operational workflow transitions

---

## Law Constraints

Law constraints are owned and enforced by the Law Kernel. They govern the integrity of contracts, obligations, legal risk, compliance, and evidentiary requirements.

### Unsigned Contract

**Constraint ID**: `LAW-001-UNSIGNED-CONTRACT`

- **Trigger**: An operation requires a fully executed contract, but the contract is missing one or more required signatures
- **Outputs**: HALT (signatures required before operation), WARNING (contract is in signing process)
- **Resolution**: Obtain required signatures, or confirm the operation does not require full execution
- **Scope**: Obligation creation from contract, payment authorization referencing contract, compliance evaluation

### Unreviewed Obligation

**Constraint ID**: `LAW-002-UNREVIEWED-OBLIGATION`

- **Trigger**: An obligation exists that has not been formally reviewed by a qualified practitioner
- **Outputs**: HALT (obligation review required before action), WARNING (obligation should be reviewed)
- **Resolution**: Complete the obligation review process
- **Scope**: Obligation enforcement, deadline creation from obligation, compliance assessment

### Missing Evidence

**Constraint ID**: `LAW-003-MISSING-EVIDENCE`

- **Trigger**: A legal matter or compliance determination requires evidence that is not present in the evidence registry
- **Outputs**: HALT (evidence required), WARNING (evidence recommended), PARTIAL (some evidence present, gaps identified)
- **Resolution**: Obtain and register the required evidence with proper chain of custody
- **Scope**: Legal review, compliance determination, dispute resolution, audit response

### Expired Deadline

**Constraint ID**: `LAW-004-EXPIRED-DEADLINE`

- **Trigger**: A deadline has passed without the required action being completed
- **Outputs**: HALT (deadline expired, immediate attention required), WARNING (deadline approaching)
- **Resolution**: Assess consequences of expired deadline, take remedial action, document the situation
- **Scope**: All deadline-tracked obligations, compliance requirements, filing deadlines

### Incomplete Compliance Posture

**Constraint ID**: `LAW-005-INCOMPLETE-COMPLIANCE`

- **Trigger**: A compliance determination is based on incomplete information or outdated assessments
- **Outputs**: WARNING (compliance posture may be stale), HALT (compliance determination cannot be made with current information)
- **Resolution**: Update the compliance assessment with current information
- **Scope**: Compliance reporting, regulatory filings, audit response

---

## Accounting Constraints

Accounting constraints are owned and enforced by the Accounting Kernel. They govern the integrity of financial classification, invoicing, ledger management, reconciliation, and tax posture.

### Unclassified Transaction

**Constraint ID**: `ACCT-001-UNCLASSIFIED-TRANSACTION`

- **Trigger**: A financial transaction exists without proper classification in the accounting methodology
- **Outputs**: HALT (classification required before ledger posting), WARNING (classification recommended)
- **Resolution**: Classify the transaction according to the applicable accounting methodology
- **Scope**: Ledger posting, financial reporting, tax posture evaluation

### Missing Invoice

**Constraint ID**: `ACCT-002-MISSING-INVOICE`

- **Trigger**: An expected invoice (payable or receivable) is not present in the invoice registry
- **Outputs**: HALT (invoice required for processing), WARNING (invoice expected but not yet received)
- **Resolution**: Obtain or create the missing invoice
- **Scope**: Payment processing, revenue recognition, reconciliation, financial reporting

### Unreconciled Entry

**Constraint ID**: `ACCT-003-UNRECONCILED-ENTRY`

- **Trigger**: A ledger entry or account has not been reconciled within the expected period
- **Outputs**: HALT (reconciliation required before period close), WARNING (reconciliation overdue)
- **Resolution**: Complete the reconciliation process
- **Scope**: Period close, financial reporting, audit preparation

### Incomplete Tax Posture

**Constraint ID**: `ACCT-004-INCOMPLETE-TAX-POSTURE`

- **Trigger**: A tax posture determination is incomplete due to missing transactions, unclassified items, or unresolved methodology questions
- **Outputs**: HALT (tax posture cannot be determined), WARNING (tax posture may be inaccurate), PARTIAL (partial determination available)
- **Resolution**: Resolve the missing inputs and complete the tax posture determination
- **Scope**: Tax filing, tax advisory, financial planning, compliance reporting

### Ledger Imbalance

**Constraint ID**: `ACCT-005-LEDGER-IMBALANCE`

- **Trigger**: Ledger entries do not balance according to double-entry accounting principles
- **Outputs**: HALT (imbalance must be resolved)
- **Resolution**: Identify and correct the source of the imbalance
- **Scope**: All ledger operations, period close, financial reporting

---

## Cross-Domain Constraints

Cross-domain constraints are evaluated by the Commercial Orchestrator when operations span multiple kernels. They ensure that multi-kernel decisions maintain integrity across all contributing kernels.

### Decision Without All Kernel Inputs

**Constraint ID**: `CROSS-001-INCOMPLETE-DECISION`

- **Trigger**: A decision bundle is being assembled but one or more applicable kernels have not provided their assessment
- **Outputs**: HALT (all applicable kernel assessments required), WARNING (assessment from one kernel is pending), PARTIAL (some assessments received, others outstanding)
- **Resolution**: Obtain assessments from all applicable kernels before finalizing the decision bundle
- **Scope**: All cross-kernel decisions, matter lifecycle transitions that span kernels

### Unresolved Conflict Between Kernels

**Constraint ID**: `CROSS-002-KERNEL-CONFLICT`

- **Trigger**: Two or more kernels have produced conflicting assessments for the same matter or operation
- **Outputs**: HALT (conflict must be resolved by practitioner before proceeding), WARNING (potential conflict detected, review recommended)
- **Resolution**: The practitioner reviews the conflicting assessments, makes a determination, and documents the resolution with provenance from each kernel
- **Scope**: All cross-kernel decision bundles, matter assessments with multi-kernel input

### Provenance Gap

**Constraint ID**: `CROSS-003-PROVENANCE-GAP`

- **Trigger**: A combined output is missing source-kernel provenance for one or more components
- **Outputs**: HALT (provenance required for all kernel contributions)
- **Resolution**: Ensure all components of the combined output are tagged with their source kernel
- **Scope**: Decision bundles, combined reports, cross-kernel summaries

---

## Voice and Language Constraints

Voice and language constraints govern the integrity of assistive ingress from voice and language augmentation layers.

### Incomplete Transcript

**Constraint ID**: `VOICE-001-INCOMPLETE-TRANSCRIPT`

- **Trigger**: A speech-to-text transcript is incomplete due to audio quality issues, interruptions, or processing failures
- **Outputs**: WARNING (transcript may be incomplete, review recommended), PARTIAL (partial transcript available), HALT (transcript too incomplete for any use)
- **Resolution**: Re-dictate the content, manually complete the transcript, or discard and start over
- **Scope**: All voice intake processing, dictation sessions, meeting capture

### Low Confidence Utterance

**Constraint ID**: `VOICE-002-LOW-CONFIDENCE`

- **Trigger**: The speech-to-text system reports low confidence for one or more utterances in the transcript
- **Outputs**: WARNING (low confidence segments flagged for review), PARTIAL (high confidence segments available, low confidence segments marked)
- **Resolution**: Review flagged segments, correct as needed, or re-dictate
- **Scope**: All voice intake processing

### Ambiguous Routing

**Constraint ID**: `VOICE-003-AMBIGUOUS-ROUTING`

- **Trigger**: The system cannot determine which kernel should receive the voice or language input
- **Outputs**: WARNING (routing suggestion has low confidence), PARTIAL (multiple possible routings identified)
- **Resolution**: Practitioner selects the appropriate kernel routing, or the content is placed in a general review queue
- **Scope**: Voice command routing, dictation routing, language interpretation routing

### Unsafe Spoken Action

**Constraint ID**: `VOICE-004-UNSAFE-ACTION`

- **Trigger**: A spoken command is interpreted as requesting a domain-truth-affecting action (create, modify, delete domain objects)
- **Outputs**: HALT (spoken action requires explicit practitioner review and approval before execution)
- **Resolution**: The interpreted command is presented to the practitioner with its intended effect. The practitioner approves or rejects.
- **Scope**: All voice commands that would affect domain truth

### Unvalidated Language Interpretation

**Constraint ID**: `VOICE-005-UNVALIDATED-INTERPRETATION`

- **Trigger**: A language interpretation (terminology normalization, semantic mapping, cross-kernel alignment) has not been validated by a practitioner
- **Outputs**: WARNING (interpretation is suggestive only, requires validation)
- **Resolution**: Practitioner reviews and confirms or rejects the interpretation
- **Scope**: All language interpretation outputs that will be used in domain operations
