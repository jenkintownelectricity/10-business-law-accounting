# Change Control — Command-First Operating Surface v1

**Status:** FROZEN  
**Governs:** `COMMAND-FIRST-OPERATING-SURFACE-v1.md`  
**Authority:** L0_ARMAND_LEFEBVRE  
**Frozen At:** 2026-04-05  

---

## Scope

This document governs modifications to the Command-First Operating Surface doctrine (v1).

## Immutability Statement

The following elements are frozen at v1 and may not be modified without an explicit superseding version:

1. **Command IDs** — Canonical command identifiers are immutable. No command id may be renamed, re-prefixed, or aliased without creating a new versioned doctrine.

2. **Trust Laws** — Laws 1 through 11 define the canonical trust posture of the operating surface. No law may be weakened, removed, or silently reinterpreted.

3. **Replay Validity Rules** — The requirement that replay-invalid commands are blocked in execution logic (not only hidden in UI) is an invariant. It may not be downgraded to a UI-only concern.

4. **Ghost Non-Solidity Invariant** — The requirement that `ghost.promote` is the only solidification route is absolute. No auto-promotion, no implicit solidification, no silent state leakage from ghost to domain truth.

5. **Doctrine Read-Only Invariant** — Doctrine surfaces may not acquire write paths, mutation controls, edit buttons, or save actions under any version of v1.

6. **Focus Sovereignty Invariant** — Advisory systems may not seize operator focus. This invariant may not be relaxed under v1.

7. **Handler Isolation Invariant** — Components may not acquire direct workflow, kernel, or platform invocation paths. This boundary may not be bridged under v1.

## Modification Procedure

To modify any frozen element:

1. Draft a superseding version (v2, v3, etc.)
2. Identify which laws are modified and why
3. Submit for governance review under L0 authority
4. Freeze the new version explicitly
5. Archive the prior version without deletion

## Prohibited Actions

- Silent weakening of any law
- Implicit alias creation for command ids
- Removal of replay execution blocking
- Addition of write paths to doctrine surfaces
- Granting focus-seize capability to advisory systems
- Direct kernel invocation from UI components
- Modification of this change control document without superseding version

## Version History

| Version | Date | Status | Authority |
|---------|------|--------|-----------|
| v1 | 2026-04-05 | FROZEN | L0_ARMAND_LEFEBVRE |
