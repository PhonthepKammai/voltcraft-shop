// src/lib/db.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("กรุณาตั้งค่า MONGODB_URI ใน .env.local");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };
global.mongooseCache = cache;

export async function connectDB() {
  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    cache.promise = mongoose
      .connect(MONGODB_URI!, {
        bufferCommands: false, // ไม่ต่อคิวคำสั่งตอนยังไม่เชื่อมต่อ จะได้ error ทันที
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
      })
      .catch((err) => {
        cache.promise = null; // ให้ request ถัดไปลองต่อใหม่ได้
        throw err;
      });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}