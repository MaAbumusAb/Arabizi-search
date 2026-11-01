# Arabic Phonetic & Arabizi Search PoC

A deliberately small, browser-based proof of concept for searching a local Arabic vocabulary dataset using Romanized Arabic and Arabizi.

## Run locally

This app uses `fetch()` to load its JSON dataset, so run it through a local HTTP server rather than opening `index.html` directly.

### Python
```bash
python -m http.server 8000
```
Then open: http://localhost:8000

No external network calls, backend, account, or package installation is required. Once the project files are on the device, the application runs locally.

## Files

- `index.html`, `style.css`, `app.js`: interface and search.
- `engine/transliteration.js`: simple deterministic candidate generator.
- `data/arabizi_dataset.json`: starter dictionary dataset (109 illustrative entries).
- `research/arabizi_dataset.csv`: spreadsheet-friendly dataset.
- `research/test_cases.csv`: starter evaluation inputs.

## Search behaviour

The prototype:
1. Normalizes case, whitespace and some repeated letters.
2. Checks exact Arabic and Romanized/Arabizi variants in the dataset.
3. Generates possible Arabic-script candidates using a small mapping table.
4. Matches generated candidates against Arabic entries.
5. Ranks exact variants above generated suggestions.

## Important limitations

- Arabizi is not standardized. Number and letter conventions vary by country, dialect and individual.
- The transliteration mappings are heuristic and can be ambiguous.
- This starter dataset is illustrative, not a validated linguistic corpus. Entries and spellings are marked `unverified`.
- Some example forms may be dialect-specific, uncommon, or need correction. Obtain review from fluent Arabic speakers before using the dataset as a research benchmark or product resource.
- The engine does not understand sentence context, morphology, dialect reliably, or guarantee a correct transliteration.
- No claims about production-level accuracy are made.

## Next research steps

1. Have fluent speakers review every Arabic entry, spelling variant and meaning.
2. Record dialect/region for dialect-specific variants.
3. Create a held-out test set that is not used to build the dataset.
4. Manually label acceptable outputs for ambiguous inputs.
5. Measure top-1 accuracy, top-5 recall, false positives and response time.
6. Only then consider integration with an existing dictionary search API.

## Mapping notes

The initial rule set includes common conventions such as `7 → ح`, `3 → ع`, `5 → خ`, `2 → ء/أ`, `sh → ش`, `kh → خ`, and `gh → غ`. These are candidate-generation hints, not universal rules.
