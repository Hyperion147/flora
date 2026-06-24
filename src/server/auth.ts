import type { SupabaseClient, User } from "@supabase/supabase-js";
import { HttpError } from "./errors";

export async function requireAuthenticatedUser(supabase: SupabaseClient) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new HttpError("Unauthorized", 401, error?.message ?? "No active session");
  }

  return user;
}

export function getUserDisplayName(user: User) {
  return (
    user.user_metadata?.name ||
    user.user_metadata?.full_name ||
    user.email ||
    "User"
  );
}

