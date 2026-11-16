import type { UserAccount } from "./types";

export const INITIAL_USERS: UserAccount[] = [
  {
    id: "VC-1001",
    name: "Alex Morgan",
    email: "customer@voltcraft.com",
    password: "password123",
    roles: ["customer"],
  },
  {
    id: "VC-1002",
    name: "Sarah Mitchell",
    email: "sales@voltcraft.com",
    password: "password123",
    roles: ["sales", "customer"],
    department: "Sales Operations",
  },
  {
    id: "VC-1003",
    name: "James Wilson",
    email: "warehouse@voltcraft.com",
    password: "password123",
    roles: ["warehouse", "customer"],
    department: "Warehouse Logistics",
  },
  {
    id: "VC-1004",
    name: "Michael Anderson",
    email: "admin@voltcraft.com",
    password: "password123",
    roles: ["admin", "sales", "warehouse", "customer"],
    department: "Executive Administration",
  },
];
