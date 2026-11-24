import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

let client: S3Client | null = null;

function s3() {
  if (!client) {
    client = new S3Client({
      region: process.env.S3_REGION ?? "auto",
      endpoint: process.env.S3_ENDPOINT, // ใส่เมื่อใช้ Cloudflare R2 / MinIO
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "",
      },
    });
  }
  return client;
}

const publicBase = () => (process.env.S3_PUBLIC_URL ?? "").replace(/\/$/, "");

export async function createUploadUrl(opts: {
  key: string;
  contentType: string;
  size: number;
  expiresIn?: number;
}) {
  const expiresIn = opts.expiresIn ?? 300;
  const cmd = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: opts.key,
    ContentType: opts.contentType,
    ContentLength: opts.size,
  });
  const uploadUrl = await getSignedUrl(s3(), cmd, { expiresIn });
  return { uploadUrl, fileUrl: `${publicBase()}/${opts.key}`, key: opts.key, expiresIn };
}

/** กันแนบ URL รูปจากเว็บอื่น: ต้องเป็นไฟล์ในที่เก็บของเราเท่านั้น */
export function isOwnFileUrl(url: string) {
  const base = publicBase();
  return base !== "" && url.startsWith(`${base}/`);
}
