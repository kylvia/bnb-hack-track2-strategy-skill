# No-Signature Liquidity-Gated Momentum Skill

This BUIDL is a no-signature strategy skill for BNB HACK Track 2. It turns CoinMarketCap-compatible market data into a deterministic, backtestable trading specification before any wallet execution path exists.

Most trading agents jump from signals to actions too quickly. That creates unnecessary risk around wallet signing, token approvals, swaps, bridges, perps, custody, and live fund exposure. This project keeps the agent in a safer research layer: it can read market data, rank opportunities, produce a strategy spec, and generate reports, but it cannot move funds.

## What it does

- Normalizes CoinMarketCap quote data.
- Ranks assets with a liquidity-gated multi-timeframe momentum score.
- Rejects low-liquidity and negative-signal assets.
- Emits a backtestable strategy spec with explicit risk gates.
- Generates human-readable reports.
- Includes sample fixtures, live CMC report output, and a backtest harness.

## Live CMC run

A live CoinMarketCap quote run was performed for BNB and CAKE using stable CMC ids. The strategy selected CAKE only because BNB failed the non-negative signal threshold.

## How to run

- `node scripts/demo.mjs`
- `node scripts/backtest.mjs data/sample-historical-snapshots.json reports/sample-backtest-report.md`
- `node scripts/normalize-cmc.mjs data/sample-cmc-quotes.json`
- `node run.mjs sample-market-data.json`
- `CMC_API_KEY=... node scripts/fetch-cmc-latest.mjs 1839,7186 USD > reports/live-cmc-normalized.json`
- `node scripts/live-report.mjs reports/live-cmc-normalized.json reports/live-strategy-report.md`

## Safety

This project is research and backtesting only. It never connects a wallet, signs messages, creates token approvals, swaps, bridges, opens perps, stakes, lends, borrows, transfers funds, or broadcasts transactions. It is not a profit guarantee or financial advice.
