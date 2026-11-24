import { UserRole, UserStatus } from "./constants";

export interface UserAddress {
  _id?: string;
  label?: string;
  recipient: string;
  phone: string;
  line1: string;
  subdistrict?: string;
  district?: string;
  province: string;
  postalCode: string;
  isDefault: boolean;
}

export interface BaseUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  roles: UserRole[];
  status: UserStatus;
  addresses: UserAddress[];
  assignedSalesId?: string | Pick<BaseUser, "_id" | "name" | "email"> | null;
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
}