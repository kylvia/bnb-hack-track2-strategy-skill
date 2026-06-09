# Submission Brief

## Project

No-Signature Liquidity-Gated Momentum Skill

## Problem

Most trading-agent demos jump straight to wallet execution. That is risky for
new users and difficult to evaluate safely. Track 2 can instead reward strategy
quality: the ability to express a clear, testable strategy with data
requirements, risk gates, and stop conditions.

## Solution

This skill converts market snapshots into a backtestable strategy specification:

- liquidity floor
- momentum ranking
- overheating rejection
- position-count cap
- risk budget
- drawdown stop
- no-execution guardrail

## Why It Can Make Money

Primary path: prize/grant submission for strategy-skill tracks.

Secondary path: package the generator as a due-diligence/report tool for Web3
operators who want strategy ideas without delegating wallet execution.

## Current Scope

The prototype now includes:

- a CMC-compatible quote normalizer
- a deterministic strategy-spec generator
- a sample multi-day backtest harness
- a generated sample report

A production submission can wire in approved CoinMarketCap or sponsor-provided
data later, still without wallet execution.

## Non-Goals

- No live trading.
- No wallet signing.
- No token approvals.
- No swap, bridge, perp, staking, lending, or borrowing.
- No promise of profit.
