# Iron-Ear-Listening-Worker

Processes Iron Ear listening sessions. Advisory output only.

## Purpose

Manages listening session lifecycle. Extracts obligation candidates, deadline candidates, and routing hints. Creates advisory packets. All outputs require practitioner review before becoming domain truth.

## Behavior

- Manages listening session lifecycle (start, process, complete)
- Extracts obligation candidates from session content
- Extracts deadline candidates from session content
- Produces routing hints for matter assignment
- Creates advisory packets with confidence scores
- All outputs are advisory only and require practitioner review
- Emits domain receipts for all listening session operations
