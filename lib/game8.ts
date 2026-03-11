import habitatsData from "@/data/game8/habitats.json";
import materialsData from "@/data/game8/materials.json";
import pokedexData from "@/data/game8/pokedex.json";

export const habitats = habitatsData.habitats;
export const habitatCount = habitatsData.count ?? habitats.length;

export const materials = materialsData.materials;
export const materialsCount = materialsData.count ?? materials.length;

export const pokedex = pokedexData.pokemon;
export const pokedexCount = pokedexData.count ?? pokedex.length;
export const pokedexIconMapping = (pokedexData.iconMapping ?? {}) as Record<
  string,
  string
>;
