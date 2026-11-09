import { z } from "zod";

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const MAX_IMAGE_FILE_SIZE = 5 * 1024 * 1024;

export const ImageUrlSchema = z
  .string()
  .min(1, "Image URL is required")
  .refine(
    (val) =>
      val.startsWith("https://") ||
      val.startsWith("http://") ||
      val.startsWith("/") ||
      /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(val),
    "Image must be a valid hosted URL, path, or encoded image data"
  );

export const AddGalleryPairInputSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  area: z.string().min(2, "Service area name is required"),
  imageUrl: ImageUrlSchema,
});
export type AddGalleryPairInput = z.infer<typeof AddGalleryPairInputSchema>;
