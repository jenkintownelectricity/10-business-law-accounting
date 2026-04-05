# Business Law Accounting Commercial Orchestration — v1

**FROZEN — v1**
**Document ID**: commercial-orchestration-v1
**Domain**: Business Law Accounting Domain OS
**Product**: Commercial Control Tower
**Frozen Date**: 2026-04-05
**Authority**: L0_ARMAND_LEFEBVRE

> This is frozen doctrine. Changes require formal change control per `docs/DOMAIN-CHANGE-CONTROL-v1.md`.

---

## Commercial Orchestrator Role

The Commercial Orchestrator is the cross-kernel coordination mechanism for the Business Law Accounting Domain OS. It coordinates operations that span the Business Kernel, Law Kernel, and Accounting Kernel.

The orchestrator exists because commercial matters rarely live within a single discipline. A vendor engagement involves business operations (entity, vendor validation), legal requirements (contract, obligations), and financial treatment (invoicing, payment classification, tax posture). The orchestrator ensures all relevant kernels participate in decisions without any single kernel overriding another.

---

## Fundamental Principle: Orchestration Does Not Override

The Commercial Orchestrator coordinates. It does not override.

- The orchestrator does not possess its own truth about business, law, or accounting matters
- The orchestrator does not define types that compete with kernel types
- The orchestrator does not enforce constraints that override kernel constraints
- The orchestrator does not resolve conflicts between kernels — it surfaces them
- The orchestrator does not validate domain objects — kernels validate
- The orchestrator does not approve or reject kernel assessments — practitioners approve or reject

The orchestrator is a coordination service, not a truth authority.

---

## Decision Bundle Assembly

A decision bundle is a structured package containing assessments from each applicable kernel for a given matter or operation.

### Assembly Process

1. **Trigger**: An operation or matter requires input from multiple kernels
2. **Kernel Identification**: The orchestrator determines which kernels are applicable based on the nature of the operation
3. **Assessment Request**: The orchestrator requests an assessment from each applicable kernel
4. **Assessment Collection**: Each kernel independently evaluates the matter within its truth boundary and returns its assessment
5. **Bundle Assembly**: The orchestrator assembles the assessments into a decision bundle, preserving source-kernel provenance
6. **Conflict Detection**: The orchestrator scans for conflicts between kernel assessments
7. **Bundle Delivery**: The complete decision bundle is delivered to the practitioner (via UI) or to the requesting operation

### Decision Bundle Structure

Each decision bundle contains:

- `bundleId`: Unique identifier
- `matterId`: Reference to the associated matter (if applicable)
- `operationType`: The type of operation or decision being supported
- `timestamp`: ISO 8601 timestamp of bundle assembly
- `kernelAssessments`: Array of assessments, each containing:
  - `sourceKernel`: Which kernel produced the assessment (business, law, accounting)
  - `assessmentTimestamp`: When the kernel produced the assessment
  - `status`: Overall assessment status (PASS, WARNING, HALT, PARTIAL)
  - `constraintResults`: Individual constraint evaluation results
  - `narrative`: Kernel-authored summary of the assessment
  - `recommendations`: Kernel-specific recommendations (if any)
- `conflictDetected`: Boolean indicating whether kernel assessments conflict
- `conflictDetails`: Description of the conflict (if detected)
- `receiptId`: Reference to the receipt documenting this bundle assembly

### Requires Assessment From Each Applicable Kernel

A decision bundle is not complete until all applicable kernels have provided their assessment. The `CROSS-001-INCOMPLETE-DECISION` constraint enforces this requirement. The orchestrator does not deliver partial bundles as if they were complete.

If a kernel cannot provide an assessment (e.g., the matter is outside its scope), the kernel returns an UNSUPPORTED status, which is included in the bundle.

---

## Source-Kernel Provenance Preservation

Every piece of information in a decision bundle, a combined report, or a cross-kernel view must carry source-kernel provenance.

### Provenance Rules

1. **Assessment attribution**: Every assessment is tagged with its source kernel
2. **Constraint attribution**: Every constraint result is tagged with its owning kernel
3. **Recommendation attribution**: Every recommendation is tagged with its source kernel
4. **No blending**: Assessments from different kernels are not merged into a single undifferentiated narrative
5. **UI enforcement**: The Commercial Control Tower must display kernel provenance in all cross-kernel views
6. **Export enforcement**: All exported documents preserve kernel provenance markers
7. **Receipt enforcement**: All receipts for cross-kernel operations include provenance references

### Provenance Violations

The following are provenance violations:

- Presenting a combined assessment without indicating which kernel contributed what
- Attributing one kernel's recommendation to another kernel
- Blending constraint results from multiple kernels into a single status without per-kernel detail
- Displaying a cross-kernel decision as if it came from a single source

Provenance violations are treated as system integrity issues.

---

## Cross-Domain Routing Rules

The orchestrator routes incoming content to the appropriate kernel(s) based on the content's nature and context.

### Routing Determination

| Content Type | Primary Kernel | Secondary Kernel(s) | Notes |
|-------------|---------------|---------------------|-------|
| New entity registration | Business | — | Business Kernel owns entities |
| Vendor engagement request | Business | Law, Accounting | Business initiates, Law reviews terms, Accounting classifies payments |
| Contract submission | Law | Business, Accounting | Law owns contracts, Business tracks relationship, Accounting classifies obligations |
| Invoice processing | Accounting | Business, Law | Accounting owns invoices, Business confirms vendor, Law checks obligation alignment |
| Compliance inquiry | Law | Business, Accounting | Law leads compliance, others provide supporting data |
| Tax posture evaluation | Accounting | Law | Accounting owns tax posture, Law provides regulatory context |
| Matter creation | Business | Law, Accounting | Business creates matter, other kernels assess if applicable |
| Deadline tracking | Law | Business, Accounting | Law owns deadlines, others track related commitments |
| Payment authorization | Accounting | Business, Law | Accounting authorizes, Business confirms vendor, Law confirms obligation |

### Routing for Voice/Language Input

Voice and language input arrives as candidate envelopes from the Review Queue (after practitioner approval). The orchestrator routes approved candidates to the appropriate kernel(s) using the same routing rules as direct input.

If routing is ambiguous, the orchestrator places the content in a general intake queue and requests practitioner clarification on kernel routing.

---

## Matter Lifecycle Management

The orchestrator manages matter lifecycle transitions that span multiple kernels.

### Matter Lifecycle Stages

| Stage | Description | Kernels Involved |
|-------|-------------|-----------------|
| **Intake** | New matter received, initial classification | Business (primary), Orchestrator |
| **Assessment** | Kernels evaluate the matter within their scope | All applicable kernels |
| **Active** | Matter is being worked, ongoing kernel updates | All applicable kernels |
| **Review** | Matter ready for review, decision bundles assembled | All applicable kernels, Orchestrator |
| **Resolution** | Matter being resolved, final actions taken | All applicable kernels |
| **Closure** | Matter closed, final receipts emitted | All applicable kernels, Orchestrator |
| **Archive** | Matter archived for lineage tracking | Orchestrator, Archive system |

### Cross-Kernel Stage Transitions

When a matter transitions between stages, the orchestrator:

1. Notifies all applicable kernels of the pending transition
2. Collects readiness assessments from each kernel
3. Evaluates cross-domain constraints (CROSS-001, CROSS-002)
4. If all constraints pass: executes the transition and emits a receipt
5. If constraints fail: surfaces the issues to the practitioner

---

## Platform Attachment Coordination

The orchestrator coordinates platform attachment operations on behalf of the domain.

### Coordinated Platform Operations

- **Receipt emission**: The orchestrator emits cross-kernel receipts through the `receiptBridge`
- **Trust-boundary requests**: The orchestrator routes trust-boundary evaluation requests through the `trustBoundaryBridge` on behalf of operations that span kernels
- **Replay event emission**: The orchestrator emits cross-kernel events through the `replayBridge` for operations that span kernels

### Platform Coordination Rules

1. Individual kernel operations use platform attachment paths directly (kernel -> bridge -> platform)
2. Cross-kernel operations use the orchestrator as coordinator (kernel -> orchestrator -> bridge -> platform)
3. The orchestrator does not cache or store platform responses — it forwards them to the requesting kernel
4. The orchestrator does not modify platform responses — it delivers them as received

---

## Advisory Intake Routing From Voice/Language Layers

When voice or language augmentation layers produce advisory packets, the orchestrator routes them to the appropriate kernel(s) for evaluation.

### Advisory Routing Process

1. **Intake**: Advisory packet arrives from the Review Queue (practitioner has approved the candidate)
2. **Classification**: The orchestrator examines the advisory content and determines applicable kernel(s)
3. **Routing**: The orchestrator forwards the advisory to each applicable kernel
4. **Kernel Processing**: Each kernel evaluates the advisory within its truth boundary
5. **Response Assembly**: If multiple kernels processed the advisory, the orchestrator assembles their responses into a decision bundle
6. **Delivery**: The assembled response is delivered to the practitioner

### Advisory Routing Rules

- Advisories from voice intake follow the same routing rules as direct content
- Advisories retain their UNTRUSTED-until-typed provenance through routing
- The orchestrator does not elevate advisory trust level — only kernels and trust-boundary handling do that
- If the advisory cannot be routed to a specific kernel, it is placed in a general review queue with a request for practitioner classification
