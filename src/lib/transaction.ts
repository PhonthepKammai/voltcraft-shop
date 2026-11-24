import mongoose, { type ClientSession } from "mongoose";

/**
 * รันงานใน transaction (ต้องใช้ MongoDB replica set / Atlas)
 * ตอน dev บน MongoDB standalone ให้ตั้ง DISABLE_TRANSACTIONS=true
 * (จะรันโดยไม่มี transaction — ใช้เฉพาะตอนพัฒนา)
 */
export async function runInTransaction<T>(
  fn: (session: ClientSession | undefined) => Promise<T>
): Promise<T> {
  if (process.env.DISABLE_TRANSACTIONS === "true") {
    return fn(undefined);
  }

  const session = await mongoose.startSession();
  try {
    let result!: T;
    await session.withTransaction(async () => {
      result = await fn(session);
    });
    return result;
  } finally {
    await session.endSession();
  }
}
