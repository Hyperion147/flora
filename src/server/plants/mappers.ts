import type { Plant } from "../../lib/types";

export type PlantRow = {
  id: string | number;
  pid: string | number;
  name: string;
  description?: string | null;
  category?: string | null;
  image_url?: string | null;
  lat: number | string;
  lng: number | string;
  user_id: string;
  user_name: string;
  created_at: string | Date;
  updated_at?: string | Date | null;
};

export type LeaderboardRow = {
  user_id: string;
  user_name: string;
  plant_count: number | string;
};

export function mapPlantRow(row: PlantRow): Plant {
  return {
    id: row.id,
    pid: String(row.pid),
    name: row.name,
    description: row.description ?? undefined,
    category: row.category ?? undefined,
    image_url: row.image_url ?? null,
    lat: Number(row.lat),
    lng: Number(row.lng),
    user_id: row.user_id,
    user_name: row.user_name,
    created_at:
      row.created_at instanceof Date
        ? row.created_at.toISOString()
        : row.created_at,
    updated_at:
      row.updated_at instanceof Date
        ? row.updated_at.toISOString()
        : row.updated_at || undefined,
  };
}

export function mapPlantRows(rows: PlantRow[] = []) {
  return rows.map(mapPlantRow);
}

export function mapLeaderboardRow(row: LeaderboardRow) {
  return {
    user_id: row.user_id,
    user_name: row.user_name,
    plant_count: Number(row.plant_count),
  };
}

export function mapLeaderboardRows(rows: LeaderboardRow[] = []) {
  return rows.map(mapLeaderboardRow);
}

