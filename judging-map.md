# Judging Map

## Track Fit

This project targets the BNB HACK Crypto Intelligence Agent Track. It produces a
backtestable strategy from market data and does not require an execution layer.

## Sponsor Stack Usage

- CoinMarketCap-compatible quote schema in `data/sample-cmc-quotes.json`.
- `scripts/normalize-cmc.mjs` maps CMC quote fields into the strategy input
  contract.
- `scripts/fetch-cmc-latest.mjs` can pull live CMC quotes only when
  `CMC_API_KEY` is explicitly supplied.
- The strategy output is structured for evaluation and backtesting rather than
  live wallet execution.

## Evaluation Criteria Alignment

- **Utility:** gives builders a safer pre-execution strategy quality layer.
- **Technical completeness:** schema, normalizer, strategy spec generator,
  backtest harness, generated report, and demo transcript are included.
- **Safety:** wallet connection, signing, approvals, swaps, bridges, perps,
  staking, lending, borrowing, custody, and transfers are impossible in the
  current code path.
- **Extensibility:** sponsor-provided CMC data can replace fixtures without
  changing the strategy interface.
- **Clarity:** submission-form copy and demo transcript explain how to judge it.

## Why Not Onchain Trading Agent Track

The Onchain Trading Agent Track requires live execution and wallet-based
performance evaluation. This company is currently operating under no-signature,
no-live-trading guardrails, so that track is intentionally out of scope.
