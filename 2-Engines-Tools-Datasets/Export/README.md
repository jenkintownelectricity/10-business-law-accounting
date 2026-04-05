# Export Packet Generation System

This module provides typed export generators for producing practitioner-ready review packets, decision bundles, receipt compilations, and session transcripts.

## Purpose

Every significant commercial object and workflow in the domain can be exported as a structured, print-ready packet. These exports serve practitioners who need to review, share, archive, or present commercial information outside the live system.

## Available Export Generators

| Generator | Output | Description |
|---|---|---|
| `matterReviewPacket` | Matter review packet | Complete matter with kernel assessments, constraints, evidence, timeline, and follow-up actions |
| `contractReviewPacket` | Contract review packet | Contract details, parties, obligations, risks, financial impact, legal assessment, recommendations |
| `commercialDecisionPacket` | Decision bundle export | All kernel assessments, combined recommendation, risks, constraints, action items, provenance chain |
| `receiptPacket` | Receipt compilation | All receipts for a given entity/matter, organized chronologically |
| `listeningSessionPacket` | Listening session export | Transcript, extracted candidates, advisory packets, routing hints, review status |
| `transcriptReviewPacket` | Transcript export | Full transcript with speaker attribution, normalization notes, linked matters, review status |

## Shared Utilities

`packetFormatter` provides shared formatting functions used by all generators:

- Header generation with domain branding
- Section formatting with consistent structure
- Timestamp formatting (ISO 8601 and human-readable)
- Provenance display with kernel attribution
- Print-ready layout helpers

## Architecture

All export generators consume typed domain objects and produce structured output packets. Generators never evaluate domain truth -- they render existing assessments and records into portable formats.

```
Domain Objects + Kernel Assessments
        |
        v
  Export Generator (e.g., matterReviewPacket)
        |
        v
  packetFormatter (shared formatting)
        |
        v
  Typed Export Packet (print-ready)
```

## Usage

```typescript
import { generateMatterReviewPacket } from './src/matterReviewPacket';
import { generateContractReviewPacket } from './src/contractReviewPacket';

const matterPacket = generateMatterReviewPacket(matterId);
const contractPacket = generateContractReviewPacket(contractId);
```
