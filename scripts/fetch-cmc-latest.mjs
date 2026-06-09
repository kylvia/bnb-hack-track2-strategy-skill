import { normalizeCmcQuotes } from "./normalize-cmc.mjs";
import https from "node:https";

const apiKey = process.env.CMC_API_KEY;
const assetSelector = process.argv[2] ?? "1839,7186";
const convert = process.argv[3] ?? "USD";

if (!apiKey) {
  console.error("Missing CMC_API_KEY. Refusing to fetch live data without an explicit API key.");
  process.exit(2);
}

const url = new URL("https://pro-api.coinmarketcap.com/v3/cryptocurrency/quotes/latest");
const selectorParam = /^(\d+,)*\d+$/.test(assetSelector) ? "id" : "symbol";
url.searchParams.set(selectorParam, assetSelector);
url.searchParams.set("convert", convert);

function requestJson(targetUrl, headers) {
  if (typeof fetch === "function") {
    return fetch(targetUrl, { headers }).then(async (response) => {
      const text = await response.text();
      return { ok: response.ok, status: response.status, text };
    });
  }

  return new Promise((resolve, reject) => {
    const request = https.get(targetUrl, { headers }, (response) => {
      const chunks = [];
      response.on("data", (chunk) => chunks.push(chunk));
      response.on("end", () => {
        resolve({
          ok: response.statusCode >= 200 && response.statusCode < 300,
          status: response.statusCode,
          text: Buffer.concat(chunks).toString("utf8")
        });
      });
    });
    request.on("error", reject);
  });
}

const response = await requestJson(url, {
  "X-CMC_PRO_API_KEY": apiKey,
  "Accept": "application/json"
});

if (!response.ok) {
  throw new Error(`CoinMarketCap request failed: ${response.status} ${response.text}`);
}

const payload = JSON.parse(response.text);
const constraints = {
  maxPositions: 2,
  riskBudgetPct: 1.5,
  minVolume24hUsd: 1_000_000,
  maxDrawdownPct: 6,
  minSignalScore: 0
};

console.log(JSON.stringify(normalizeCmcQuotes(payload, constraints), null, 2));
