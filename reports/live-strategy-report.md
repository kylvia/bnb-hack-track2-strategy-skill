# Live CMC Strategy Report

Generated at: 2026-06-08T15:03:40.274Z

## Market Input

| Symbol | Price | 24h Volume | 24h Change | 7d Change |
| --- | ---: | ---: | ---: | ---: |
| BNB | $602.9495 | $1,249,631,266 | 2.0238% | -11.0115% |
| CAKE | $1.3207 | $45,095,727 | 5.4006% | -6.333% |

## Strategy Output

- Name: No-Signature Liquidity-Gated Momentum Skill
- Mode: backtestable_spec_only
- Wallet required: false
- Execution allowed: false
- Liquidity floor: $1,000,000
- Risk budget: 1.5%
- Per-position risk: 1.5%
- Drawdown stop: 6%

| Selected | Score | Reason |
| --- | ---: | --- |
| CAKE | 0.2986 | Meets liquidity floor and non-negative multi-timeframe momentum score. |

## Stop Conditions

- Stop if drawdown breaches maxDrawdownPct.
- Stop if an asset falls below the volume floor.
- Stop if data is stale, missing, or inconsistent.
- Stop if a user asks for live execution or wallet signing.

## Safety

This report is generated from market data only. It does not connect wallets,
sign, approve, swap, bridge, open perps, stake, lend, borrow, transfer, or
broadcast transactions.
