# Contract-Review-Worker

Processes contract review requests.

## Purpose

Receives contracts for review, extracts obligations, assesses risks through the Law Kernel, routes financial assessment to the Accounting Kernel, and routes business impact to the Business Kernel. Produces a ContractReviewPacket as output.

## Behavior

- Receives contract documents for review
- Extracts obligation clauses and terms
- Routes legal risk assessment to Law Kernel
- Routes financial assessment to Accounting Kernel
- Routes business impact assessment to Business Kernel
- Assembles and produces ContractReviewPacket
- Emits domain receipts for all review operations
