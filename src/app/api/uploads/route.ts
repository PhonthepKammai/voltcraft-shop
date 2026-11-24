import { withAuth } from "@/lib/with-auth";
import { created } from "@/lib/response";
import * as uploadService from "@/services/upload.service";
import { createUploadSchema } from "@/validators/upload.schema";

// POST /api/uploads  ขอ presigned URL เพื่ออัปโหลดรูป (สินค้า/รีวิว/สลิป) ตรงไป object storage
export const POST = withAuth({ permission: "upload:create" }, async (req, { session }) => {
  const input = createUploadSchema.parse(await req.json());
  return created(await uploadService.createPresignedUrl(session, input));
});
