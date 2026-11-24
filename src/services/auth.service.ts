import { User } from "@/models";
import { fakeVerify, hashPassword, verifyPassword } from "@/lib/auth";
import { conflict, forbidden, notFound, unauthorized } from "@/lib/errors";
import { signToken, type Session } from "@/lib/session";
import { toPublicUser } from "@/lib/utils";
import type { LoginInput, RegisterInput } from "@/validators/auth.schema";

/** สมัครสมาชิก: ได้ role customer เสมอ (การเพิ่ม role อื่นทำโดย admin เท่านั้น) */
export async function register(input: RegisterInput) {
  if (await User.exists({ email: input.email })) {
    throw conflict("อีเมลนี้ถูกใช้งานแล้ว");
  }
  const user = await User.create({
    name: input.name,
    email: input.email,
    phone: input.phone,
    passwordHash: await hashPassword(input.password),
    roles: ["customer"],
  });
  return toPublicUser(user);
}

export async function login(input: LoginInput) {
  const user = await User.findOne({ email: input.email }).select("+passwordHash");

  let valid = false;
  if (user) valid = await verifyPassword(input.password, user.passwordHash);
  else await fakeVerify(input.password);

  if (!user || !valid) throw unauthorized("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
  if (user.status !== "active") throw forbidden("บัญชีนี้ถูกระงับ");

  await User.updateOne({ _id: user._id }, { lastLoginAt: new Date() });
  const token = await signToken(String(user._id));
  return { user: toPublicUser(user), token };
}

export async function me(session: Session) {
  const user = await User.findById(session.userId).lean();
  if (!user) throw notFound("ไม่พบผู้ใช้");
  return user;
}
