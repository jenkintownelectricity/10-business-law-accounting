# Language Normalization Policy

**Domain:** Business Law Accounting (10-business-law-accounting)
**Version:** 1.0.0
**Effective:** 2026-04-05

---

## Core Principle

**Language normalization outputs are assistive.** Terminology alignment, phrase disambiguation, and semantic interpretation are suggestions. They do not directly classify or approve domain objects.

## Scope

The Language Intelligence Layer provides three normalization services:

### 1. Terminology Alignment

Maps colloquial, informal, or ambiguous terms to domain-specific terminology.

**Examples:**
| Input | Suggested Alignment | Target Kernel |
|---|---|---|
| "the deal" | Contract, Agreement, or Transaction | Law / Business |
| "what we owe" | Obligation, Payable, or Liability | Law / Accounting |
| "the other side" | Counterparty, Opposing Party | Law / Business |
| "tax stuff" | Tax Posture, Tax Treatment, Tax Filing | Accounting |
| "the deadline" | Obligation Due Date, Filing Deadline, Statute of Limitations | Law / Accounting |

All alignments are suggestions. The practitioner or receiving kernel determines the correct domain term.

### 2. Phrase Disambiguation

Resolves phrases that could apply to multiple kernels or have multiple domain meanings.

**Examples:**
| Phrase | Possible Interpretations |
|---|---|
| "We need to close this" | Close a matter (Business), Execute a contract (Law), Close the books (Accounting) |
| "Review the numbers" | Financial review (Accounting), Contract value review (Law), Business metrics (Business) |
| "File it" | File a legal document (Law), File a tax return (Accounting), File in records (Business) |

Disambiguation produces routing hints, not authoritative classifications.

### 3. Semantic Interpretation

Interprets complex or compound statements into structured components.

**Example:**
- Input: "Tell Smith we'll accept the revised terms if they fix the payment schedule and add the indemnification clause by Friday."
- Components:
  - Communication action: contact Smith (Business)
  - Contract term acceptance: conditional (Law)
  - Payment schedule revision: financial impact (Accounting / Law)
  - Indemnification clause: legal obligation (Law)
  - Deadline: Friday (Law / Business)

## Trust Level

All language normalization outputs carry `trust_level: 'advisory'`. This means:

- They may inform routing decisions within the orchestrator.
- They may assist practitioners in classification.
- They must **not** directly create or modify domain records.
- They must **not** be treated as authoritative kernel assessments.
- They must **not** override explicit practitioner classifications.

## Integration with Voice Intake

When language normalization is applied to voice intake (spoken notes, meeting transcripts), the normalization output is attached to the candidate envelope as supplementary context. The normalization does not change the trust level of the voice intake itself.

## Feedback Loop

Practitioners may provide feedback on normalization quality:

- **Correct** — The suggestion matched the intended meaning.
- **Incorrect** — The suggestion did not match; practitioner provides the correct term.
- **Ambiguous** — The suggestion was reasonable but the context required a different interpretation.

This feedback is recorded for normalization quality tracking but does not create domain records.

---

**This policy ensures that language intelligence assists practitioners without usurping their judgment or creating unauthorized domain truth.**
