import { z } from "zod";

export const MAX_PLANT_IMAGE_BYTES = 10 * 1024 * 1024;
export const ACCEPTED_PLANT_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const imageExtensionPattern = /\.(jpe?g|png|webp|gif)$/i;

function isSupportedImageFile(file: File) {
  return (
    ACCEPTED_PLANT_IMAGE_TYPES.has(file.type) ||
    (!file.type && imageExtensionPattern.test(file.name))
  );
}

export const createPlantInputSchema = z.object({
  name: z.string().trim().min(2).max(255),
  description: z.string().trim().max(2000).optional().default(""),
  category: z
    .string()
    .trim()
    .max(100)
    .optional()
    .transform((value) => value || null),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  image: z
    .instanceof(File, { message: "Plant image is required" })
    .refine((file) => file.size > 0, "Plant image is required")
    .refine(
      (file) => file.size <= MAX_PLANT_IMAGE_BYTES,
      "Plant image must be 10MB or smaller",
    )
    .refine(
      isSupportedImageFile,
      "Plant image must be JPEG, PNG, WebP, or GIF",
    ),
});

export type CreatePlantInput = z.infer<typeof createPlantInputSchema>;

export function parseCreatePlantFormData(formData: FormData) {
  const image = formData.get("image");

  return createPlantInputSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || "",
    category: formData.get("category") || "",
    lat: formData.get("lat"),
    lng: formData.get("lng"),
    image,
  });
}

export function formatValidationError(error: z.ZodError) {
  return error.issues
    .map((issue) => {
      const field = issue.path.join(".") || "form";
      return `${field}: ${issue.message}`;
    })
    .join("; ");
}

export function parseOptionalUuid(value: string | null) {
  if (!value) return { success: true as const, data: null };
  return z.string().uuid().safeParse(value);
}

export function normalizeSearchQuery(value: string | null) {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed.slice(0, 120) : "";
}

