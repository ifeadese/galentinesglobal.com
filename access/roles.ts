import type { Access, FieldAccess } from "payload";

export type Role = "super-admin" | "admin" | "editor" | "viewer";

export const isLoggedIn: Access = ({ req: { user } }) => Boolean(user);

export const hasRole =
  (...roles: Role[]): Access =>
  ({ req: { user } }) => {
    if (!user) return false;
    return roles.includes(user.role as Role);
  };

export const isSuperAdmin: Access = ({ req: { user } }) =>
  user?.role === "super-admin";

export const isAdmin: Access = ({ req: { user } }) =>
  user?.role === "super-admin" || user?.role === "admin";

export const isEditor: Access = ({ req: { user } }) => {
  if (!user) return false;
  return ["super-admin", "admin", "editor"].includes(user.role as Role);
};

export const canReadPublished: Access = ({ req: { user } }) => {
  if (user) return true;
  return { _status: { equals: "published" } };
};

export const isAdminFieldLevel: FieldAccess = ({ req: { user } }) =>
  user?.role === "super-admin" || user?.role === "admin";

export const isSuperAdminFieldLevel: FieldAccess = ({ req: { user } }) =>
  user?.role === "super-admin";
