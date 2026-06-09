# Demo Transcript

Generated at: 2026-06-09T13:59:27.784Z

## 1. Normalize CMC-Compatible Quotes

```bash
node scripts/normalize-cmc.mjs data/sample-cmc-quotes.json
```

```json
{
  "market": [
    {
      "symbol": "BNB",
      "priceUsd": 612.4,
      "volume24hUsd": 1420000000,
      "change1hPct": 0.4,
      "change24hPct": 2.8,
      "change7dPct": 8.1,
      "marketCapUsd": 94100000000
    },
    {
      "symbol": "CAKE",
      "priceUsd": 2.34,
      "volume24hUsd": 88000000,
      "change1hPct": -0.2,
      "change24hPct": 3.7,
      "change7dPct": 11.9,
      "marketCapUsd": 700000000
    },
    {
      "symbol": "LOWVOL",
      "priceUsd": 0.08,
      "volume24hUsd": 42000,
      "change1hPct": 12.2,
      "change24hPct": 31,
      "change7dPct": 45,
      "marketCapUsd": 12000000
    }
  ],
  "constraints": {
    "maxPositions": 2,
    "riskBudgetPct": 1.5,
    "minVolume24hUsd": 1000000,
    "maxDrawdownPct": 6
  }
}
```

## 2. Generate Strategy Spec

```bash
node run.mjs sample-market-data.json
```

```json
{
  "name": "No-Signature Liquidity-Gated Momentum Skill",
  "mode": "backtestable_spec_only",
  "walletRequired": false,
  "executionAllowed": false,
  "universe": {
    "minVolume24hUsd": 1000000,
    "minSignalScore": 0,
    "excludedReason": "Assets below liquidity floor, below signal threshold, or with overheating one-hour moves are excluded."
  },
  "selectedAssets": [
    {
      "symbol": "CAKE",
      "score": 5.79,
      "reason": "Meets liquidity floor and non-negative multi-timeframe momentum score."
    },
    {
      "symbol": "BNB",
      "score": 4.175,
      "reason": "Meets liquidity floor and non-negative multi-timeframe momentum score."
    }
  ],
  "rules": [
    "Rank assets by 1h/24h/7d momentum blend.",
    "Exclude assets below the configured 24h volume floor.",
    "Reduce or skip assets with abrupt 1h spikes above 8%.",
    "Exclude assets below the configured signal threshold.",
    "Hold only the top ranked assets up to maxPositions.",
    "Rebalance only on evaluation windows; never generate live orders."
  ],
  "risk": {
    "totalRiskBudgetPct": 1.5,
    "perPositionRiskPct": 0.75,
    "maxDrawdownStopPct": 6,
    "stopConditions": [
      "Stop if drawdown breaches maxDrawdownPct.",
      "Stop if an asset falls below the volume floor.",
      "Stop if data is stale, missing, or inconsistent.",
      "Stop if a user asks for live execution or wa
...
```

## 3. Run Backtest Harness

```bash
node scripts/backtest.mjs data/sample-historical-snapshots.json reports/sample-backtest-report.md
```

```json
{
  "totalReturnPct": 11.2723,
  "maxDrawdownPct": -2.5482,
  "hitRatePct": 85.7143,
  "liquidityRejectCount": 8,
  "periods": 7
}
```

## Safety Assertion

- Wallet required: false
- Execution allowed: false
- Live trading: false
- Transaction generation: false
- External submission: false
