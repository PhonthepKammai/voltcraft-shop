import bcrypt from "bcryptjs";

const ROUNDS = 12;

export const hashPassword = (plain: string) => bcrypt.hash(plain, ROUNDS);

export const verifyPassword = (plain: string, hash: string) =>
  bcrypt.compare(plain, hash);

let dummy: Promise<string> | null = null;

/** เทียบรหัสกับ hash ปลอม เพื่อให้เวลาตอบใกล้เคียงกัน (กันเดาว่าอีเมลมีในระบบหรือไม่) */
export async function fakeVerify(plain: string) {
  dummy ??= bcrypt.hash("dummy-password", ROUNDS);
  await bcrypt.compare(plain, await dummy);
}
