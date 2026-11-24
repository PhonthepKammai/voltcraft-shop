import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { ZodError } from "zod";
import { AppError } from "./errors";

export const ok = <T>(data: T, status = 200) =>
  NextResponse.json({ success: true, data }, { status });

export const created = <T>(data: T) => ok(data, 201);

export const noContent = () => new NextResponse(null, { status: 204 });

function errorJson(status: number, code: string, message: string, details?: unknown) {
  return NextResponse.json(
    { success: false, error: { code, message, details } },
    { status }
  );
}

/** แปลง error ทุกชนิดเป็น response รูปแบบเดียวกัน */
export function fail(err: unknown) {
  if (err instanceof AppError) {
    return errorJson(err.status, err.code, err.message, err.details);
  }

  if (err instanceof ZodError) {
    return errorJson(
      400,
      "VALIDATION_ERROR",
      "ข้อมูลที่ส่งมาไม่ถูกต้อง",
      err.issues.map((i) => ({ path: i.path.join("."), message: i.message }))
    );
  }

  // Mongo duplicate key
  if (typeof err === "object" && err !== null && (err as { code?: number }).code === 11000) {
    const fields = Object.keys((err as { keyPattern?: object }).keyPattern ?? {});
    return errorJson(409, "DUPLICATE", "ข้อมูลนี้มีอยู่แล้วในระบบ", { fields });
  }

  if (err instanceof mongoose.Error.CastError) {
    return errorJson(400, "BAD_REQUEST", "รูปแบบ ID ไม่ถูกต้อง");
  }

  if (err instanceof mongoose.Error.ValidationError) {
    return errorJson(400, "VALIDATION_ERROR", "ข้อมูลไม่ผ่านการตรวจสอบ", err.message);
  }

  // req.json() พัง
  if (err instanceof SyntaxError) {
    return errorJson(400, "BAD_REQUEST", "รูปแบบ JSON ไม่ถูกต้อง");
  }

  console.error("[api] unhandled error:", err);
  return errorJson(500, "INTERNAL_ERROR", "เกิดข้อผิดพลาดภายในระบบ");
}
