"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import Image from "next/image";
import { BeforeAfterItem } from "@/entities/tenant/schema";
import {
  addGalleryPairAction,
  deleteGalleryPairAction,
} from "@/app/actions/media.actions";
import { CameraIcon } from "@/components/ui/icons";

interface GalleryManagerProps {
  slug: string;
  gallery: BeforeAfterItem[];
}

export function GalleryManager({ slug, gallery }: GalleryManagerProps) {
  const [items, setItems] = useState<BeforeAfterItem[]>(gallery);
  const [title, setTitle] = useState("");
  const [area, setArea] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isUploading, startUploadTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setItems(gallery);
  }, [gallery]);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Image size exceeds 5MB limit.");
      return;
    }

    if (imagePreview) URL.revokeObjectURL(imagePreview);
    const previewUrl = URL.createObjectURL(file);
    setImageFile(file);
    setImagePreview(previewUrl);
    setErrorMsg(null);
  };

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("slug", slug);
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const result = (await response.json()) as {
      success: boolean;
      url?: string;
      error?: string;
    };
    if (!response.ok || !result.success || !result.url) {
      throw new Error(result.error || "Image upload failed.");
    }

    return result.url;
  };

  const handleAddShowcase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      setErrorMsg("Please select a Before/After showcase image.");
      return;
    }

    setErrorMsg(null);
    startUploadTransition(async () => {
      try {
        const imageUrl = await uploadFile(imageFile);

        const res = await addGalleryPairAction(slug, {
          title: title.trim(),
          area: area.trim(),
          imageUrl,
        });

        if (res.success) {
          setItems((prev) => [
            {
              id: res.data.id,
              title: title.trim(),
              area: area.trim(),
              image: imageUrl,
            },
            ...prev,
          ]);
          setTitle("");
          setArea("");
          setImageFile(null);
          if (imagePreview) URL.revokeObjectURL(imagePreview);
          setImagePreview(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        } else {
          setErrorMsg(res.error);
        }
      } catch (err) {
        setErrorMsg(
          err instanceof Error ? err.message : "Upload processing failed."
        );
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to remove this showcase photo?")) return;

    startUploadTransition(async () => {
      const res = await deleteGalleryPairAction(slug, id);
      if (res.success) {
        setItems((prev) => prev.filter((item) => item.id !== id));
      } else {
        setErrorMsg(res.error);
      }
    });
  };

  return (
    <div className="rounded-2xl border border-border-default bg-surface p-5 shadow-xs flex flex-col gap-4 text-left">
      <div className="flex flex-col gap-0.5 border-b border-border-subtle pb-3">
        <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
          <CameraIcon className="h-4 w-4 text-primary" />
          <span>Before & After Gallery Showcase</span>
        </h2>
        <p className="text-xs text-text-muted">
          Upload side-by-side transformation photos to display on your portal.
        </p>
      </div>

      {errorMsg && (
        <div className="rounded-lg border border-destructive/30 bg-destructive-subtle p-2.5 text-xs font-semibold text-destructive">
          ✕ {errorMsg}
        </div>
      )}

      <form
        onSubmit={handleAddShowcase}
        className="flex flex-col gap-3 rounded-xl border border-border-default bg-subtle p-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-text-primary">
              Project Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Master Bath Tile Scrub"
              className="rounded-lg border border-border-default bg-surface px-3 py-2 text-sm font-semibold text-text-primary outline-hidden focus:border-border-focus"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-text-primary">
              Room Category Tab *
            </label>
            <input
              type="text"
              required
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="e.g. Bathroom Sanitization"
              className="rounded-lg border border-border-default bg-surface px-3 py-2 text-sm font-semibold text-text-primary outline-hidden focus:border-border-focus"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5 pt-1">
          <span className="text-xs font-semibold text-text-secondary">
            Side-by-Side Before & After Photo (JPEG, PNG, WebP)
          </span>
          <label className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border-default bg-surface p-3 cursor-pointer hover:border-primary transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
            {imagePreview ? (
              <div className="relative h-32 w-full overflow-hidden rounded-lg">
                <Image
                  src={imagePreview}
                  alt="Showcase preview"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <span className="text-xs text-text-muted font-medium py-5">
                + Choose Side-by-Side Comparison Image
              </span>
            )}
          </label>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={isUploading || !imageFile}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-bold text-text-inverse hover:bg-primary-hover disabled:opacity-50 transition-colors"
          >
            {isUploading ? "Uploading..." : "+ Add Showcase"}
          </button>
        </div>
      </form>

      <div className="flex flex-col gap-2 pt-1">
        <span className="text-xs font-bold text-text-primary">
          Active Showcases ({items.length})
        </span>

        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border-default bg-subtle/50 p-6 text-center text-xs text-text-muted">
            No Before/After comparisons uploaded yet. Add your first transformation above.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-2.5 rounded-xl border border-border-default bg-surface p-2.5 shadow-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative h-11 w-14 shrink-0 overflow-hidden rounded-lg border border-border-default">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-text-primary truncate">
                      {item.title}
                    </span>
                    <span className="text-[10px] font-semibold text-primary truncate">
                      {item.area}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => handleDelete(item.id)}
                  className="rounded-lg p-1.5 text-xs font-bold text-destructive hover:bg-destructive-subtle transition-colors shrink-0"
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
