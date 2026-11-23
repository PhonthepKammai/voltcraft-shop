// src/app/api/products/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product, Category, Inventory } from "@/models";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const categorySlug = searchParams.get("category");

    // สร้างเงื่อนไข Filter
    const query: Record<string, unknown> = { status: "active" };

    if (search) {
      query.$text = { $search: search }; // ใช้ Text Index ที่ตั้งไว้ใน ProductSchema
    }

    if (categorySlug) {
      const cat = await Category.findOne({ slug: categorySlug });
      if (cat) query.categoryId = cat._id;
    }

    // 1. ดึงสินค้าพร้อมชื่อหมวดหมู่
    const products = await Product.find(query)
      .populate("categoryId", "name slug")
      .sort({ createdAt: -1 })
      .lean();

    // 2. ดึงสต็อกของสินค้าทั้งหมดในหน้านี้มารวม (ลดปัญหา N+1 Query)
    const productIds = products.map((p) => p._id);
    const inventories = await Inventory.find({ productId: { $in: productIds } }).lean();
    const invMap = new Map(inventories.map((inv) => [inv.productId.toString(), inv]));

    // 3. ประกอบร่างส่งกลับไปให้หน้า UI
    const result = products.map((p) => {
      const inv = invMap.get(p._id.toString());
      const available = inv ? Math.max(0, inv.onHand - inv.reserved) : 0;
      return {
        ...p,
        stock: {
          onHand: inv?.onHand ?? 0,
          reserved: inv?.reserved ?? 0,
          available,
        },
      };
    });

    return NextResponse.json({ products: result });
  } catch (error) {
    console.error("GET Products Error:", error);
    return NextResponse.json({ error: "ดึงข้อมูลสินค้าล้มเหลว" }, { status: 500 });
  }
}