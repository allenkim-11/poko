import fs from "fs/promises";
import { load } from "cheerio";

const POKEDEX_PATH = new URL("../data/game8/pokedex.json", import.meta.url);
const REQUEST_DELAY_MS = 200;

async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (PokopiaBot/1.0)",
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status}`);
  }
  return res.text();
}

function normalizeText(text) {
  return text.replace(/\s+/g, " ").trim();
}

function cleanBiome(text) {
  return normalizeText(text).replace(/^[•·・-]+\s*/u, "");
}

function parseBiomes(html) {
  const $ = load(html);
  const biomeMap = new Map();

  const tables = $("table").filter((_, table) => {
    const text = normalizeText($(table).text());
    return text.includes("Time of Day") && text.includes("Biome");
  });

  tables.each((_, table) => {
    let pendingHabitat = "";
    $(table)
      .find("tr")
      .each((_, tr) => {
        const $tr = $(tr);
        const habitatCell = $tr.find("td[rowspan='2'], td[rowspan=2]").first();
        if (habitatCell.length) {
          const name = normalizeText(habitatCell.find("a.a-link").first().text());
          pendingHabitat = name;
          return;
        }

        if (!pendingHabitat) {
          return;
        }

        const rowText = normalizeText($tr.text());
        const match = rowText.match(/Biome:\s*(.*?)\s*Rarity:/i);
        if (match && match[1]) {
          biomeMap.set(pendingHabitat, cleanBiome(match[1]));
        }
        pendingHabitat = "";
      });
  });

  return biomeMap;
}

async function main() {
  const raw = await fs.readFile(POKEDEX_PATH, "utf8");
  const data = JSON.parse(raw);
  const pokemon = data.pokemon || [];
  const total = pokemon.length;
  let totalUpdates = 0;

  for (let i = 0; i < total; i += 1) {
    const entry = pokemon[i];
    if (!entry?.url) {
      continue;
    }

    let html;
    try {
      html = await fetchHtml(entry.url);
    } catch (error) {
      console.warn(`[${i + 1}/${total}] ${entry.name}: fetch failed`);
      continue;
    }

    const biomeMap = parseBiomes(html);
    if (!biomeMap.size) {
      console.warn(`[${i + 1}/${total}] ${entry.name}: no biome data found`);
      await sleep(REQUEST_DELAY_MS);
      continue;
    }

    let updated = 0;
    if (Array.isArray(entry.details)) {
      entry.details = entry.details.map((detail) => {
        const key = normalizeText(detail.name || "");
        const biome = biomeMap.get(key);
        if (biome) {
          updated += 1;
          return { ...detail, biome };
        }
        return detail;
      });
    }

    totalUpdates += updated;
    console.log(`[${i + 1}/${total}] ${entry.name}: updated ${updated}`);
    await sleep(REQUEST_DELAY_MS);
  }

  await fs.writeFile(POKEDEX_PATH, JSON.stringify(data, null, 2));
  console.log(`Done. Total biomes updated: ${totalUpdates}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
