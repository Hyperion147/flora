import { randomUUID } from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { logger } from "../logger.ts";

export const NEXT_PLANT_PID_RPC = "next_plant_pid";

type SupabaseLikeError = {
  code?: string;
  message?: string;
};

export function isUniqueViolation(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as SupabaseLikeError).code === "23505"
  );
}

export function createFallbackPid() {
  return `P${randomUUID().replaceAll("-", "").slice(0, 12).toUpperCase()}`;
}

export function normalizePid(value: unknown) {
  if (typeof value === "string" || typeof value === "number") {
    const pid = String(value).trim();
    return pid.length > 0 ? pid : null;
  }

  return null;
}

export async function getNextPlantPid(admin: SupabaseClient) {
  const { data, error } = await admin.rpc(NEXT_PLANT_PID_RPC);

  if (error) {
    logger.warn("PID sequence RPC unavailable; using random fallback PID", {
      code: error.code,
      message: error.message,
    });
    return createFallbackPid();
  }

  return normalizePid(data) ?? createFallbackPid();
}
