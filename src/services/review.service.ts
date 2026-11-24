import mongoose from "mongoose";
import { Order, Product, Review } from "@/models";
import { badRequest, forbidden, notFound } from "@/lib/errors";
import { pageMeta, skipOf } from "@/lib/pagination";
import { isAdmin } from "@/lib/rbac";
import type { Session } from "@/lib/session";
import { isOwnFileUrl } from "@/lib/storage";
import { assertObjectId, maskName, round2 } from "@/lib/utils";
import type {
  CreateReviewInput, ListReviewsQuery, ModerateReviewInput, ReplyReviewInput,
} from "@/validators/review.schema";
import * as audit from "./audit.service";

/** คำนวณ ratingAvg/ratingCount ของสินค้าใหม่จากรีวิวที่ published */
async function recalcProductRating(productId: unknown) {
  const pid = new mongoose.Types.ObjectId(String(productId));
  const [agg] = await Review.aggregate<{ avg: number; count: number }>([
    { $match: { productId: pid, status: "published" } },
    { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
  await Product.updateOne(
    { _id: pid },
    { ratingAvg: agg ? round2(agg.avg) : 0, ratingCount: agg?.count ?? 0 }
  );
}

export async function listByProduct(productId: string, q: ListReviewsQuery) {
  assertObjectId(productId, "product id");
  const filter: Record<string, unknown> = { productId, status: "published" };
  if (q.rating) filter.rating = q.rating;
  if (q.withImages) filter["images.0"] = { $exists: true };

  const [rows, total] = await Promise.all([
    Review.find(filter)
      .sort({ createdAt: -1 })
      .skip(skipOf(q.page, q.limit))
      .limit(q.limit)
      .populate<{ customerId: { name: string } | null }>("customerId", "name")
      .select("-orderId")
      .lean(),
    Review.countDocuments(filter),
  ]);

  const items = rows.map(({ customerId, ...r }) => ({
    ...r,
    reviewer: customerId ? maskName(customerId.name) : "ผู้ใช้",
  }));
  return { items, meta: pageMeta(total, q.page, q.limit) };
}

export async function create(session: Session, productId: string, input: CreateReviewInput) {
  assertObjectId(productId, "product id");

  // ต้องเป็นออเดอร์ของตัวเอง, ส่งถึงแล้ว, และมีสินค้านี้อยู่ในออเดอร์
  const order = await Order.findOne({
    _id: input.orderId,
    customerId: session.userId,
    status: "delivered",
    "items.productId": productId,
  }).select("_id").lean();
  if (!order) throw forbidden("รีวิวได้เฉพาะสินค้าที่คุณสั่งซื้อและได้รับแล้ว");

  if (input.images.some((i) => !isOwnFileUrl(i.url))) {
    throw badRequest("รูปภาพต้องอัปโหลดผ่านระบบ (POST /api/uploads) เท่านั้น");
  }

  // unique index (customerId+productId+orderId) กันรีวิวซ้ำ → 409
  const review = await Review.create({
    productId, customerId: session.userId, orderId: input.orderId,
    rating: input.rating, comment: input.comment, images: input.images,
  });
  await recalcProductRating(productId);
  return review;
}

export async function moderate(session: Session, id: string, input: ModerateReviewInput) {
  assertObjectId(id, "review id");
  const review = await Review.findByIdAndUpdate(id, { status: input.status }, { new: true }).lean();
  if (!review) throw notFound("ไม่พบรีวิว");
  await recalcProductRating(review.productId);
  await audit.log({
    actorId: session.userId, action: `review.${input.status}`, entity: "Review", entityId: id,
  });
  return review;
}

export async function reply(session: Session, id: string, input: ReplyReviewInput) {
  assertObjectId(id, "review id");
  const review = await Review.findByIdAndUpdate(
    id,
    { reply: { text: input.text, by: session.userId, at: new Date() } },
    { new: true }
  ).lean();
  if (!review) throw notFound("ไม่พบรีวิว");
  return review;
}

/** admin ลบได้ทุกรีวิว, customer ลบได้เฉพาะของตัวเอง */
export async function remove(session: Session, id: string) {
  assertObjectId(id, "review id");
  const review = await Review.findById(id).lean();
  if (!review) throw notFound("ไม่พบรีวิว");
  if (!isAdmin(session) && String(review.customerId) !== session.userId) throw forbidden();

  await Review.deleteOne({ _id: id });
  await recalcProductRating(review.productId);
  await audit.log({ actorId: session.userId, action: "review.delete", entity: "Review", entityId: id });
}
