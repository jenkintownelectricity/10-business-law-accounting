# Transcript-Normalization-Worker

Normalizes raw transcripts into structured, reviewable format.

## Purpose

Cleans transcript text, segments by speaker, assigns timestamps, evaluates completeness constraints, routes through language normalization, and produces structured transcripts for review.

## Behavior

- Cleans raw transcript text (removes filler, corrects obvious errors)
- Segments transcript by speaker
- Assigns timestamps to segments
- Evaluates completeness constraints
- Routes through language normalization pipeline
- Produces structured transcript for review
- Emits domain receipts for all normalization operations
