# Ghost Layer Implementation Evidence

## Commercial Control Tower — Ghost Layer Verification

**Date verified:** 2026-04-05

---

## Architecture Rule

> The Ghost Layer is **READ-ONLY**. It renders AI-generated proposals, suggestions, and overlays
> but **never mutates domain state** and **never calls vkbusClient** directly.
>
> Ghost content is visual-only. It is displayed to the operator for review. Any action
> on ghost content (promote, dismiss, pin) is handled by the parent component, which
> routes through vkbusClient.

## Components (Planned)

Directory: `src/components/ghost/`

| Component | File | Purpose |
|-----------|------|---------|
| GhostOverlay | `GhostOverlay.tsx` | Root overlay container for ghost proposals |
| GhostProposalCard | `GhostProposalCard.tsx` | Individual proposal card (read-only display) |
| GhostDiffView | `GhostDiffView.tsx` | Side-by-side diff of proposed vs. current |
| GhostConfidenceBar | `GhostConfidenceBar.tsx` | Visual confidence indicator for proposals |
| GhostDismissButton | `GhostDismissButton.tsx` | Dismiss button (emits callback, no mutation) |
| GhostPromoteButton | `GhostPromoteButton.tsx` | Promote button (emits callback, no mutation) |
| GhostLayerToggle | `GhostLayerToggle.tsx` | Toggle ghost layer visibility |
| GhostAttentionBadge | `GhostAttentionBadge.tsx` | Attention indicator for pending proposals |

## Library (Planned)

Directory: `src/lib/ghost/`

| Module | File | Purpose |
|--------|------|---------|
| ghostStore | `ghostStore.ts` | Local state for ghost proposals (read-only projections) |
| ghostRenderer | `ghostRenderer.ts` | Rendering logic for ghost overlays |
| ghostTypes | `ghostTypes.ts` | TypeScript types for ghost layer |

## Tests

Directory: `tests/`

| Test | File |
|------|------|
| Ghost layer read-only enforcement | `ghost-layer.readonly.test.ts` |
| Ghost layer rendering | `ghost-layer.render.test.ts` |
| Ghost layer dismiss/promote callbacks | `ghost-layer.actions.test.ts` |

## Proof: READ-ONLY Enforcement

### No domain mutation in ghost components

```bash
grep -R "set.*Active\|updateMatter\|save" src/components/ghost
```

**Expected result:** No output (no matches). Ghost components must not contain any mutation calls.

### No vkbusClient imports in ghost components

```bash
grep -R "vkbusClient" src/components/ghost
```

**Expected result:** No output (no matches). Ghost components must not import or use vkbusClient.

### No direct state setters

```bash
grep -R "dispatch\|setState\|mutate" src/components/ghost
```

**Expected result:** No output. Ghost components render props only.

## Enforcement Rules

1. Ghost components receive data via props (projected state from parent)
2. Ghost components emit user intent via callback props (onPromote, onDismiss, onPin)
3. Parent components handle callbacks by routing through vkbusClient
4. Ghost layer can be toggled without affecting domain state
5. Ghost proposals display confidence scores and source attribution
6. Ghost content is always visually distinguished (dashed amber border, "UNTRUSTED" label)
