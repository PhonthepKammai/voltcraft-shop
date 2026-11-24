import { ROLES } from "@/models";

export type Role = (typeof ROLES)[number];

export const ALL_PERMISSIONS = [
  "user:list", "user:create", "user:read", "user:update", "user:delete",
  "category:create", "category:update", "category:delete",
  "product:create", "product:update", "product:delete",
  "review:create", "review:moderate", "review:reply", "review:delete",
  "inventory:read", "inventory:adjust", "inventory:receive",
  "cart:manage",
  "coupon:read", "coupon:manage", "coupon:validate",
  "order:create", "order:read", "order:update_status", "order:cancel",
  "payment:create", "payment:read", "payment:verify",
  "shipment:read", "shipment:update",
  "upload:create",
  "audit:read",
] as const;

export type Permission = (typeof ALL_PERMISSIONS)[number];

/** กฎสิทธิ์ทั้งหมดอยู่ที่นี่ที่เดียว ("*" = ทุกสิทธิ์) */
const ROLE_PERMISSIONS: Record<Role, readonly (Permission | "*")[]> = {
  customer: [
    "review:create", "review:delete", "cart:manage", "coupon:validate",
    "order:create", "order:read", "order:cancel",
    "payment:create", "payment:read", "shipment:read", "upload:create",
  ],
  sales: [
    "user:read", "inventory:read", "coupon:read",
    "order:create", "order:read", "order:update_status", "order:cancel",
    "payment:read", "payment:verify", "shipment:read",
    "review:reply", "upload:create",
  ],
  warehouse: [
    "inventory:read", "inventory:adjust", "inventory:receive",
    "order:read", "order:update_status",
    "shipment:read", "shipment:update", "upload:create",
  ],
  admin: ["*"],
};

/** user มีหลาย role: ผ่านถ้า role ใด role หนึ่งมีสิทธิ์ */
export function can(roles: readonly Role[], permission: Permission): boolean {
  return roles.some((r) => {
    const perms = ROLE_PERMISSIONS[r] ?? [];
    return perms.includes("*") || perms.includes(permission);
  });
}

export const hasRole = (s: { roles: readonly Role[] }, ...roles: Role[]) =>
  s.roles.some((r) => roles.includes(r));

export const isAdmin = (s: { roles: readonly Role[] }) => s.roles.includes("admin");
