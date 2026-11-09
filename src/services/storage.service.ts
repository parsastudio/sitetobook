import "server-only";
import { createHash } from "crypto";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_FILE_SIZE } from "@/entities/media/schema";
import { env } from "@/env";

export async function uploadImageBuffer(
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  if (!ALLOWED_IMAGE_TYPES.includes(contentType as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    throw new Error("Unsupported image format. Only JPEG, PNG, and WebP are allowed.");
  }

  if (buffer.length > MAX_IMAGE_FILE_SIZE) {
    throw new Error("File size exceeds 5MB limit.");
  }

  const vercelBlobToken = env.BLOB_READ_WRITE_TOKEN;
  if (vercelBlobToken) {
    const cleanFilename = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const response = await fetch(
      `https://blob.vercel-storage.com/${cleanFilename}`,
      {
        method: "PUT",
        headers: {
          authorization: `Bearer ${vercelBlobToken}`,
          "x-content-type": contentType,
          "x-add-random-suffix": "true",
        },
        body: new Uint8Array(buffer),
      }
    );

    if (response.ok) {
      const data = (await response.json()) as { url: string };
      return data.url;
    }
  }

  const cloudinaryUrl = env.CLOUDINARY_URL;
  if (cloudinaryUrl) {
    const matches = cloudinaryUrl.match(/cloudinary:\/\/([^:]+):([^@]+)@([^/]+)/);
    if (matches) {
      const [, apiKey, apiSecret, cloudName] = matches;
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const signature = createHash("sha1")
        .update(`timestamp=${timestamp}${apiSecret}`)
        .digest("hex");

      const formData = new FormData();
      const base64Data = `data:${contentType};base64,${buffer.toString("base64")}`;
      formData.append("file", base64Data);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const data = (await response.json()) as { secure_url: string };
        return data.secure_url;
      }
    }
  }

  return `data:${contentType};base64,${buffer.toString("base64")}`;
}
