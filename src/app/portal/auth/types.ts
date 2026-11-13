import { type ReactNode } from "react";

export type Role = "customer" | "sales" | "warehouse" | "admin";

export type AuthView = "login" | "register" | "gateway" | "portal";

export type ToastType = "success" | "error" | "info";

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password: string;
  roles: Role[];
  department?: string;
  corporateRegistration?: boolean;
}

export interface RoleConfig {
  id: Role;
  title: string;
  subtitle: string;
  description: string;
  permissions: string[];
  destination: string;
  icon: ReactNode;
  badgeClass: string;
  iconClass: string;
  buttonClass: string;
  features: string[];
}

export interface ToastData {
  message: string;
  type: ToastType;
}

export interface DemoAccount {
  label: string;
  description: string;
  email: string;
  icon: ReactNode;
  color: string;
}
