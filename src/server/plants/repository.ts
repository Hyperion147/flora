import type { SupabaseClient, User } from "@supabase/supabase-js";
import { getSupabaseAdminClient } from "@/app/supabase/admin";
import type { CreatePlantInput } from "./validation";
import type { LeaderboardRow, PlantRow } from "./mappers";
import { HttpError } from "../errors";
import { getUserDisplayName } from "../auth";
import { logger } from "../logger";
import { mapLeaderboardRows, mapPlantRow, mapPlantRows } from "./mappers";
import { getNextPlantPid, isUniqueViolation } from "./pid";
import { deleteUploadedPlantImage, uploadPlantImage } from "./storage";
import {
  escapeIlikePattern,
  mergePlantRows,
  sortPlantsByRelevance,
} from "./search";

type ListPlantsOptions = {
  query?: string;
  userId?: string | null;
};

export async function listPlants(
  supabase: SupabaseClient,
  options: ListPlantsOptions = {},
) {
  if (options.query) {
    return searchPlants(supabase, options.query);
  }

  let query = supabase.from("plants").select("*");

  if (options.userId) {
    query = query.eq("user_id", options.userId);
  }

  const { data, error } = await query.order("created_at", {
    ascending: false,
  });

  if (error) {
    throw new HttpError("Failed to fetch plants", 500, error.message);
  }

  const rows = await withUserAvatars((data || []) as PlantRow[]);
  return mapPlantRows(rows);
}

export async function searchPlants(
  supabase: SupabaseClient,
  rawQuery: string,
  limit = 50,
) {
  const query = rawQuery.trim();
  if (!query) return [];

  const pattern = `%${escapeIlikePattern(query)}%`;
  const searchQueries = [
    supabase.from("plants").select("*").ilike("name", pattern).limit(limit),
    supabase
      .from("plants")
      .select("*")
      .ilike("description", pattern)
      .limit(limit),
    supabase
      .from("plants")
      .select("*")
      .ilike("user_name", pattern)
      .limit(limit),
  ];

  if (/^\d+$/.test(query)) {
    searchQueries.unshift(
      supabase.from("plants").select("*").eq("pid", query).limit(limit),
    );
  } else {
    searchQueries.unshift(
      supabase.from("plants").select("*").ilike("pid", pattern).limit(limit),
    );
  }

  const results = await Promise.all(searchQueries);
  const failed = results.find((result) => result.error);

  if (failed?.error) {
    throw new HttpError("Failed to search plants", 500, failed.error.message);
  }

  const rows = mergePlantRows(
    results.flatMap((result) => (result.data || []) as PlantRow[]),
  );

  const rowsWithAvatars = await withUserAvatars(rows);
  return sortPlantsByRelevance(mapPlantRows(rowsWithAvatars), query).slice(
    0,
    limit,
  );
}

export async function createPlant(
  admin: SupabaseClient,
  user: User,
  input: CreatePlantInput,
) {
  const uploadedImage = await uploadPlantImage(admin, user.id, input.image);
  const userName = getUserDisplayName(user);

  try {
    let lastError: unknown = null;

    for (let attempt = 0; attempt < 3; attempt++) {
      const pid = await getNextPlantPid(admin);
      const { data, error } = await admin
        .from("plants")
        .insert({
          name: input.name,
          description: input.description,
          category: input.category,
          user_id: user.id,
          user_name: userName,
          lat: input.lat,
          lng: input.lng,
          image_url: uploadedImage.publicUrl,
          pid,
        })
        .select()
        .single();

      if (!error && data) {
        return mapPlantRow({
          ...(data as PlantRow),
          user_avatar_url:
            user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
        });
      }

      lastError = error;
      if (!isUniqueViolation(error)) {
        break;
      }

      logger.warn("PID collision detected; retrying plant insert", {
        attempt: attempt + 1,
      });
    }

    throw new HttpError(
      "Failed to save plant",
      500,
      lastError instanceof Error ? lastError.message : lastError,
    );
  } catch (error) {
    await deleteUploadedPlantImage(admin, uploadedImage);
    throw error;
  }
}

async function withUserAvatars(rows: PlantRow[]) {
  if (!rows.length) return rows;

  const admin = getSupabaseAdminClient();
  const uniqueUserIds = Array.from(new Set(rows.map((row) => row.user_id)));
  const avatarEntries = await Promise.all(
    uniqueUserIds.map(async (userId) => {
      try {
        const { data, error } = await admin.auth.admin.getUserById(userId);

        if (error || !data.user) {
          return [userId, null] as const;
        }

        return [
          userId,
          data.user.user_metadata?.avatar_url ||
            data.user.user_metadata?.picture ||
            null,
        ] as const;
      } catch (error) {
        logger.warn("Failed to resolve plant user avatar", {
          userId,
          error: error instanceof Error ? error.message : String(error),
        });
        return [userId, null] as const;
      }
    }),
  );

  const avatarMap = new Map(avatarEntries);

  return rows.map((row) => ({
    ...row,
    user_avatar_url: avatarMap.get(row.user_id) ?? null,
  }));
}

export async function deletePlant(
  supabase: SupabaseClient,
  user: User,
  plantId: string,
) {
  const { data: plant, error: fetchError } = await supabase
    .from("plants")
    .select("id,user_id")
    .eq("id", plantId)
    .single();

  if (fetchError || !plant) {
    throw new HttpError("Plant not found", 404);
  }

  if ((plant as { user_id: string }).user_id !== user.id) {
    throw new HttpError("Not authorized to delete this plant", 403);
  }

  const { error } = await supabase
    .from("plants")
    .delete()
    .eq("id", plantId)
    .eq("user_id", user.id);

  if (error) {
    throw new HttpError("Failed to delete plant", 500, error.message);
  }

  return { success: true };
}

export async function getLeaderboard(admin: SupabaseClient, limit = 50) {
  const safeLimit = Math.min(Math.max(Math.trunc(limit), 1), 100);
  const { data, error } = await admin.rpc("plant_leaderboard", {
    p_limit: safeLimit,
  });

  if (!error && data) {
    const rowsWithAvatars = await withLeaderboardAvatars(
      admin,
      data as LeaderboardRow[],
    );
    return mapLeaderboardRows(rowsWithAvatars);
  }

  logger.warn("Leaderboard RPC unavailable; falling back to row aggregation", {
    code: error?.code,
    message: error?.message,
  });

  const { data: plants, error: fetchError } = await admin
    .from("plants")
    .select("user_id,user_name");

  if (fetchError) {
    throw new HttpError("Failed to fetch leaderboard", 500, fetchError.message);
  }

  const leaderboard = new Map<string, LeaderboardRow>();

  for (const plant of (plants || []) as Array<{
    user_id?: string;
    user_name?: string;
  }>) {
    if (!plant.user_id || !plant.user_name) continue;

    const existing = leaderboard.get(plant.user_id);
    if (existing) {
      existing.plant_count = Number(existing.plant_count) + 1;
    } else {
      leaderboard.set(plant.user_id, {
        user_id: plant.user_id,
        user_name: plant.user_name,
        plant_count: 1,
        avatar_url: null,
      });
    }
  }

  const rowsWithAvatars = await withLeaderboardAvatars(
    admin,
    Array.from(leaderboard.values()),
  );

  return mapLeaderboardRows(rowsWithAvatars)
    .sort((a, b) => b.plant_count - a.plant_count)
    .slice(0, safeLimit);
}

async function withLeaderboardAvatars(
  admin: SupabaseClient,
  rows: LeaderboardRow[],
) {
  if (!rows.length) return rows;

  const uniqueUserIds = Array.from(new Set(rows.map((row) => row.user_id)));
  const avatarEntries = await Promise.all(
    uniqueUserIds.map(async (userId) => {
      try {
        const { data, error } = await admin.auth.admin.getUserById(userId);

        if (error || !data.user) {
          return [userId, null] as const;
        }

        return [
          userId,
          data.user.user_metadata?.avatar_url ||
            data.user.user_metadata?.picture ||
            null,
        ] as const;
      } catch (error) {
        logger.warn("Failed to resolve leaderboard user avatar", {
          userId,
          error: error instanceof Error ? error.message : String(error),
        });
        return [userId, null] as const;
      }
    }),
  );

  const avatarMap = new Map(avatarEntries);

  return rows.map((row) => ({
    ...row,
    avatar_url: avatarMap.get(row.user_id) ?? null,
  }));
}
