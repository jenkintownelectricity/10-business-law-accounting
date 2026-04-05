# COMMAND-FIRST-OPERATING-SURFACE-v1

**Status:** FROZEN  
**Version:** v1  
**Authority:** L0_ARMAND_LEFEBVRE  
**Frozen At:** 2026-04-05  
**Source Repository:** 10-business-law-accounting  
**Source Surface:** Commercial Control Tower  

---

## Purpose

This doctrine defines the canonical law for a governed command-first operating surface.

## Scope

This doctrine governs command ingress, command execution, replay validity, ghost promotion, doctrine visibility, focus sovereignty, and observability for workstation-grade control tower interfaces.

---

## Law 1 — Command Registry Sovereignty

All live command execution shall route through the canonical command registry.  
No live execution path may bypass the canonical registry.

## Law 2 — Command Identity

Command ids shall be immutable, lowercase, dotted, and category-prefixed.  
Display labels may change. Canonical ids may not.

## Law 3 — Handler Isolation

Components shall not directly invoke workflows, kernels, platform clients, or mutation-capable domain actions.  
All domain-affecting actions shall route through typed command handlers.

## Law 4 — Context Resolution

Command context shall be resolved deterministically from active pane, selected object, active evidence target, active ghost target, and active lineage target.  
Handlers shall not infer context inconsistently.

## Law 5 — Replay Validity

Commands invalid in replay mode shall be blocked in execution logic.  
UI disablement alone is insufficient.

## Law 6 — Ghost Non-Solidity

Ghost state is advisory and non-solid.  
`ghost.promote` is the only valid solidification route.

## Law 7 — Doctrine Read-Only Posture

Doctrine surfaces shall be frozen, read-only, and non-mutating.  
No doctrine surface may contain a write path.

## Law 8 — Disabled Command Blocking

Disabled commands shall not execute.  
Where context invalidates a command, an explanatory reason shall be available.

## Law 9 — Focus Sovereignty

Operator focus remains primary.  
Advisory systems may not seize focus through command execution.

## Law 10 — VKBUS Observability

Observable command actions shall emit or reference the appropriate VKBUS signal posture.

## Law 11 — Portability

This pattern may be reused across Domain OS repos without collapsing domain sovereignty, truth ownership, or trust-boundary enforcement.

---

## Implementation Anchors

| Anchor | Location |
|--------|----------|
| Canonical Registry | `src/lib/command/registry.ts` |
| Typed Handlers | `src/lib/command/handlers/` |
| Context Resolver | `src/lib/command/contextResolver.ts` |
| Mode Conflict Rules | `src/lib/command/modeConflicts.ts` |
| Doctrine Pane | `src/components/doctrine/DoctrinePane.tsx` |
| Replay Mode | `src/lib/replay/replayModeStore.ts` |
| Ghost Transitions | `src/lib/ghost/ghostTransitions.ts` |
| VKBUS Client | `src/lib/vkbus/vkbusClient.ts` |
| Operator Focus Store | `src/lib/focus/operatorFocusStore.ts` |

## Verification Evidence

| Law | Verification Method |
|-----|-------------------|
| Registry Sovereignty | `grep -rn "from.*registry" src/` — all execution imports canonical registry |
| Handler Isolation | `grep -R "from '@10-bla/workflows'" src/components` — zero results |
| Replay Blocking | `isCommandEnabled()` checks `replay_valid` before handler invocation |
| Ghost Non-Solidity | `grep -R "setState\|updateMatter\|save" src/components/ghost` — zero results |
| Doctrine Read-Only | DoctrineStore uses `Object.freeze()`, DoctrinePane has zero write paths |
| Focus Sovereignty | `OperatorFocusStore` rejects non-operator focus requests for PRIMARY_ACTIVE |
| VKBUS Observability | `ghost.promote` calls `vkbusClient.promoteGhost()`, 12 signal types registered |

---

## Change Control

This doctrine is frozen at v1.  
Any modification requires an explicit superseding version.  
See: `CHANGE-CONTROL-COMMAND-FIRST-OPERATING-SURFACE-v1.md`
