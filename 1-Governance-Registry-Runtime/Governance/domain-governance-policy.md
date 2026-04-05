# Domain Governance Policy

**Domain:** Business Law Accounting (10-business-law-accounting)
**Version:** 1.0.0
**Effective:** 2026-04-05

---

## 1. Three-Kernel Model

This domain operates under a strict three-kernel architecture. Each kernel owns a distinct truth domain and no kernel may override or modify the truth owned by another.

| Kernel | Owns |
|---|---|
| **Business Kernel** | Business entities, vendor relationships, commercial matter assessment, business risk evaluation |
| **Law Kernel** | Contracts, obligations, legal risk, compliance, evidence chain, legal deadlines, legal opinions |
| **Accounting Kernel** | Financial treatment, invoices, ledger classification, tax posture, reconciliation, financial impact |

### 1.1 Kernel Sovereignty

- Each kernel is the sole authority over its owned types and assessments.
- No kernel may unilaterally create, modify, or delete records owned by another kernel.
- Cross-kernel operations must be coordinated through the Commercial Orchestrator.

### 1.2 Non-Sovereign Assist Layers

Two assist layers provide supportive capabilities but hold no sovereign authority:

| Layer | Function | Trust Level |
|---|---|---|
| **Voice Assist Layer** | Hands-free input, spoken command candidates, meeting listening | UNTRUSTED until reviewed |
| **Language Intelligence Layer** | Language normalization, terminology alignment, disambiguation | ADVISORY only |

These layers may produce candidate objects and routing hints but may never directly create domain truth.

## 2. Commercial Orchestrator Rules

The Commercial Orchestrator coordinates across all three kernels and both assist layers. It:

- Routes matters to the appropriate kernel(s) based on content analysis.
- Assembles CommercialDecisionBundles from individual kernel assessments.
- Preserves source_kernel provenance on all assembled outputs.
- Routes advisory intake from voice/language layers to appropriate review queues.
- **Never** overrides individual kernel truth.
- **Never** promotes advisory/untrusted input to domain truth without practitioner review.
- Emits receipts for all routing and assembly operations.

### 2.1 Orchestrator Constraints

- The orchestrator must not fabricate assessments for a kernel that has not responded.
- If a kernel returns an UNSUPPORTED constraint, the orchestrator must surface this to the practitioner.
- The orchestrator must preserve all source_kernel_receipts and advisory_support_receipts in decision bundles.

## 3. Platform Attachment Governance

This domain attaches to 30-validkernel-platform. Platform attachment is governed by:

- **Trust Boundary Evaluation:** All domain objects crossing the platform boundary must pass trust evaluation.
- **Typed Promotion:** Objects may only be promoted through the platform's typed promotion protocol.
- **Receipt Emission:** All state changes must emit receipts to the platform receipt ledger.
- **Replay:** All operations must be replayable from the receipt chain.

### 3.1 Platform Attachment Constraints

- This domain must not bypass the platform trust boundary.
- This domain must not emit untyped or unstructured data to the platform.
- All platform-facing operations must go through the domainRuntimeFacade.

## 4. Change Control Requirements

### 4.1 Frozen Surfaces

Each kernel and layer publishes a FROZEN-SURFACE document. Changes to frozen surfaces require:

1. Written change proposal with rationale.
2. Impact assessment across all three kernels.
3. Practitioner review and approval.
4. Version increment of the affected frozen surface.
5. Receipt emission recording the change.

### 4.2 Registry Changes

Adding or removing catalog types requires:

1. Update to registry-manifest.json.
2. Corresponding catalog TypeScript file.
3. Re-export from Registry index.
4. Documentation of the new type's kernel ownership.

### 4.3 Governance Policy Changes

Changes to governance policies (including this document) require:

1. Written change proposal.
2. Assessment of impact on all kernels and layers.
3. Practitioner review.
4. Version increment.
5. Receipt emission.

---

**This policy is the root governance document for the 10-business-law-accounting domain.**
