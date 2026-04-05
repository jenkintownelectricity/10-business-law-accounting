# VKBUS Signal Flow Evidence

## Commercial Control Tower — Signal Flow Verification

**Date verified:** 2026-04-05

---

## Architecture Rule

> Every UI action that affects domain state routes through `vkbusClient`.
> The CCT **never** imports workflow executors, kernel internals, or platform mutation clients directly.

## VKBUS Client

**Path:** `src/lib/vkbus/vkbusClient.ts`

The VkbusClient class is the sole channel for domain-affecting actions from the CCT. It:
- Emits typed signals to VKBUS
- Validates signals before emission
- Logs all emitted signals
- Returns receipts for correlation

## CCT Signal Types

All signal types defined in `src/lib/vkbus/signalTypeMap.ts`:

| Constant | Signal Type | Description |
|----------|-------------|-------------|
| UI_INTENT | `cct.ui.intent` | Generic UI intent signal |
| GHOST_PROMOTE | `cct.ghost.promote` | Promote ghost proposal to domain action |
| GHOST_DISMISS | `cct.ghost.dismiss` | Dismiss ghost proposal (UI lifecycle only) |
| FOCUS_CHANGE | `cct.focus.change` | Operator focus change (observational) |
| REVIEW_REQUEST | `cct.review.request` | Request review of entity |
| SEARCH_QUERY | `cct.search.query` | Search query emission |
| MATTER_CREATE | `cct.matter.create` | Create new matter |
| CONTRACT_REVIEW | `cct.contract.review` | Request contract review |
| INVOICE_PROCESS | `cct.invoice.process` | Process invoice |
| OBLIGATION_TRACK | `cct.obligation.track` | Track obligation |
| DICTATION_START | `cct.dictation.start` | Start dictation session |
| LISTENING_START | `cct.listening.start` | Start listening session |

## Signal Flow Architecture

```
Operator Action (UI)
    |
    v
vkbusClient.emit(signal)
    |
    v
Signal Validation (signalValidators.ts)
    |
    v
VKBUS Signal Bus
    |
    v
Execution Spine Routing (route.cct.*.ts)
    |
    v
Constraint Evaluation
    |
    v
Kernel / Orchestrator
    |
    v
Receipt Emission
    |
    v
CCT Receipt Display
```

## Supporting Modules

| Module | Path | Purpose |
|--------|------|---------|
| Signal Type Map | `src/lib/vkbus/signalTypeMap.ts` | Enumeration of all CCT signal types |
| Signal Factory | `src/lib/vkbus/signalFactory.ts` | Factory functions for typed signal creation |
| Signal Validators | `src/lib/vkbus/signalValidators.ts` | Payload validation per signal type |
| Signal Receipts | `src/lib/vkbus/signalReceipts.ts` | Receipt tracking and correlation |

## Proof: No Direct Workflow/Kernel Imports

```bash
grep -R "from '@10-bla/workflows'" src/components
```

**Expected result:** No output. UI components must not import workflow executors.

```bash
grep -R "from 'execution-spine'" src/components
```

**Expected result:** No output. UI components must not import execution spine routes.

```bash
grep -R "from '.*Business-Kernel/src\|from '.*Law-Kernel/src\|from '.*Accounting-Kernel/src'" src/components
```

**Expected result:** No output. UI components must not import kernel internals.

```bash
grep -R "runWorkflow\|executeWorkflow\|invokeKernel" src/components
```

**Expected result:** No output. UI components must not call these functions.

## Enforcement

Import boundary rules are codified in `src/lib/boundaries/forbiddenImports.ts` and validated by tests and CI.
