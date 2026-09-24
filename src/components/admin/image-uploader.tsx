"use client";

import { CldUploadWidget } from "next-cloudinary";
import { UploadCloud } from "lucide-react";

/**
 * Drag & drop multi-image uploader backed by Cloudinary's unsigned upload preset.
 * Requires NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET and Cloudinary env vars (see .env.example).
 * Swap this in for the prompt()-based stub in product-form.tsx once Cloudinary is configured.
 */
export function ImageUploader({ onUpload }: { onUpload: (url: string) => void }) {
  return (
    <CldUploadWidget
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
      options={{ multiple: true, maxFiles: 6, sources: ["local", "url", "camera"] }}
      onSuccess={(result) => {
        const info = result.info;
        if (info && typeof info === "object" && "secure_url" in info) {
          onUpload(info.secure_url as string);
        }
      }}
    >
      {({ open }) => (
        <button
          type="button"
          onClick={() => open()}
          className="flex items-center gap-2 text-sm px-3 py-2 border border-dashed border-sand rounded-lg text-charcoal/60 hover:border-terracotta hover:text-terracotta"
        >
          <UploadCloud size={16} /> Drag & drop or click to upload
        </button>
      )}
    </CldUploadWidget>
  );
}
