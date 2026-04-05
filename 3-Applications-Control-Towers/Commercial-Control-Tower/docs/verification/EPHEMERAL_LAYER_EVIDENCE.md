# Ephemeral Layer Implementation Evidence

## Commercial Control Tower — Ephemeral Layer Verification

**Date verified:** 2026-04-05

---

## Architecture Rules

> Ephemeral proposals are **UNTRUSTED** until explicitly promoted by the operator.
>
> There is **no auto-solidification** — ephemeral content never automatically becomes domain truth.
>
> There is **no auto-workflow execution** — ephemeral content never triggers workflow execution without explicit operator action.

## Components (Planned)

Directory: `src/components/ephemeral/`

| Component | File | Purpose |
|-----------|------|---------|
| EphemeralProposalPanel | `EphemeralProposalPanel.tsx` | Container for ephemeral proposals |
| EphemeralProposalCard | `EphemeralProposalCard.tsx` | Individual ephemeral proposal display |
| EphemeralDiffInline | `EphemeralDiffInline.tsx` | Inline diff showing proposed changes |
| EphemeralPromotionDialog | `EphemeralPromotionDialog.tsx` | Confirmation dialog for promoting ephemeral to solid |
| EphemeralExpiryIndicator | `EphemeralExpiryIndicator.tsx` | Shows TTL / expiry for ephemeral content |
| EphemeralSourceAttribution | `EphemeralSourceAttribution.tsx` | Shows origin (AI model, confidence, reasoning) |
| EphemeralBatchReview | `EphemeralBatchReview.tsx` | Batch review of multiple ephemeral proposals |

## Library (Planned)

Directory: `src/lib/ephemeral/`

| Module | File | Purpose |
|--------|------|---------|
| ephemeralStore | `ephemeralStore.ts` | Local state for ephemeral proposals |
| ephemeralLifecycle | `ephemeralLifecycle.ts` | TTL management, expiry, cleanup |
| ephemeralTypes | `ephemeralTypes.ts` | TypeScript types for ephemeral layer |
| ephemeralPromotion | `ephemeralPromotion.ts` | Promotion logic (ephemeral -> vkbus signal) |

## Tests

Directory: `tests/`

| Test | File |
|------|------|
| No auto-solidification | `ephemeral-no-auto-solidify.test.ts` |
| No auto-workflow execution | `ephemeral-no-auto-execute.test.ts` |
| Ephemeral expiry/TTL | `ephemeral-lifecycle.test.ts` |
| Promotion requires operator action | `ephemeral-promotion.test.ts` |

## Enforcement Rules

1. **No auto-solidification:** Ephemeral proposals remain ephemeral until the operator explicitly promotes them. There is no timer, no threshold, no automatic promotion path.

2. **No auto-workflow execution:** Ephemeral content cannot trigger workflow execution. Even if an ephemeral proposal contains a complete workflow payload, it must be explicitly promoted before any execution occurs.

3. **Explicit promotion path:** Promotion of ephemeral content routes through vkbusClient as a `cct.ghost.promote` signal, which then passes through the execution spine with full constraint evaluation.

4. **TTL and expiry:** Ephemeral proposals have a configurable TTL. Expired proposals are removed from the UI, not promoted.

5. **Source attribution:** All ephemeral content displays its origin (which AI model, confidence score, reasoning chain).

6. **Visual distinction:** Ephemeral content is always rendered with the untrusted content styling (dashed amber border, "UNTRUSTED" label).

## Proof Commands

### No auto-solidification

```bash
grep -R "autoSolidify\|auto_solidify\|autoPromote\|auto_promote" src/components/ephemeral src/lib/ephemeral
```

**Expected result:** No output.

### No auto-workflow execution

```bash
grep -R "autoExecute\|auto_execute\|runWorkflow\|executeWorkflow" src/components/ephemeral src/lib/ephemeral
```

**Expected result:** No output.
