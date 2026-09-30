import type { CollectionConfig } from "payload";
import { isAdmin, isSuperAdmin, isSuperAdminFieldLevel } from "../access/roles";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
    group: "Settings",
    defaultColumns: ["email", "name", "role"],
  },
  auth: true,
  access: {
    create: isAdmin,
    read: ({ req: { user } }) => {
      if (!user) return false;
      if (user.role === "super-admin" || user.role === "admin") return true;
      return { id: { equals: user.id } };
    },
    update: ({ req: { user }, id }) => {
      if (!user) return false;
      if (user.role === "super-admin" || user.role === "admin") return true;
      return id === user.id;
    },
    delete: isSuperAdmin,
    admin: ({ req: { user } }) => {
      if (!user) return false;
      return user.role !== "viewer";
    },
  },
  hooks: {
    beforeChange: [
      // The very first account becomes the super admin. Everyone created
      // after that starts as an editor until a super admin says otherwise,
      // because the role field below only accepts input from a super admin.
      async ({ data, operation, req }) => {
        if (operation === "create") {
          const { totalDocs } = await req.payload.count({ collection: "users", req });
          if (totalDocs === 0) data.role = "super-admin";
        }
        return data;
      },
    ],
  },
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "editor",
      access: {
        create: isSuperAdminFieldLevel,
        update: isSuperAdminFieldLevel,
      },
      admin: {
        description:
          "Super Admin: full access. Admin: manage content + users. Editor: create/edit content. Viewer: read-only.",
      },
      options: [
        { label: "Super Admin", value: "super-admin" },
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
        { label: "Viewer", value: "viewer" },
      ],
    },
  ],
};
