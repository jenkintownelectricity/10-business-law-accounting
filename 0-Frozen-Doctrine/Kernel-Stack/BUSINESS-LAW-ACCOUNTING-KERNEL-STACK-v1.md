# Business Law Accounting Kernel Stack — v1

**FROZEN — v1**
**Document ID**: kernel-stack-v1
**Domain**: Business Law Accounting Domain OS
**Product**: Commercial Control Tower
**Frozen Date**: 2026-04-05
**Authority**: L0_ARMAND_LEFEBVRE

> This is frozen doctrine. Changes require formal change control per `docs/DOMAIN-CHANGE-CONTROL-v1.md`.

---

## Business Kernel

### Scope

The Business Kernel governs all business operations and commercial organization within the domain. It is the authoritative source for entity management, vendor relationships, client engagement, commercial matter lifecycle, and operational workflows.

### Truth Boundaries

The Business Kernel is the sole truth authority for:

- What constitutes a business entity within this domain
- What constitutes a valid vendor relationship
- What constitutes a client engagement
- What constitutes a commercial matter and its lifecycle stages
- What constitutes an operational workflow and its completion criteria
- What constitutes a valid commercial relationship between parties

No other kernel, orchestrator, UI layer, platform component, or augmentation layer may define, override, or silently modify Business Kernel truth.

### Owned Types

| Type | Description |
|------|-------------|
| `Entity` | A business entity (company, partnership, sole proprietorship, trust, etc.) |
| `Vendor` | An external party providing goods or services |
| `Client` | A party receiving services from the practitioner |
| `Matter` | A commercial matter requiring business attention (may span kernels via orchestrator) |
| `CommercialRelationship` | A defined relationship between two or more parties |
| `OperationalWorkflow` | A sequence of business operations with defined stages |
| `BusinessContact` | A person associated with an entity, vendor, or client |
| `BusinessDocument` | A document owned by the Business Kernel (proposals, agreements in principle, correspondence) |

### Owned Constraints

| Constraint | Output | Description |
|-----------|--------|-------------|
| `EntityCompleteness` | PASS / WARNING / HALT | Entity has all required identifying information |
| `VendorValidation` | PASS / WARNING / HALT | Vendor has been validated for engagement |
| `MatterLifecycleIntegrity` | PASS / WARNING / HALT | Matter is in a valid lifecycle state for the requested operation |
| `ClientEngagementStatus` | PASS / WARNING | Client engagement is active and properly documented |
| `RelationshipCompleteness` | PASS / WARNING | Commercial relationship has all required parties and terms |
| `WorkflowStageValidity` | PASS / HALT | Workflow stage transition is valid |

---

## Law Kernel

### Scope

The Law Kernel governs all legal obligations, contractual relationships, compliance determinations, and legal risk assessments within the domain. It is the authoritative source for contract lifecycle, obligation tracking, legal risk evaluation, compliance posture, deadline enforcement, and evidence chain management.

### Truth Boundaries

The Law Kernel is the sole truth authority for:

- What constitutes a contract and its binding status
- What constitutes a legal obligation and its enforcement requirements
- What constitutes a legal risk and its severity classification
- What constitutes a compliance determination and its validity
- What constitutes an enforceable deadline and its consequences
- What constitutes evidence and its chain of custody requirements

No other kernel, orchestrator, UI layer, platform component, or augmentation layer may define, override, or silently modify Law Kernel truth.

### Owned Types

| Type | Description |
|------|-------------|
| `Contract` | A legal agreement between parties with defined terms and obligations |
| `Obligation` | A specific requirement arising from a contract, regulation, or legal relationship |
| `LegalRisk` | An identified legal risk with severity classification and mitigation posture |
| `ComplianceDetermination` | A formal assessment of compliance status against a requirement |
| `Deadline` | An enforceable deadline with consequences for non-compliance |
| `Evidence` | A piece of evidence with chain of custody and authenticity tracking |
| `LegalReview` | A formal legal review of a matter, contract, or obligation |
| `LegalDocument` | A document owned by the Law Kernel (contracts, filings, legal opinions, correspondence) |

### Owned Constraints

| Constraint | Output | Description |
|-----------|--------|-------------|
| `ContractSigningStatus` | PASS / WARNING / HALT | Contract has required signatures and execution |
| `ObligationReviewCompleteness` | PASS / WARNING / HALT | Obligation has been reviewed and classified |
| `EvidenceChainIntegrity` | PASS / WARNING / HALT | Evidence chain of custody is intact |
| `DeadlineEnforcement` | PASS / WARNING / HALT | Deadline is being tracked and has not been missed |
| `CompliancePostureValidity` | PASS / WARNING | Compliance determination is current and valid |
| `MissingEvidence` | PASS / HALT | Required evidence is present for the legal matter |
| `UnreviewedObligation` | WARNING / HALT | Obligation exists that has not been reviewed |

---

## Accounting Kernel

### Scope

The Accounting Kernel governs all financial treatment, classification, and accounting methodology within the domain. It is the authoritative source for transaction classification, invoice processing, ledger management, financial reporting posture, tax posture evaluation, and reconciliation.

### Truth Boundaries

The Accounting Kernel is the sole truth authority for:

- What constitutes a financial transaction and its classification
- What constitutes a valid invoice and its processing status
- What constitutes a ledger entry and its classification
- What constitutes a financial classification and its methodology
- What constitutes a tax posture determination and its basis
- What constitutes a reconciled state and its verification

No other kernel, orchestrator, UI layer, platform component, or augmentation layer may define, override, or silently modify Accounting Kernel truth.

### Owned Types

| Type | Description |
|------|-------------|
| `Transaction` | A financial transaction with classification and amount |
| `Invoice` | An invoice (payable or receivable) with line items and status |
| `LedgerEntry` | An entry in the financial ledger with account classification |
| `FinancialClassification` | A classification determination for a financial event |
| `TaxPosture` | A tax posture determination with basis and methodology |
| `ReconciliationRecord` | A reconciliation record linking expected and actual financial states |
| `AccountingDocument` | A document owned by the Accounting Kernel (statements, reports, tax filings) |
| `FinancialPeriod` | A defined financial period for reporting and reconciliation |

### Owned Constraints

| Constraint | Output | Description |
|-----------|--------|-------------|
| `TransactionClassification` | PASS / WARNING / HALT | Transaction has been classified according to accounting methodology |
| `InvoiceCompleteness` | PASS / WARNING / HALT | Invoice has all required fields and valid line items |
| `ReconciliationStatus` | PASS / WARNING / HALT | Account or period reconciliation is current |
| `TaxPostureAccuracy` | PASS / WARNING | Tax posture determination is based on current data and valid methodology |
| `LedgerIntegrity` | PASS / HALT | Ledger entries balance and are properly classified |
| `UnclassifiedTransaction` | WARNING / HALT | Transaction exists without proper classification |
| `MissingInvoice` | WARNING / HALT | Expected invoice is not present |
| `IncompleTaxPosture` | WARNING / HALT | Tax posture determination is incomplete |

---

## Kernel Interaction Rules

### Rule 1: No Cross-Kernel Truth Mutation

A kernel may not directly create, modify, or delete truth objects owned by another kernel. The Business Kernel cannot modify a Contract (Law Kernel). The Law Kernel cannot modify a Transaction (Accounting Kernel). The Accounting Kernel cannot modify a Matter lifecycle (Business Kernel).

### Rule 2: Cross-Kernel References Are Allowed

Kernels may reference objects owned by other kernels. A Contract (Law Kernel) may reference a Client (Business Kernel). A Transaction (Accounting Kernel) may reference a Contract (Law Kernel). References are read-only from the referencing kernel's perspective.

### Rule 3: Cross-Kernel Queries Are Allowed

A kernel may query another kernel for information. The Law Kernel may ask the Business Kernel for entity details when evaluating a contract. The Accounting Kernel may ask the Law Kernel for obligation details when classifying a transaction. Queries do not grant mutation rights.

### Rule 4: Conflict Surfacing Is Mandatory

When two kernels produce conflicting assessments of the same matter (e.g., the Business Kernel says a vendor relationship is valid, but the Law Kernel flags the vendor agreement as non-compliant), the conflict must be surfaced to the practitioner. No kernel may silently override another kernel's assessment.

### Rule 5: Kernel Independence in Validation

Each kernel validates its own objects independently. The Business Kernel does not defer validation to the Law Kernel. The Accounting Kernel does not defer validation to the Business Kernel. Each kernel's constraints run against its own truth boundary.

---

## Cross-Kernel Coordination via Commercial Orchestrator

The Commercial Orchestrator is the sole coordination mechanism for cross-kernel operations.

### Orchestrator Coordination Patterns

**Matter Routing**: When a new matter enters the domain, the orchestrator determines which kernels are relevant and routes the matter to each applicable kernel for assessment.

**Decision Bundle Assembly**: When a decision requires input from multiple kernels, the orchestrator collects assessments from each relevant kernel and assembles them into a decision bundle. Each assessment retains its source-kernel provenance.

**Conflict Detection**: When kernel assessments conflict, the orchestrator detects the conflict and surfaces it to the practitioner with full provenance from each kernel.

**Lifecycle Coordination**: When a matter lifecycle transition spans multiple kernels (e.g., closing a matter requires confirming contract completion, final invoicing, and entity status update), the orchestrator coordinates the transition across kernels.

### What the Orchestrator Does Not Do

- The orchestrator does not validate domain objects (kernels validate)
- The orchestrator does not resolve conflicts (practitioners resolve)
- The orchestrator does not own truth (kernels own truth)
- The orchestrator does not define types (kernels define types)
- The orchestrator does not enforce constraints (kernels enforce constraints)

---

## Kernel Provenance Preservation in Combined Decisions

When multiple kernels contribute to a decision, every output must preserve the provenance of each kernel's contribution.

### Provenance Requirements

1. **Source tagging**: Every assessment in a decision bundle is tagged with its source kernel
2. **Independent presentation**: Each kernel's assessment is presented as a distinct section, not blended into a single narrative
3. **Confidence attribution**: If confidence levels differ across kernels, each kernel's confidence is shown independently
4. **Constraint attribution**: If constraints are triggered, the triggering kernel is identified
5. **Timestamp attribution**: Each kernel's assessment carries its own timestamp, reflecting when that kernel evaluated the matter

### Provenance Example

A decision bundle for "Should we proceed with Vendor X engagement?" might contain:

- **Business Kernel Assessment**: Vendor X meets operational requirements. Entity validated. Relationship terms acceptable. [PASS]
- **Law Kernel Assessment**: Vendor X agreement has unsigned addendum. Liability clause requires review. [WARNING — unsigned contract, unreviewed obligation]
- **Accounting Kernel Assessment**: Vendor X payment terms are non-standard. Classification pending. [WARNING — unclassified transaction]

The practitioner sees all three assessments with clear kernel attribution. The orchestrator does not blend these into "Vendor X is mostly ready."
