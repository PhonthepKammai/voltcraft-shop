import { Cart, Inventory, Product } from "@/models";
import { notFound } from "@/lib/errors";
import type { Session } from "@/lib/session";
import { assertObjectId, round2 } from "@/lib/utils";
import type { AddCartItemInput, UpdateCartItemInput } from "@/validators/cart.schema";

/** ตะกร้าพร้อมราคาปัจจุบัน/สต็อกที่ขายได้ (ราคาในตะกร้าไม่ถูกเก็บ อ่านสดจาก Product เสมอ) */
export async function get(session: Session) {
  const cart = await Cart.findOne({ customerId: session.userId }).lean();
  const rows = cart?.items ?? [];
  const ids = rows.map((i) => i.productId);

  const [products, inventories] = await Promise.all([
    Product.find({ _id: { $in: ids } }).select("name sku price images status").lean(),
    Inventory.find({ productId: { $in: ids } }).lean(),
  ]);
  const pm = new Map(products.map((p) => [String(p._id), p]));
  const im = new Map(inventories.map((i) => [String(i.productId), i]));

  const items = rows.map((r) => {
    const p = pm.get(String(r.productId));
    const inv = im.get(String(r.productId));
    const available = inv ? Math.max(0, inv.onHand - inv.reserved) : 0;
    const unitPrice = p?.price ?? 0;
    return {
      productId: String(r.productId),
      name: p?.name ?? "(สินค้าถูกลบ)",
      sku: p?.sku,
      image: p?.images?.[0],
      quantity: r.quantity,
      unitPrice,
      lineTotal: round2(unitPrice * r.quantity),
      available,
      purchasable: !!p && p.status === "active" && available >= r.quantity,
    };
  });

  return {
    items,
    itemCount: items.reduce((n, i) => n + i.quantity, 0),
    subtotal: round2(items.filter((i) => i.purchasable).reduce((s, i) => s + i.lineTotal, 0)),
  };
}

export async function clear(session: Session) {
  await Cart.updateOne({ customerId: session.userId }, { $set: { items: [] } });
}

export async function addItem(session: Session, input: AddCartItemInput) {
  if (!(await Product.exists({ _id: input.productId, status: "active" }))) {
    throw notFound("ไม่พบสินค้าหรือสินค้าไม่พร้อมจำหน่าย");
  }
  const customerId = session.userId;

  // มีอยู่แล้ว → บวกจำนวน ไม่มี → เพิ่มรายการใหม่
  const res = await Cart.updateOne(
    { customerId, "items.productId": input.productId },
    { $inc: { "items.$.quantity": input.quantity } }
  );
  if (res.matchedCount === 0) {
    await Cart.updateOne(
      { customerId },
      { $push: { items: { productId: input.productId, quantity: input.quantity } } } as never,
      { upsert: true }
    );
  }
  return get(session);
}

export async function updateItem(session: Session, productId: string, input: UpdateCartItemInput) {
  assertObjectId(productId, "product id");
  const res = await Cart.updateOne(
    { customerId: session.userId, "items.productId": productId },
    { $set: { "items.$.quantity": input.quantity } }
  );
  if (res.matchedCount === 0) throw notFound("ไม่พบสินค้านี้ในตะกร้า");
  return get(session);
}

export async function removeItem(session: Session, productId: string) {
  assertObjectId(productId, "product id");
  await Cart.updateOne({ customerId: session.userId }, { $pull: { items: { productId } } } as never);
  return get(session);
}
