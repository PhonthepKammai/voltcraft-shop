import { User, Order } from "@/models";
import { hashPassword } from "@/lib/auth";
import { badRequest, conflict, forbidden, notFound } from "@/lib/errors";
import { pageMeta, skipOf } from "@/lib/pagination";
import { hasRole, isAdmin } from "@/lib/rbac";
import type { Session } from "@/lib/session";
import { assertObjectId, escapeRegex, toPublicUser } from "@/lib/utils";
import type {
  AddressInput, CreateUserInput, ListUsersQuery, UpdateProfileInput, UpdateUserInput,
} from "@/validators/user.schema";
import * as audit from "./audit.service";

/* ───────── admin: จัดการผู้ใช้ ───────── */

export async function list(q: ListUsersQuery) {
  const filter: Record<string, unknown> = {};
  if (q.role) filter.roles = q.role;
  if (q.status) filter.status = q.status;
  if (q.q) {
    const re = new RegExp(escapeRegex(q.q), "i");
    filter.$or = [{ name: re }, { email: re }];
  }
  const [items, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skipOf(q.page, q.limit)).limit(q.limit).lean(),
    User.countDocuments(filter),
  ]);
  return { items, meta: pageMeta(total, q.page, q.limit) };
}

async function assertSalesUser(id: string) {
  const sales = await User.findById(id).select("roles").lean();
  if (!sales || !sales.roles.includes("sales")) {
    throw badRequest("assignedSalesId ต้องเป็นผู้ใช้ที่มี role sales");
  }
}

export async function create(session: Session, input: CreateUserInput) {
  if (await User.exists({ email: input.email })) throw conflict("อีเมลนี้ถูกใช้งานแล้ว");
  if (input.assignedSalesId) await assertSalesUser(input.assignedSalesId);

  const { password, ...rest } = input;
  const user = await User.create({ ...rest, passwordHash: await hashPassword(password) });

  await audit.log({
    actorId: session.userId, action: "user.create", entity: "User", entityId: user._id,
    after: { email: user.email, roles: user.roles },
  });
  return toPublicUser(user);
}

export async function getById(session: Session, id: string) {
  assertObjectId(id, "user id");
  const user = await User.findById(id).lean();
  if (!user) throw notFound("ไม่พบผู้ใช้");

  if (!isAdmin(session) && id !== session.userId) {
    // sales ดูได้เฉพาะลูกค้าที่ตัวเองดูแล
    const mine = hasRole(session, "sales") && String(user.assignedSalesId) === session.userId;
    if (!mine) throw forbidden();
  }
  return user;
}

/** ต้องเหลือ admin ที่ active อย่างน้อย 1 คนเสมอ */
async function assertAnotherAdminExists(excludeId: string) {
  const others = await User.countDocuments({ roles: "admin", status: "active", _id: { $ne: excludeId } });
  if (others === 0) throw badRequest("ต้องมีผู้ดูแลระบบ (admin) ที่ใช้งานอยู่อย่างน้อย 1 คน");
}

export async function update(session: Session, id: string, input: UpdateUserInput) {
  assertObjectId(id, "user id");
  const target = await User.findById(id).lean();
  if (!target) throw notFound("ไม่พบผู้ใช้");

  const losesAdmin =
    target.roles.includes("admin") &&
    ((input.roles && !input.roles.includes("admin")) || input.status === "suspended");
  if (losesAdmin) await assertAnotherAdminExists(id);

  if (input.assignedSalesId) await assertSalesUser(input.assignedSalesId);

  const updated = await User.findByIdAndUpdate(id, { $set: input }, { new: true, runValidators: true }).lean();

  await audit.log({
    actorId: session.userId, action: "user.update", entity: "User", entityId: id,
    before: { roles: target.roles, status: target.status },
    after: { roles: updated?.roles, status: updated?.status },
  });
  return updated;
}

export async function remove(session: Session, id: string) {
  assertObjectId(id, "user id");
  if (id === session.userId) throw badRequest("ลบบัญชีตัวเองไม่ได้");

  const target = await User.findById(id).lean();
  if (!target) throw notFound("ไม่พบผู้ใช้");
  if (target.roles.includes("admin")) await assertAnotherAdminExists(id);

  if (await Order.exists({ $or: [{ customerId: id }, { salesId: id }, { createdBy: id }] })) {
    throw conflict("ผู้ใช้นี้มีประวัติออเดอร์ ให้ระงับบัญชี (status: suspended) แทนการลบ");
  }
  await User.deleteOne({ _id: id });
  await audit.log({
    actorId: session.userId, action: "user.delete", entity: "User", entityId: id,
    before: { email: target.email, roles: target.roles },
  });
}

/* ───────── โปรไฟล์ตัวเอง ───────── */

export async function getProfile(session: Session) {
  const user = await User.findById(session.userId).lean();
  if (!user) throw notFound("ไม่พบผู้ใช้");
  return user;
}

export async function updateProfile(session: Session, input: UpdateProfileInput) {
  const user = await User.findByIdAndUpdate(session.userId, { $set: input }, { new: true, runValidators: true }).lean();
  if (!user) throw notFound("ไม่พบผู้ใช้");
  return user;
}

/* ───────── ที่อยู่จัดส่ง ───────── */

async function loadUserDoc(userId: string) {
  const user = await User.findById(userId);
  if (!user) throw notFound("ไม่พบผู้ใช้");
  return user;
}

export async function listAddresses(session: Session) {
  return (await loadUserDoc(session.userId)).addresses;
}

export async function addAddress(session: Session, input: AddressInput) {
  const user = await loadUserDoc(session.userId);
  const makeDefault = !!input.isDefault || user.addresses.length === 0;
  if (makeDefault) user.addresses.forEach((a) => { a.isDefault = false; });
  user.addresses.push({ ...input, isDefault: makeDefault });
  await user.save();
  return user.addresses;
}

export async function updateAddress(session: Session, addressId: string, input: Partial<AddressInput>) {
  assertObjectId(addressId, "address id");
  const user = await loadUserDoc(session.userId);
  const addr = user.addresses.id(addressId);
  if (!addr) throw notFound("ไม่พบที่อยู่");

  if (input.isDefault) user.addresses.forEach((a) => { a.isDefault = false; });
  addr.set(input);
  await user.save();
  return user.addresses;
}

export async function removeAddress(session: Session, addressId: string) {
  assertObjectId(addressId, "address id");
  const user = await loadUserDoc(session.userId);
  const addr = user.addresses.id(addressId);
  if (!addr) throw notFound("ไม่พบที่อยู่");

  const wasDefault = addr.isDefault;
  addr.deleteOne();
  if (wasDefault && user.addresses.length > 0) user.addresses[0].isDefault = true;
  await user.save();
}
