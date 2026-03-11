import itemsData from "@/data/pokopiawiki/items.json";

export const items = itemsData.items;
export const itemsCount = itemsData.count ?? items.length;
