export type Role = "customer" | "sales" | "warehouse" | "admin";
 
export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password: string; // mock only. Real app: hash on the server
  roles: Role[];
  department?: string;
  corporateRegistration?: boolean;
}
 