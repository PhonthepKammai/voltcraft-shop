export const ROLES = [
  "customer", 
  "sales", 
  "warehouse", 
  "admin"
] as const;

export const ORDER_STATUS = [
  "pending", // รอยืนยัน/รอชำระ
  "confirmed", // ยืนยันแล้ว สต็อกถูกจอง
  "packing", // คลังกำลังแพ็ค
  "shipped",
  "delivered",
  "cancelled",
  "returned",
] as const;