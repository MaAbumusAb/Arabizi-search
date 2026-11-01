# Initial Dataset and Evaluation Notes

## Dataset snapshot
- Entries: 109
- Fields: Arabic headword, Romanized variants, Arabizi variants, English glosses, category, dialect note, ambiguity flag, notes, source and verification status.
- Verification: all starter entries are marked `unverified`.

## Important distinction
This is a seed dataset for engineering experimentation, not a representative corpus of Arabic or Arabizi usage. It mixes broadly understandable vocabulary with forms that may be dialect-specific. A native-speaker review is required.

## Suggested evaluation protocol
- Keep test cases separate from the dictionary entries where possible.
- Ask at least two fluent speakers to independently verify expected Arabic spellings and meanings.
- Record accepted alternatives for ambiguous romanizations rather than forcing one answer.
- Report top-1 accuracy, top-5 recall, unmatched rate, false-positive rate and median/p95 latency.
- Do not report accuracy until the test labels have been reviewed.

## Starter test set
See `test_cases.csv`. The expected outputs are provisional and require manual verification.
