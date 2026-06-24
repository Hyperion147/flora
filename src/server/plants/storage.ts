import { randomUUID } from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { HttpError } from "../errors";
import { logger } from "../logger";

export type UploadedPlantImage = {
  bucket: string;
  path: string;
  publicUrl: string;
};

const extensionByType: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export function getPlantImageBucket() {
  return process.env.SUPABASE_PLANT_IMAGES_BUCKET || "plants";
}

export function getImageExtension(file: File) {
  const fromType = extensionByType[file.type];
  if (fromType) return fromType;

  const fromName = file.name.split(".").pop()?.toLowerCase();
  return fromName && /^[a-z0-9]+$/.test(fromName) ? fromName : "jpg";
}

export async function uploadPlantImage(
  admin: SupabaseClient,
  userId: string,
  file: File,
): Promise<UploadedPlantImage> {
  const bucket = getPlantImageBucket();
  const extension = getImageExtension(file);
  const path = `plants/${userId}/${randomUUID()}.${extension}`;

  const { error } = await admin.storage.from(bucket).upload(path, file, {
    cacheControl: "31536000",
    contentType: file.type || "image/jpeg",
    upsert: false,
  });

  if (error) {
    throw new HttpError("Failed to upload image", 500, error.message);
  }

  const { data } = admin.storage.from(bucket).getPublicUrl(path);

  return {
    bucket,
    path,
    publicUrl: data.publicUrl,
  };
}

export async function deleteUploadedPlantImage(
  admin: SupabaseClient,
  upload: UploadedPlantImage | null,
) {
  if (!upload) return;

  const { error } = await admin.storage.from(upload.bucket).remove([upload.path]);
  if (error) {
    logger.warn("Failed to clean up uploaded plant image", {
      bucket: upload.bucket,
      path: upload.path,
      error: error.message,
    });
  }
}

