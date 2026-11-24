export class AppError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const badRequest = (msg = "คำขอไม่ถูกต้อง", details?: unknown) =>
  new AppError(400, "BAD_REQUEST", msg, details);
export const unauthorized = (msg = "กรุณาเข้าสู่ระบบ") =>
  new AppError(401, "UNAUTHORIZED", msg);
export const forbidden = (msg = "ไม่มีสิทธิ์ดำเนินการ") =>
  new AppError(403, "FORBIDDEN", msg);
export const notFound = (msg = "ไม่พบข้อมูล") =>
  new AppError(404, "NOT_FOUND", msg);
export const conflict = (msg = "ข้อมูลขัดแย้งกับสถานะปัจจุบัน", details?: unknown) =>
  new AppError(409, "CONFLICT", msg, details);
