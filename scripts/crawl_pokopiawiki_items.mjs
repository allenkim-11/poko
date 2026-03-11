import fs from "fs/promises";
import path from "path";
import { load } from "cheerio";

const ITEMS_URL = "https://www.pokopiawiki.com/items";

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

function titleCase(slug) {
  return slug
    .replace(/[_-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function parseItems(html) {
  const $ = load(html);
  const items = [];
  const seen = new Set();

  $("link[rel='preload'][as='image']").each((_, el) => {
    const href = $(el).attr("href") || "";
    if (!href.includes("/items/")) {
      return;
    }
    let url;
    try {
      url = new URL(href);
    } catch {
      return;
    }
    const filename = url.pathname.split("/").pop();
    if (!filename) {
      return;
    }
    const slug = filename.replace(/\.[^.]+$/, "");
    if (!slug || seen.has(slug)) {
      return;
    }

    seen.add(slug);
    items.push({
      slug,
      name: titleCase(slug),
      image: href,
      category: "",
      description: "",
      map: "",
    });
  });

  items.sort((a, b) => a.name.localeCompare(b.name));
  return items;
}

function decodeFlightPayload(html) {
  const chunks = [];
  const re = /self\.__next_f\.push\(\[1,"([\s\S]*?)"\]\)/g;
  let match;
  while ((match = re.exec(html))) {
    const chunk = match[1];
    try {
      chunks.push(JSON.parse(`\"${chunk}\"`));
    } catch {
      // Ignore malformed chunks.
    }
  }
  return chunks.join("\n");
}

function extractItemsFromFlight(text) {
  const marker = "\"items\":[";
  const startIndex = text.indexOf(marker);
  if (startIndex === -1) return [];

  let i = startIndex + marker.length;
  let depth = 1;
  const start = i;
  for (; i < text.length; i += 1) {
    const ch = text[i];
    if (ch === "\"") {
      i += 1;
      while (i < text.length) {
        const c = text[i];
        if (c === "\\\\") {
          i += 2;
          continue;
        }
        if (c === "\"") break;
        i += 1;
      }
      continue;
    }
    if (ch === "[") depth += 1;
    if (ch === "]") {
      depth -= 1;
      if (depth === 0) break;
    }
  }
  if (depth !== 0) return [];

  const arrayText = text.slice(start, i);
  try {
    return JSON.parse(`[${arrayText}]`);
  } catch {
    return [];
  }
}

function parseItemsFromFlight(html) {
  const payload = decodeFlightPayload(html);
  const items = extractItemsFromFlight(payload);
  if (!items.length) return [];

  return items
    .map((item) => {
      const id = item.id || "";
      const name = item.name?.en || "";
      return {
        slug: id || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        name: name || titleCase(id),
        image: item.image || "",
        category: item.category || "",
        description: item.description?.en || "",
        map: item.source || "",
      };
    })
    .filter((item) => item.slug || item.name);
}

async function main() {
  const html = await fetchHtml(ITEMS_URL);
  const items = parseItemsFromFlight(html);
  const resolvedItems = items.length ? items : parseItems(html);
  resolvedItems.sort((a, b) => a.name.localeCompare(b.name));
  const fetchedAt = new Date().toISOString();

  const output = {
    source: ITEMS_URL,
    fetchedAt,
    count: resolvedItems.length,
    items: resolvedItems,
  };

  const outDir = path.join("data", "pokopiawiki");
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(
    path.join(outDir, "items.json"),
    JSON.stringify(output, null, 2)
  );

  console.log(`Saved items: ${items.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
