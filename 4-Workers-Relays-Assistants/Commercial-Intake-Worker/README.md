# Commercial-Intake-Worker

Handles incoming commercial matters from all sources (manual, voice, API).

## Purpose

Processes intake requests by validating matter data, evaluating intake constraints, routing to appropriate kernel(s), and creating matter records in INTAKE status. Handles both manual and voice-originated intake (voice intake always goes through review queue).

## Behavior

- Validates all incoming matter data against domain constraints
- Evaluates intake constraints before accepting a matter
- Routes matters to appropriate kernels (Business, Law, Accounting)
- Creates matter records with INTAKE status
- Voice-originated intake is always flagged for review queue
- Emits domain receipts for all intake operations
