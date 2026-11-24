import type { ClientSession } from "mongoose";
import { AuditLog } from "@/models";
import { pageMeta, skipOf } from "@/lib/pagination";
import type { ListAuditLogsQuery } from "@/validators/audit.schema";

export interface AuditEntry {
  actorId?: string;
  action: string; // เช่น "product.update", "order.cancel"
  entity?: string;
  entityId?: unknown;
  before?: unknown;
  after?: unknown;
  ip?: string;
}

/**
 * บันทึก audit log
 * - อยู่ใน transaction: ถ้าเขียนพัง ให้ throw เพื่อ rollback ทั้งก้อน
 * - อยู่นอก transaction: เขียนพังแค่ log error ไม่ให้งานหลักล้ม
 */
export async function log(entry: AuditEntry, dbSession?: ClientSession) {
  try {
    await AuditLog.create([entry as never], { session: dbSession });
  } catch (err) {
    if (dbSession) throw err;
    console.error("[audit] write failed", err);
  }
}

export async function list(q: ListAuditLogsQuery) {
  const filter: Record<string, unknown> = {};
  if (q.actorId) filter.actorId = q.actorId;
  if (q.entity) filter.entity = q.entity;
  if (q.action) filter.action = q.action;
  if (q.from || q.to) {
    filter.createdAt = {
      ...(q.from && { $gte: q.from }),
      ...(q.to && { $lte: q.to }),
    };
  }

  const [items, total] = await Promise.all([
    AuditLog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skipOf(q.page, q.limit))
      .limit(q.limit)
      .populate("actorId", "name email")
      .lean(),
    AuditLog.countDocuments(filter),
  ]);
  return { items, meta: pageMeta(total, q.page, q.limit) };
}
