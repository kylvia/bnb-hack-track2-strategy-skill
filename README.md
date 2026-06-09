# BNB HACK Crypto Intelligence Agent Prototype

![No-Signature Liquidity-Gated Momentum Skill](assets/buidl-logo.png)

This is a no-signature, no-live-trading prototype for a CMC-style strategy skill.
It produces a backtestable strategy specification from market snapshots and risk
constraints. It never connects a wallet, signs, broadcasts, swaps, bridges, or
uses real funds.

DoraHacks BUIDL: https://dorahacks.io/buidl/44535

## Why This Bet

The Crypto Intelligence Agent Track rewards market-intelligence and
strategy-quality outputs that can be evaluated without live execution. That
matches the company guardrails better than the onchain trading track.

## Files

- `skill.schema.json`: input and output contract.
- `sample-market-data.json`: toy market snapshots for local dry runs.
- `run.mjs`: deterministic strategy-spec generator.
- `data/sample-cmc-quotes.json`: CMC-compatible quote payload fixture.
- `data/sample-historical-snapshots.json`: multi-day sample snapshots for backtesting.
- `scripts/normalize-cmc.mjs`: CMC quote normalizer.
- `scripts/fetch-cmc-latest.mjs`: optional live CMC quotes fetcher using `CMC_API_KEY`.
- `scripts/live-report.mjs`: live normalized quote to strategy report writer.
- `scripts/backtest.mjs`: deterministic sample backtest harness.
- `reports/sample-backtest-report.md`: generated sample backtest report.
- `reports/demo-output.json`: generated all-in-one demo output.
- `reports/demo-transcript.md`: generated judge-facing transcript.
- `submission-brief.md`: concise project narrative and monetization angle.
- `submission-form-draft.md`: form-ready draft for owner-approved submission.
- `judging-map.md`: track and sponsor alignment.
- `submission-checklist.md`: final gate checklist.

## Dry Run

```bash
node run.mjs sample-market-data.json
```

Normalize a CMC-compatible quote payload:

```bash
node scripts/normalize-cmc.mjs data/sample-cmc-quotes.json
```

Optional live CMC quote pull after explicitly setting an API key:

```bash
CMC_API_KEY=... node scripts/fetch-cmc-latest.mjs 1839,7186 USD
```

Generate a live strategy report after fetching:

```bash
node scripts/live-report.mjs reports/live-cmc-normalized.json reports/live-strategy-report.md
```

Run the sample backtest:

```bash
mkdir -p reports
node scripts/backtest.mjs data/sample-historical-snapshots.json reports/sample-backtest-report.md
```

Generate all demo artifacts:

```bash
node scripts/demo.mjs
```

The output is JSON containing:

- universe filter
- signal rules
- risk gates
- position sizing
- stop conditions
- evaluation metrics

## Guardrails

- No wallet connection.
- No account login.
- No transaction generation.
- No private keys, seed phrases, signatures, approvals, or custody.
- No financial advice; this is a strategy-spec and research prototype only.
