import { NextRequest, NextResponse } from "next/server";
import { getOwnerSession } from "@/lib/auth-guard";
import { uploadImageBuffer } from "@/services/storage.service";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_FILE_SIZE } from "@/entities/media/schema";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const slug = formData.get("slug") as string | null;
    const file = formData.get("file") as File | null;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Tenant slug is required." },
        { status: 400 }
      );
    }

    const session = await getOwnerSession(slug);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized session." },
        { status: 401 }
      );
    }

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No image file provided." },
        { status: 400 }
      );
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
      return NextResponse.json(
        { success: false, error: "Invalid image format. Allowed: JPEG, PNG, WebP." },
        { status: 400 }
      );
    }

    if (file.size > MAX_IMAGE_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: "File size exceeds 5MB limit." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const url = await uploadImageBuffer(buffer, file.name, file.type);

    return NextResponse.json({ success: true, url });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Image upload failed.",
      },
      { status: 500 }
    );
  }
}
