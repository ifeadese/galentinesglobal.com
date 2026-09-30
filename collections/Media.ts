import type { CollectionConfig } from "payload";
import { isEditor } from "../access/roles";

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    group: "Media",
    useAsTitle: "filename",
  },
  access: {
    read: () => true,
    create: isEditor,
    update: isEditor,
    delete: isEditor,
  },
  upload: {
    // Local-disk fallback for development without a Blob token. In any
    // environment with BLOB_READ_WRITE_TOKEN set, files go to Vercel Blob.
    staticDir: "media",
    imageSizes: [
      { name: "thumbnail", width: 400 },
      { name: "card", width: 800 },
      { name: "hero", width: 1920 },
      { name: "og", width: 1200, height: 630, position: "centre" },
    ],
    mimeTypes: ["image/*"],
    focalPoint: true,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      admin: {
        description:
          "Describe what's in the image for screen readers and SEO. Required.",
      },
    },
  ],
};
