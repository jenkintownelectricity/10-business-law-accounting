# Operator Focus Evidence

## Commercial Control Tower — Operator Focus Verification

**Date verified:** 2026-04-05

---

## Architecture Rules

> 1. Exactly **one PRIMARY_ACTIVE pane** at any time.
> 2. **AI cannot seize focus** — only the operator can change focus.
> 3. **Focus state is serializable** for replay and audit.

## Focus Store

**Path:** `src/lib/focus/operatorFocusStore.ts`

The operator focus store manages which pane is currently active. It enforces:
- Single active pane invariant
- Operator-initiated focus changes only
- Serializable focus state history

## Focus Components

Directory: `src/components/focus/`

| Component | File | Purpose |
|-----------|------|---------|
| FocusIndicator | `FocusIndicator.tsx` | Visual indicator of current focus pane |
| FocusRing | `FocusRing.tsx` | Focus ring around active pane |
| FocusBreadcrumb | `FocusBreadcrumb.tsx` | Breadcrumb trail of focus history |
| FocusLockBadge | `FocusLockBadge.tsx` | Shows when focus is locked by operator |

## Focus State Model

```typescript
interface OperatorFocusState {
  primary_active_pane: string;
  previous_pane: string | null;
  focus_locked: boolean;
  focus_history: FocusHistoryEntry[];
  last_change_by: 'OPERATOR' | 'SYSTEM_RESTORE';
  last_change_at: string;
}

interface FocusHistoryEntry {
  from_pane: string;
  to_pane: string;
  reason: string;
  initiated_by: 'OPERATOR' | 'SYSTEM_RESTORE';
  timestamp: string;
}
```

## Enforcement Rules

### Rule 1: Exactly one PRIMARY_ACTIVE pane

The focus store enforces that `primary_active_pane` is always set to exactly one pane identifier. Setting a new active pane automatically deactivates the previous one.

### Rule 2: AI cannot seize focus

Focus changes can only be initiated by:
- `OPERATOR` — direct user action (click, keyboard shortcut, command palette)
- `SYSTEM_RESTORE` — restoring saved focus state on session load

AI-generated suggestions, ghost proposals, and ephemeral content **cannot** change focus. They can request attention (via attention queue) but cannot seize focus.

```bash
grep -R "setFocus\|changeFocus" src/lib/ghost src/lib/ephemeral
```

**Expected result:** No output. Ghost and ephemeral layers must not call focus change functions.

### Rule 3: Focus state is serializable

The focus state is a plain serializable object. It can be:
- Serialized to JSON for persistence
- Replayed from saved state
- Audited via focus history log
- Transmitted via `cct.focus.change` VKBUS signals (observational)

## VKBUS Integration

Focus changes emit `cct.focus.change` signals via vkbusClient. These signals are:
- **Observational only** — they do not execute workflows
- **Logged for audit** — the execution spine routes them to the focus event logger
- **Replayable** — focus state can be reconstructed from signal history
