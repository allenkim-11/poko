import fs from "fs/promises";
import path from "path";
import { load } from "cheerio";

const HABITAT_URL = "https://game8.co/games/Pokemon-Pokopia/archives/582463";
const ITEMS_URL = "https://game8.co/games/Pokemon-Pokopia/archives/584741";
const POKEDEX_URL = "https://game8.co/games/Pokemon-Pokopia/archives/578286";

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

async function fetchJson(url, headers = {}) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (PokopiaBot/1.0)",
      ...headers,
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status}`);
  }
  return res.json();
}

function normalizeText(text) {
  return text.replace(/\s+/g, " ").trim();
}

function splitMaterials(text) {
  if (!text) return [];
  const lines = text
    .split(/\n|\r|,|\u2022|\u00b7/)
    .map((line) => normalizeText(line))
    .filter(Boolean);
  return lines.length ? lines : [];
}

function parseHabitats(html) {
  const $ = load(html);
  const table = $("h3#hm_1").nextAll("table").first();
  const rows = table.find("tbody tr");
  const habitats = [];

  rows.each((_, tr) => {
    const $tr = $(tr);
    const habitatCell = $tr.find("td").eq(0);
    const detailsCell = $tr.find("td").eq(1);

    const name = normalizeText(habitatCell.find("a").first().text());
    const image =
      habitatCell.find("img").attr("data-src") ||
      habitatCell.find("img").attr("src") ||
      null;
    const dexText = habitatCell.find("b.a-bold").first().text();
    const dexNo = Number.parseInt(dexText, 10);

    const detailsHtml = detailsCell.html() || "";
    const beforePokemon = detailsHtml.split(/Pokemon Available/i)[0];
    const conditionText = normalizeText(
      load(`<div>${beforePokemon}</div>`)
        .text()
        .replace(/Conditions:/i, "")
    );
    const materials = splitMaterials(conditionText).filter(
      (item) => !/^Conditions$/i.test(item)
    );

    const pokemon = detailsCell
      .find("div.align a")
      .map((_, el) => normalizeText($(el).text()))
      .get()
      .filter(Boolean);

    if (!name || Number.isNaN(dexNo)) {
      return;
    }

    habitats.push({
      dexNo,
      name,
      materials,
      pokemon,
      image,
    });
  });

  habitats.sort((a, b) => a.dexNo - b.dexNo);
  return habitats;
}

function parseMaterials(html) {
  const $ = load(html);
  const table = $("h3#hm_10").nextAll("table").first();
  const items = [];

  table.find("td").each((_, td) => {
    const link = $(td).find("a.a-link").first();
    const name = normalizeText(link.text());
    const url = link.attr("href") || null;
    const image =
      link.find("img").attr("data-src") || link.find("img").attr("src") || null;

    if (!name) {
      return;
    }

    items.push({
      name,
      url,
      image,
    });
  });

  return items;
}

function parsePokedexMeta(html) {
  const $ = load(html);
  const propsRaw = $("#react-collection_browser-wrapper").attr("data-react-props");
  if (!propsRaw) {
    throw new Error("Pokedex data-react-props not found");
  }
  const props = JSON.parse(propsRaw);
  const mappingId = props.toolStructuralMapping?.id || props.toolStructuralMappingId;
  const updatedAt = props.toolStructuralMapping?.updatedAt;
  if (!mappingId || !updatedAt) {
    throw new Error("Pokedex mapping metadata missing");
  }
  return { mappingId, updatedAt };
}

function parsePokedex(apiData) {
  const items = apiData?.collectionArraySchema?.collectionItems || [];
  return items.map((item) => {
    const habitats = item.habitat
      ? item.habitat
          .split(":")
          .map((habitat) => normalizeText(habitat))
          .filter(Boolean)
      : [];
    const specialties = item.specialties
      ? item.specialties
          .split(",")
          .map((specialty) => normalizeText(specialty))
          .filter(Boolean)
      : [];
    const favorites = item.favorites
      ? item.favorites
          .split(",")
          .map((favorite) => normalizeText(favorite))
          .filter(Boolean)
      : [];

    const details = item.detailsArraySchema?.details || [];

    return {
      id: item.id,
      dexNo: item.dexno,
      name: item.name,
      image: item.imageUrl,
      url: item.url || null,
      type1: item.type1 || "",
      type2: item.type2 || "",
      habitats,
      specialties,
      favorites,
      details: details.map((detail) => ({
        name: detail.name,
        image: detail.image,
        url: detail.url,
        rarity: detail.rarity || "",
        time: detail.time || "",
        weather: detail.weather || "",
        biome: detail.biome || "",
        materials: detail.materials || "",
      })),
    };
  });
}

async function main() {
  const [habitatHtml, itemsHtml, pokedexHtml] = await Promise.all([
    fetchHtml(HABITAT_URL),
    fetchHtml(ITEMS_URL),
    fetchHtml(POKEDEX_URL),
  ]);

  const habitats = parseHabitats(habitatHtml);
  const materials = parseMaterials(itemsHtml);
  const pokedexMeta = parsePokedexMeta(pokedexHtml);
  const pokedexApiUrl = `https://game8.co/api/tool_structural_mappings/${pokedexMeta.mappingId}.json?updatedAt=${pokedexMeta.updatedAt}`;
  const pokedexApiData = await fetchJson(pokedexApiUrl, {
    Referer: POKEDEX_URL,
  });
  const pokedex = parsePokedex(pokedexApiData);
  const fetchedAt = new Date().toISOString();

  const habitatOutput = {
    source: HABITAT_URL,
    fetchedAt,
    count: habitats.length,
    habitats,
  };

  const materialsOutput = {
    source: ITEMS_URL,
    fetchedAt,
    count: materials.length,
    materials,
  };

  const pokedexOutput = {
    source: POKEDEX_URL,
    api: pokedexApiUrl,
    fetchedAt,
    count: pokedex.length,
    pokemon: pokedex,
    iconMapping: pokedexApiData?.iconMapping ?? {},
    filters: pokedexApiData?.filters ?? [],
  };

  await fs.writeFile(
    path.join("data", "game8", "habitats.json"),
    JSON.stringify(habitatOutput, null, 2)
  );
  await fs.writeFile(
    path.join("data", "game8", "materials.json"),
    JSON.stringify(materialsOutput, null, 2)
  );
  await fs.writeFile(
    path.join("data", "game8", "pokedex.json"),
    JSON.stringify(pokedexOutput, null, 2)
  );

  console.log(`Saved habitats: ${habitats.length}`);
  console.log(`Saved materials: ${materials.length}`);
  console.log(`Saved pokedex: ${pokedex.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
