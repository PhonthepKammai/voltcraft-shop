import { randomUUID } from "node:crypto";
import { forbidden } from "@/lib/errors";
import { isAdmin } from "@/lib/rbac";
import type { Session } from "@/lib/session";
import { createUploadUrl } from "@/lib/storage";
import type { CreateUploadInput } from "@/validators/upload.schema";

const EXT = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" } as const;

/**
 * ขอ presigned URL เพื่อให้ client PUT ไฟล์ขึ้น object storage ตรงๆ
 * client ต้องส่ง Content-Type และขนาดไฟล์ให้ตรงกับที่ขอ ไม่เช่นนั้น storage จะปฏิเสธ
 */
export async function createPresignedUrl(session: Session, input: CreateUploadInput) {
  if (input.purpose === "product" && !isAdmin(session)) {
    throw forbidden("เฉพาะ admin อัปโหลดรูปสินค้าได้");
  }
  const month = new Date().toISOString().slice(0, 7);
  const key = `${input.purpose}/${month}/${session.userId}-${randomUUID()}.${EXT[input.contentType]}`;

  const res = await createUploadUrl({ key, contentType: input.contentType, size: input.size });
  return { ...res, method: "PUT" as const, headers: { "Content-Type": input.contentType } };
}
