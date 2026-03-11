import { createWriteStream, mkdirSync, existsSync } from "fs";
import { pipeline } from "stream/promises";
import path from "path";

const ROOT = new URL("..", import.meta.url).pathname;

function ensureDir(dir) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

async function downloadFile(url, dest) {
  if (existsSync(dest)) return; // skip if already downloaded
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
    await pipeline(res.body, createWriteStream(dest));
  } catch (err) {
    console.error(`  ✗ FAILED: ${path.basename(dest)} — ${err.message}`);
  }
}

async function downloadAll(label, tasks) {
  console.log(`\n[${label}] ${tasks.length}개 다운로드 시작...`);
  let done = 0;
  // 10개씩 병렬 처리
  for (let i = 0; i < tasks.length; i += 10) {
    const batch = tasks.slice(i, i + 10);
    await Promise.all(batch.map(({ url, dest }) => downloadFile(url, dest)));
    done += batch.length;
    process.stdout.write(`  ${done}/${tasks.length}\r`);
  }
  console.log(`  ✓ 완료 (${tasks.length}개)`);
}

// ─── 데이터 로드 ────────────────────────────────────────────────────────────
const pokedexData = JSON.parse(
  await import("fs").then((fs) =>
    fs.readFileSync(path.join(ROOT, "data/game8/pokedex.json"), "utf-8")
  )
);
const habitatsData = JSON.parse(
  await import("fs").then((fs) =>
    fs.readFileSync(path.join(ROOT, "data/game8/habitats.json"), "utf-8")
  )
);
const materialsData = JSON.parse(
  await import("fs").then((fs) =>
    fs.readFileSync(path.join(ROOT, "data/game8/materials.json"), "utf-8")
  )
);
const itemsData = JSON.parse(
  await import("fs").then((fs) =>
    fs.readFileSync(path.join(ROOT, "data/pokopiawiki/items.json"), "utf-8")
  )
);

// ─── 1. 포켓몬 이미지 (파일명: 도감번호) ───────────────────────────────────
const pokemonDir = path.join(ROOT, "public/images/pokemon");
ensureDir(pokemonDir);

const pokemonTasks = pokedexData.pokemon
  .filter((p) => p.image)
  .map((p) => ({
    url: p.image,
    dest: path.join(pokemonDir, `${p.dexNo}.png`),
  }));

await downloadAll("포켓몬", pokemonTasks);

// ─── 2. 서식지 이미지 (파일명: 도감번호) ───────────────────────────────────
const habitatsDir = path.join(ROOT, "public/images/habitats");
ensureDir(habitatsDir);

const habitatTasks = habitatsData.habitats
  .filter((h) => h.image)
  .map((h) => ({
    url: h.image,
    dest: path.join(habitatsDir, `${String(h.dexNo).padStart(3, "0")}.png`),
  }));

await downloadAll("서식지", habitatTasks);

// ─── 3. 재료 이미지 ─────────────────────────────────────────────────────────
const materialsDir = path.join(ROOT, "public/images/materials");
ensureDir(materialsDir);

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const materialTasks = materialsData.materials
  .filter((m) => m.image)
  .map((m) => ({
    url: m.image,
    dest: path.join(materialsDir, `${slugify(m.name)}.png`),
  }));

await downloadAll("재료", materialTasks);

// ─── 4. 아이템 이미지 ───────────────────────────────────────────────────────
const itemsDir = path.join(ROOT, "public/images/items");
ensureDir(itemsDir);

const itemTasks = itemsData.items
  .filter((item) => item.image)
  .map((item) => ({
    url: item.image,
    dest: path.join(itemsDir, `${item.slug}.png`),
  }));

await downloadAll("아이템", itemTasks);

// ─── 5. 아이콘 (타입 / 특성 / 시간대 / 날씨) ────────────────────────────────
const iconMapping = pokedexData.iconMapping ?? {};

const typeDir = path.join(ROOT, "public/images/icons/type");
const specialtyDir = path.join(ROOT, "public/images/icons/specialty");
const timeDir = path.join(ROOT, "public/images/icons/time");
const weatherDir = path.join(ROOT, "public/images/icons/weather");

[typeDir, specialtyDir, timeDir, weatherDir].forEach(ensureDir);

const typeTasks = [];
const specialtyTasks = [];
const timeTasks = [];
const weatherTasks = [];

for (const [key, url] of Object.entries(iconMapping)) {
  if (key.startsWith("type")) {
    const name = key.slice(4); // e.g. "Rock"
    typeTasks.push({ url, dest: path.join(typeDir, `${name}.png`) });
  } else if (key.startsWith("specialty")) {
    const name = key.slice(9); // e.g. "Chop"
    specialtyTasks.push({ url, dest: path.join(specialtyDir, `${name}.png`) });
  } else if (key.startsWith("time")) {
    const name = key.slice(4); // e.g. "Dawn"
    timeTasks.push({ url, dest: path.join(timeDir, `${name}.png`) });
  } else if (key.startsWith("weather")) {
    const name = key.slice(7); // e.g. "Sunny"
    weatherTasks.push({ url, dest: path.join(weatherDir, `${name}.png`) });
  }
}

await downloadAll("타입 아이콘", typeTasks);
await downloadAll("특성 아이콘", specialtyTasks);
await downloadAll("시간대 아이콘", timeTasks);
await downloadAll("날씨 아이콘", weatherTasks);

console.log("\n✅ 모든 이미지 다운로드 완료!");
