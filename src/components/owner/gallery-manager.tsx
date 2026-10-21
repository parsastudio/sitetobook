"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { BeforeAfterItem } from "@/entities/tenant/schema";
import {
  addGalleryPairAction,
  deleteGalleryPairAction,
} from "@/app/actions/media.actions";

interface GalleryManagerProps {
  slug: string;
  gallery: BeforeAfterItem[];
}

export function GalleryManager({ slug, gallery }: GalleryManagerProps) {
  const [items, setItems] = useState<BeforeAfterItem[]>(gallery);
  const [title, setTitle] = useState("");
  const [area, setArea] = useState("");
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const [beforePreview, setBeforePreview] = useState<string | null>(null);
  const [afterPreview, setAfterPreview] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isUploading, startUploadTransition] = useTransition();

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "before" | "after"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Image size exceeds 5MB limit.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    if (type === "before") {
      setBeforeFile(file);
      setBeforePreview(previewUrl);
    } else {
      setAfterFile(file);
      setAfterPreview(previewUrl);
    }
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

    const result = (await response.json()) as { success: boolean; url?: string; error?: string };
    if (!response.ok || !result.success || !result.url) {
      throw new Error(result.error || "Image upload failed.");
    }

    return result.url;
  };

  const handleAddPair = (e: React.FormEvent) => {
    e.preventDefault();
    if (!beforeFile || !afterFile) {
      setErrorMsg("Please select both 'Before' and 'After' photos.");
      return;
    }

    setErrorMsg(null);
    startUploadTransition(async () => {
      try {
        const [beforeImageUrl, afterImageUrl] = await Promise.all([
          uploadFile(beforeFile),
          uploadFile(afterFile),
        ]);

        const res = await addGalleryPairAction(slug, {
          title: title.trim(),
          area: area.trim(),
          beforeImageUrl,
          afterImageUrl,
        });

        if (res.success) {
          setItems((prev) => [
            {
              id: res.data.id,
              title: title.trim(),
              area: area.trim(),
              beforeImage: beforeImageUrl,
              afterImage: afterImageUrl,
            },
            ...prev,
          ]);
          setTitle("");
          setArea("");
          setBeforeFile(null);
          setAfterFile(null);
          setBeforePreview(null);
          setAfterPreview(null);
        } else {
          setErrorMsg(res.error);
        }
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : "Upload processing failed.");
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to remove this Before/After showcase?")) return;

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
        <h2 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
          <span>📸</span> Before & After Gallery Showcase
        </h2>
        <p className="text-xs text-text-muted">
          Add real project comparisons to the interactive slider on your website.
        </p>
      </div>

      {errorMsg && (
        <div className="rounded-lg border border-destructive/30 bg-destructive-subtle p-2.5 text-xs font-semibold text-destructive">
          ✕ {errorMsg}
        </div>
      )}

      <form onSubmit={handleAddPair} className="flex flex-col gap-3 rounded-xl border border-border-default bg-subtle p-4">
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
              Area / Room Tag *
            </label>
            <input
              type="text"
              required
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="e.g. Bathroom"
              className="rounded-lg border border-border-default bg-surface px-3 py-2 text-sm font-semibold text-text-primary outline-hidden focus:border-border-focus"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-text-secondary">
              1. Before Photo (Pre-clean)
            </span>
            <label className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border-default bg-surface p-3 cursor-pointer hover:border-primary transition-colors">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => handleFileChange(e, "before")}
                className="hidden"
              />
              {beforePreview ? (
                <div className="relative h-24 w-full overflow-hidden rounded-lg">
                  <Image
                    src={beforePreview}
                    alt="Before preview"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <span className="text-xs text-text-muted font-medium py-4">
                  + Choose Before Image
                </span>
              )}
            </label>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-text-secondary">
              2. After Photo (Cleaned)
            </span>
            <label className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border-default bg-surface p-3 cursor-pointer hover:border-primary transition-colors">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => handleFileChange(e, "after")}
                className="hidden"
              />
              {afterPreview ? (
                <div className="relative h-24 w-full overflow-hidden rounded-lg">
                  <Image
                    src={afterPreview}
                    alt="After preview"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <span className="text-xs text-text-muted font-medium py-4">
                  + Choose After Image
                </span>
              )}
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={isUploading || !beforeFile || !afterFile}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-bold text-text-inverse hover:bg-primary-hover disabled:opacity-50 transition-colors"
          >
            {isUploading ? "Uploading..." : "+ Add Showcase"}
          </button>
        </div>
      </form>

      <div className="flex flex-col gap-2 pt-1">
        <span className="text-xs font-bold text-text-primary">
          Active Comparisons ({items.length})
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-2.5 rounded-xl border border-border-default bg-surface p-2.5 shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-border-default">
                  <Image
                    src={item.afterImage}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-text-primary line-clamp-1">
                    {item.title}
                  </span>
                  <span className="text-[10px] font-semibold text-primary">
                    {item.area}
                  </span>
                </div>
              </div>

              <button
                type="button"
                disabled={isUploading}
                onClick={() => handleDelete(item.id)}
                className="rounded-lg p-1.5 text-xs font-bold text-destructive hover:bg-destructive-subtle transition-colors"
                title="Remove"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
