import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

function asList(data) {
  if (Array.isArray(data)) return data;
  return Object.values(data);
}

function findUsdQuote(asset) {
  if (Array.isArray(asset.quote)) {
    return asset.quote.find((quote) => quote.symbol === "USD" || quote.id === 2781) ?? asset.quote[0] ?? {};
  }
  return asset.quote?.USD ?? {};
}

function finiteNumber(value, label, symbol) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    throw new Error(`Invalid ${label} for ${symbol ?? "unknown asset"}`);
  }
  return number;
}

function normalizeAsset(asset) {
  const quote = findUsdQuote(asset);
  return {
    symbol: asset.symbol,
    priceUsd: finiteNumber(quote.price, "price", asset.symbol),
    volume24hUsd: finiteNumber(quote.volume_24h, "volume_24h", asset.symbol),
    change1hPct: finiteNumber(quote.percent_change_1h, "percent_change_1h", asset.symbol),
    change24hPct: finiteNumber(quote.percent_change_24h, "percent_change_24h", asset.symbol),
    change7dPct: finiteNumber(quote.percent_change_7d, "percent_change_7d", asset.symbol),
    marketCapUsd: finiteNumber(quote.market_cap, "market_cap", asset.symbol)
  };
}

export function normalizeCmcQuotes(payload, constraints) {
  return {
    market: asList(payload.data).map(normalizeAsset),
    constraints
  };
}

const isCli = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (isCli) {
  const inputPath = process.argv[2] ?? "data/sample-cmc-quotes.json";
  const constraints = {
    maxPositions: 2,
    riskBudgetPct: 1.5,
    minVolume24hUsd: 1_000_000,
    maxDrawdownPct: 6,
    minSignalScore: 0
  };
  const payload = JSON.parse(readFileSync(inputPath, "utf8"));
  console.log(JSON.stringify(normalizeCmcQuotes(payload, constraints), null, 2));
}
