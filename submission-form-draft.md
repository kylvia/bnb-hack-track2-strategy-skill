# Submission Form Draft

Do not submit externally until the owner approves the final submission.

## Project Name

No-Signature Liquidity-Gated Momentum Skill

## One-Liner

A CoinMarketCap-compatible strategy skill that turns market data into a
backtestable, risk-gated trading specification without wallet execution.

## Problem

Live trading agents are risky to evaluate because they quickly cross into wallet
signing, approvals, swaps, perps, and real fund exposure. Builders need a safer
middle layer: strategy quality that can be inspected and backtested before any
execution path exists.

## Solution

The project provides a deterministic skill pipeline:

1. Normalize CMC-compatible market quote data.
2. Rank assets with a liquidity-gated multi-timeframe momentum score.
3. Reject low-liquidity and overheated assets.
4. Emit a backtestable strategy spec with explicit risk gates.
5. Run a sample backtest and generate a report.

## Sponsor Usage

The package includes a CMC-compatible quote fixture and a live-data fetch script
that uses `CMC_API_KEY` only when explicitly provided. It targets the
CoinMarketCap quotes/latest data shape and keeps execution disabled.

## What Is New

- CMC quote normalizer.
- No-signature strategy-spec generator.
- Historical snapshot backtest harness.
- Generated sample report with drawdown and losing period.
- Explicit stop condition for any wallet signing or live execution request.

## How To Run

```bash
node run.mjs sample-market-data.json
node scripts/normalize-cmc.mjs data/sample-cmc-quotes.json
node scripts/backtest.mjs data/sample-historical-snapshots.json reports/sample-backtest-report.md
```

Optional live quote pull, only after providing an API key:

```bash
CMC_API_KEY=... node scripts/fetch-cmc-latest.mjs 1839,7186 USD
```

## Safety Statement

This project never connects a wallet, signs, approves, swaps, bridges, opens a
perp, stakes, lends, borrows, transfers, or broadcasts a transaction. It is a
research and backtest artifact, not a profit promise.

## Monetization Path

Prize/grant submission first. If it gets traction, turn the same pipeline into a
paid strategy due-diligence/report product for teams that want research without
delegating wallet execution.
