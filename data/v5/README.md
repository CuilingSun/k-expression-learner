# V5 Dataset Pipeline

This folder contains the mixed-slim v5 dataset pipeline outputs.

## Files

- `candidate_expressions.json`
  - 360 canonical target expressions
  - skeleton metadata only
- `example_candidates.json`
  - candidate example pools per expression
  - existing v4 examples are pre-seeded here
- `expression_drafts.json`
  - 360 draft records
- the first 100 are verified production-ready entries
- the remaining 260 are seeded skeleton drafts with `review_flags`
- `korean_expression_dataset_v5_legacy_compat.json`
  - compatibility export for the current app import model
- `progress_report.json`
  - current candidate / draft / verified production counts

## Commands

Run from repo root:

```bash
npm run build:v5
npm run validate:v5
```

## Current State

- target canonical expressions: 360
- verified production-ready entries: 100
- remaining drafts to curate: 260

The final verified dataset lives at:

- `/Users/suncuiling/Desktop/k-expression-learner/korean_expression_dataset_v5_production_clean.json`
