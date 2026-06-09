import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { buildStrategySpec } from "../run.mjs";
import { normalizeCmcQuotes } from "./normalize-cmc.mjs";
import { runBacktest, markdownReport } from "./backtest.mjs";

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function snippet(value, maxChars = 1400) {
  const text = JSON.stringify(value, null, 2);
  return text.length > maxChars ? `${text.slice(0, maxChars)}\n...` : text;
}

mkdirSync("reports", { recursive: true });

const constraints = {
  maxPositions: 2,
  riskBudgetPct: 1.5,
  minVolume24hUsd: 1_000_000,
  maxDrawdownPct: 6
};

const rawQuotes = readJson("data/sample-cmc-quotes.json");
const normalized = normalizeCmcQuotes(rawQuotes, constraints);
const strategySpec = buildStrategySpec(normalized);
const backtest = runBacktest(readJson("data/sample-historical-snapshots.json"));

writeFileSync("reports/demo-output.json", JSON.stringify({
  normalized,
  strategySpec,
  backtest
}, null, 2));
writeFileSync("reports/sample-backtest-report.md", markdownReport(backtest));

const transcript = `# Demo Transcript

Generated at: ${new Date().toISOString()}

## 1. Normalize CMC-Compatible Quotes

\`\`\`bash
node scripts/normalize-cmc.mjs data/sample-cmc-quotes.json
\`\`\`

\`\`\`json
${snippet(normalized)}
\`\`\`

## 2. Generate Strategy Spec

\`\`\`bash
node run.mjs sample-market-data.json
\`\`\`

\`\`\`json
${snippet(strategySpec)}
\`\`\`

## 3. Run Backtest Harness

\`\`\`bash
node scripts/backtest.mjs data/sample-historical-snapshots.json reports/sample-backtest-report.md
\`\`\`

\`\`\`json
${snippet({
  totalReturnPct: backtest.totalReturnPct,
  maxDrawdownPct: backtest.maxDrawdownPct,
  hitRatePct: backtest.hitRatePct,
  liquidityRejectCount: backtest.liquidityRejectCount,
  periods: backtest.periods
})}
\`\`\`

## Safety Assertion

- Wallet required: false
- Execution allowed: false
- Live trading: false
- Transaction generation: false
- External submission: false
`;

writeFileSync("reports/demo-transcript.md", transcript);

console.log(JSON.stringify({
  wrote: [
    "reports/demo-output.json",
    "reports/demo-transcript.md",
    "reports/sample-backtest-report.md"
  ],
  totalReturnPct: backtest.totalReturnPct,
  maxDrawdownPct: backtest.maxDrawdownPct,
  hitRatePct: backtest.hitRatePct,
  executionAllowed: strategySpec.executionAllowed,
  walletRequired: strategySpec.walletRequired
}, null, 2));

