import { Category, Product } from "@/models";
import { badRequest, conflict, notFound } from "@/lib/errors";
import { pageMeta, skipOf } from "@/lib/pagination";
import type { Session } from "@/lib/session";
import { assertObjectId } from "@/lib/utils";
import type {
  CreateCategoryInput, ListCategoriesQuery, UpdateCategoryInput,
} from "@/validators/category.schema";
import * as audit from "./audit.service";

export async function list(q: ListCategoriesQuery) {
  const filter: Record<string, unknown> = {};
  if (q.isActive !== "all") filter.isActive = q.isActive === "true";
  if (q.parentId) filter.parentId = q.parentId;

  const [items, total] = await Promise.all([
    Category.find(filter).sort({ name: 1 }).skip(skipOf(q.page, q.limit)).limit(q.limit).lean(),
    Category.countDocuments(filter),
  ]);
  return { items, meta: pageMeta(total, q.page, q.limit) };
}

export async function getById(id: string) {
  assertObjectId(id, "category id");
  const c = await Category.findById(id).lean();
  if (!c) throw notFound("ไม่พบหมวดหมู่");
  return c;
}

/** กันหมวดเป็นลูกของตัวเอง (รวมถึงวนเป็นวงกลมหลายชั้น) */
async function assertNoCycle(id: string | null, parentId: string) {
  let cursor: string | null = parentId;
  for (let depth = 0; cursor && depth < 20; depth++) {
    if (id && cursor === id) throw badRequest("ตั้งหมวดแม่เป็นตัวเองหรือหมวดลูกของตัวเองไม่ได้");
    const parent: { parentId?: unknown } | null = await Category.findById(cursor).select("parentId").lean();
    if (!parent) throw notFound("ไม่พบหมวดแม่");
    cursor = parent.parentId ? String(parent.parentId) : null;
  }
}

export async function create(session: Session, input: CreateCategoryInput) {
  if (input.parentId) await assertNoCycle(null, input.parentId);
  const c = await Category.create(input);
  await audit.log({ actorId: session.userId, action: "category.create", entity: "Category", entityId: c._id, after: input });
  return c;
}

export async function update(session: Session, id: string, input: UpdateCategoryInput) {
  assertObjectId(id, "category id");
  if (input.parentId) await assertNoCycle(id, input.parentId);
  const c = await Category.findByIdAndUpdate(id, { $set: input }, { new: true, runValidators: true }).lean();
  if (!c) throw notFound("ไม่พบหมวดหมู่");
  await audit.log({ actorId: session.userId, action: "category.update", entity: "Category", entityId: id, after: input });
  return c;
}

export async function remove(session: Session, id: string) {
  assertObjectId(id, "category id");
  if (await Category.exists({ parentId: id })) throw conflict("ลบไม่ได้: ยังมีหมวดย่อยอยู่");
  if (await Product.exists({ categoryId: id })) throw conflict("ลบไม่ได้: ยังมีสินค้าในหมวดนี้ (ให้ปิดใช้งานแทน)");
  const res = await Category.deleteOne({ _id: id });
  if (res.deletedCount === 0) throw notFound("ไม่พบหมวดหมู่");
  await audit.log({ actorId: session.userId, action: "category.delete", entity: "Category", entityId: id });
}
