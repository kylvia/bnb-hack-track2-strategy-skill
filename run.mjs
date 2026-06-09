import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

function loadInput(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

export function scoreAsset(asset) {
  const momentum = asset.change24hPct * 0.45 + asset.change7dPct * 0.35 + asset.change1hPct * 0.2;
  const liquidityPenalty = asset.volume24hUsd < 1_000_000 ? 100 : 0;
  const overheatingPenalty = asset.change1hPct > 8 ? 25 : 0;
  return momentum - liquidityPenalty - overheatingPenalty;
}

export function buildStrategySpec(input) {
  const { market, constraints } = input;
  const minSignalScore = constraints.minSignalScore ?? 0;
  const eligible = market
    .filter((asset) => asset.volume24hUsd >= constraints.minVolume24hUsd)
    .map((asset) => ({ ...asset, signalScore: Number(scoreAsset(asset).toFixed(4)) }))
    .filter((asset) => asset.signalScore >= minSignalScore)
    .sort((a, b) => b.signalScore - a.signalScore)
    .slice(0, constraints.maxPositions);

  const perPositionRiskPct = Number((constraints.riskBudgetPct / Math.max(eligible.length, 1)).toFixed(4));

  return {
    name: "No-Signature Liquidity-Gated Momentum Skill",
    mode: "backtestable_spec_only",
    walletRequired: false,
    executionAllowed: false,
    universe: {
      minVolume24hUsd: constraints.minVolume24hUsd,
      minSignalScore,
      excludedReason: "Assets below liquidity floor, below signal threshold, or with overheating one-hour moves are excluded."
    },
    selectedAssets: eligible.map((asset) => ({
      symbol: asset.symbol,
      score: asset.signalScore,
      reason: "Meets liquidity floor and non-negative multi-timeframe momentum score."
    })),
    rules: [
      "Rank assets by 1h/24h/7d momentum blend.",
      "Exclude assets below the configured 24h volume floor.",
      "Reduce or skip assets with abrupt 1h spikes above 8%.",
      "Exclude assets below the configured signal threshold.",
      "Hold only the top ranked assets up to maxPositions.",
      "Rebalance only on evaluation windows; never generate live orders."
    ],
    risk: {
      totalRiskBudgetPct: constraints.riskBudgetPct,
      perPositionRiskPct,
      maxDrawdownStopPct: constraints.maxDrawdownPct,
      stopConditions: [
        "Stop if drawdown breaches maxDrawdownPct.",
        "Stop if an asset falls below the volume floor.",
        "Stop if data is stale, missing, or inconsistent.",
        "Stop if a user asks for live execution or wallet signing."
      ]
    },
    evaluation: {
      metrics: ["return_pct", "max_drawdown_pct", "turnover", "hit_rate", "liquidity_reject_count"],
      requiredData: ["timestamp", "symbol", "priceUsd", "volume24hUsd", "change1hPct", "change24hPct", "change7dPct"]
    }
  };
}

const isCli = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (isCli) {
  const inputPath = process.argv[2] ?? "sample-market-data.json";
  const spec = buildStrategySpec(loadInput(inputPath));
  console.log(JSON.stringify(spec, null, 2));
}
