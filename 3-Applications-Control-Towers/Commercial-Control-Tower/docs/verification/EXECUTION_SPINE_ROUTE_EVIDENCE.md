# Execution Spine Route Evidence

## Commercial Control Tower — Execution Spine Routing Verification

**Date verified:** 2026-04-05

---

## Architecture Rule

> All CCT signals route through the execution spine with constraint evaluation and receipt emission.
> The CCT never directly invokes kernels, orchestrators, or workflows.

## CCT-Specific Routes

All routes at `30-validkernel-platform/execution-spine/routing/`:

| Route | File | Target |
|-------|------|--------|
| Business Requests | `route.cct.business_requests.ts` | Business Kernel |
| Law Requests | `route.cct.law_requests.ts` | Law Kernel |
| Accounting Requests | `route.cct.accounting_requests.ts` | Accounting Kernel |
| Language Requests | `route.cct.language_requests.ts` | Language Intelligence Layer |
| Focus Events | `route.cct.focus_events.ts` | Observational logging (no workflow execution) |
| Ephemeral Promotions | `route.cct.ephemeral_promotions.ts` | Full trust boundary promotion |

## Route Processing Pipeline

Every CCT route follows this pipeline:

1. **Validate promotion payload** — reject malformed signals
2. **Typed promotion** — signal -> typed domain request (e.g., `ContractReviewRequest`, `InvoiceProcessingRequest`)
3. **Constraint port evaluation** — evaluate domain constraints before execution
4. **Route to kernel/orchestrator** — dispatch to the appropriate domain handler
5. **Emit receipt** — success / halt / review-required
6. **Return receipt to CCT** — via subscription for UI display

## Focus Events — Special Case

Focus events (`route.cct.focus_events.ts`) are **OBSERVATIONAL ONLY**:
- They do NOT execute workflows
- They are logged for replay and audit
- They enable focus state reconstruction
- Status is always `OBSERVED`, never `ROUTED`

## Ephemeral Promotions — Full Trust Boundary

Ephemeral promotions (`route.cct.ephemeral_promotions.ts`) pass through the full trust boundary:
- Signal trust level is `UNTRUSTED` (from CCT surface)
- Promotion performs typed domain conversion
- Constraint evaluation gates execution
- Only `PROMOTED` status signals proceed to kernel
- `CONSTRAINT_HALT` and `REVIEW_REQUIRED` statuses block execution

## Proof

```bash
ls 30-validkernel-platform/execution-spine/routing/route.cct.*.ts
```

**Expected result:** All 6 CCT route files listed.

```bash
grep -R "COMMERCIAL_CONTROL_TOWER" 30-validkernel-platform/execution-spine/routing/route.cct.*.ts
```

**Expected result:** All route files reference COMMERCIAL_CONTROL_TOWER as the expected source surface.
