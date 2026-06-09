import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { buildStrategySpec } from "../run.mjs";

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function fmt(value, digits = 4) {
  return Number(value).toLocaleString("en-US", {
    maximumFractionDigits: digits
  });
}

const inputPath = process.argv[2] ?? "reports/live-cmc-normalized.json";
const outputPath = process.argv[3] ?? "reports/live-strategy-report.md";
const input = readJson(inputPath);
const spec = buildStrategySpec(input);

mkdirSync("reports", { recursive: true });
writeFileSync("reports/live-strategy-spec.json", JSON.stringify(spec, null, 2));

const marketRows = input.market
  .map((asset) => `| ${asset.symbol} | $${fmt(asset.priceUsd)} | $${fmt(asset.volume24hUsd, 0)} | ${fmt(asset.change24hPct)}% | ${fmt(asset.change7dPct)}% |`)
  .join("\n");

const selectedRows = spec.selectedAssets
  .map((asset) => `| ${asset.symbol} | ${asset.score} | ${asset.reason} |`)
  .join("\n");

const report = `# Live CMC Strategy Report

Generated at: ${new Date().toISOString()}

## Market Input

| Symbol | Price | 24h Volume | 24h Change | 7d Change |
| --- | ---: | ---: | ---: | ---: |
${marketRows}

## Strategy Output

- Name: ${spec.name}
- Mode: ${spec.mode}
- Wallet required: ${spec.walletRequired}
- Execution allowed: ${spec.executionAllowed}
- Liquidity floor: $${fmt(spec.universe.minVolume24hUsd, 0)}
- Risk budget: ${spec.risk.totalRiskBudgetPct}%
- Per-position risk: ${spec.risk.perPositionRiskPct}%
- Drawdown stop: ${spec.risk.maxDrawdownStopPct}%

| Selected | Score | Reason |
| --- | ---: | --- |
${selectedRows}

## Stop Conditions

${spec.risk.stopConditions.map((item) => `- ${item}`).join("\n")}

## Safety

This report is generated from market data only. It does not connect wallets,
sign, approve, swap, bridge, open perps, stake, lend, borrow, transfer, or
broadcast transactions.
`;

writeFileSync(outputPath, report);
console.log(JSON.stringify({
  wrote: [outputPath, "reports/live-strategy-spec.json"],
  selectedAssets: spec.selectedAssets.map((asset) => asset.symbol),
  walletRequired: spec.walletRequired,
  executionAllowed: spec.executionAllowed
}, null, 2));

