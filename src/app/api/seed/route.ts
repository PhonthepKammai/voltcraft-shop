// src/app/api/seed/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Category, Product, Inventory, Coupon } from "@/models";

export async function POST() {
  try {
    await connectDB();

    // 1. ล้างข้อมูลเก่าเฉพาะกลุ่มสินค้า (กันข้อมูลซ้ำตอนกดรันหลายรอบ)
    await Promise.all([
      Category.deleteMany({}),
      Product.deleteMany({}),
      Inventory.deleteMany({}),
      Coupon.deleteMany({}),
    ]);

    // 2. สร้างหมวดหมู่เครื่องใช้ไฟฟ้า
    const categories = await Category.insertMany([
      { name: "เครื่องปรับอากาศ", slug: "air-conditioner", isActive: true },
      { name: "ทีวีและเครื่องเสียง", slug: "tv-audio", isActive: true },
      { name: "ตู้เย็นและเครื่องซักผ้า", slug: "home-appliances", isActive: true },
    ]);

    // 3. สร้างสินค้าตัวอย่าง
    const productsData = [
      {
        sku: "VC-AC-001",
        name: "VoltCool Inverter Pro 12,000 BTU",
        slug: "voltcool-inverter-pro-12000-btu",
        description: "แอร์อินเวอร์เตอร์ประหยัดไฟเบอร์ 5 พร้อมระบบฟอกอากาศ PM 2.5",
        categoryId: categories[0]._id,
        price: 15900,
        images: ["https://placehold.co/600x400?text=VoltCool+AC"],
        attributes: { BTU: "12,000 BTU", Inverter: "Yes", Warranty: "5 ปี" },
        status: "active",
      },
      {
        sku: "VC-TV-001",
        name: "VoltVision 4K QLED Smart TV 55 นิ้ว",
        slug: "voltvision-4k-qled-55",
        description: "สมาร์ททีวีความละเอียด 4K HDR10+ รองรับสั่งงานด้วยเสียง",
        categoryId: categories[1]._id,
        price: 18500,
        images: ["https://placehold.co/600x400?text=VoltVision+TV"],
        attributes: { ScreenSize: "55 นิ้ว", Resolution: "4K QLED", RefreshRate: "120Hz" },
        status: "active",
      },
      {
        sku: "VC-WM-001",
        name: "VoltWash Front Load 10 kg",
        slug: "voltwash-front-load-10kg",
        description: "เครื่องซักผ้าฝาหน้าซักน้ำร้อน กำจัดแบคทีเรีย 99.9%",
        categoryId: categories[2]._id,
        price: 13900,
        images: ["https://placehold.co/600x400?text=VoltWash+10kg"],
        attributes: { Capacity: "10 kg", Motor: "Direct Drive", SpinSpeed: "1400 RPM" },
        status: "active",
      },
    ];

    const createdProducts = await Product.insertMany(productsData);

    // 4. สร้างสต็อกเริ่มต้นใน Inventory (1-ต่อ-1 กับสินค้า)
    const inventoryDocs = createdProducts.map((p, idx) => ({
      productId: p._id,
      onHand: idx === 2 ? 3 : 15, // ให้ชิ้นที่ 3 เหลือ 3 ชิ้น (ต่ำกว่า reorderPoint เพื่อโชว์แจ้งเตือน)
      reserved: 0,
      reorderPoint: 5,
      location: `ZONE-A0${idx + 1}`,
    }));
    await Inventory.insertMany(inventoryDocs);

    // 5. สร้างคูปองตัวอย่าง
    await Coupon.create({
      code: "VOLT500",
      description: "ส่วนลดต้อนรับสมาชิกใหม่ 500 บาท",
      type: "fixed",
      value: 500,
      minOrderAmount: 5000,
      startsAt: new Date("2026-01-01"),
      expiresAt: new Date("2027-12-31"),
      isActive: true,
    });

    return NextResponse.json({
      message: "Seed ข้อมูลสำเร็จ!",
      counts: {
        categories: categories.length,
        products: createdProducts.length,
        inventories: inventoryDocs.length,
      },
    });
  } catch (error) {
    console.error("Seed Error:", error);
    return NextResponse.json({ error: "Seed ล้มเหลว" }, { status: 500 });
  }
}