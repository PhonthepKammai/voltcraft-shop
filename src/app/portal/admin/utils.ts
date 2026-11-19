import type { NavTab, PageMeta } from "./types";

export function formatTHB(amount: number): string {
  return `฿${amount.toLocaleString("en-US")}`;
}

export function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function getPageMeta(activeTab: NavTab): PageMeta {
  switch (activeTab) {
    case "overview":
      return {
        short: "Overview & KPIs",
        breadcrumb: "VoltCraft Hub / Governance / Overview & Operational KPIs",
      };
    case "users":
      return {
        short: "Users & RBAC",
        breadcrumb: "VoltCraft Hub / Governance / User & RBAC Access Control",
      };
    case "catalog":
      return {
        short: "Master Catalog",
        breadcrumb:
          "VoltCraft Hub / Governance / Master Catalog & Inventory Oversight",
      };
    case "audit":
      return {
        short: "Audit Logs",
        breadcrumb: "VoltCraft Hub / Governance / System Security Audit Logs",
      };
  }
}
