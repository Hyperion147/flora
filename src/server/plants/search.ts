import type { Plant } from "../../lib/types";
import type { PlantRow } from "./mappers";

export function escapeIlikePattern(value: string) {
  return value.replace(/[\\%_]/g, (match) => `\\${match}`);
}

export function mergePlantRows(rows: PlantRow[]) {
  const seen = new Map<string, PlantRow>();

  for (const row of rows) {
    seen.set(String(row.id), row);
  }

  return Array.from(seen.values());
}

export function sortPlantsByRelevance(plants: Plant[], query: string) {
  const normalizedQuery = query.toLowerCase();

  return [...plants].sort((a, b) => {
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();
    const aExact = aName === normalizedQuery || a.pid === query;
    const bExact = bName === normalizedQuery || b.pid === query;

    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;

    const aStarts = aName.startsWith(normalizedQuery);
    const bStarts = bName.startsWith(normalizedQuery);

    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;

    return (
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  });
}

