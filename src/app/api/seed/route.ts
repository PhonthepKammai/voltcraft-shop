// src/app/api/seed/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import {
  User,
  Category,
  Product,
  Inventory,
  StockMovement,
  Cart,
  Order,
  Payment,
  Shipment,
  Coupon,
  CouponRedemption,
  Review,
  Counter,
  AuditLog,
} from "@/models";

export async function POST() {
  try {
    await connectDB();

    // 1. ล้างข้อมูลเก่าทั้งหมดใน 14 Collections
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Inventory.deleteMany({}),
      StockMovement.deleteMany({}),
      Cart.deleteMany({}),
      Order.deleteMany({}),
      Payment.deleteMany({}),
      Shipment.deleteMany({}),
      Coupon.deleteMany({}),
      CouponRedemption.deleteMany({}),
      Review.deleteMany({}),
      Counter.deleteMany({}),
      AuditLog.deleteMany({}),
    ]);

    // 2. สร้างบัญชีผู้ใช้ครบ 4 บทบาท (รหัสผ่านทุกบัญชีคือ: 123456)
    const passwordHash = await bcrypt.hash("123456", 10);

    const [adminUser, salesUser, warehouseUser, customerUser] = await User.insertMany([
      {
        name: "Admin VoltCraft",
        email: "admin@voltcraft.com",
        passwordHash,
        phone: "080-000-0001",
        roles: ["admin"],
        status: "active",
      },
      {
        name: "สมหญิง ฝ่ายขาย",
        email: "sales@voltcraft.com",
        passwordHash,
        phone: "080-000-0002",
        roles: ["sales", "customer"],
        status: "active",
      },
      {
        name: "สมศักดิ์ คลังสินค้า",
        email: "warehouse@voltcraft.com",
        passwordHash,
        phone: "080-000-0003",
        roles: ["warehouse"],
        status: "active",
      },
      {
        name: "ธนกร ลูกค้าประจำ",
        email: "customer@voltcraft.com",
        passwordHash,
        phone: "089-123-4567",
        roles: ["customer"],
        status: "active",
        addresses: [
          {
            label: "บ้าน",
            recipient: "ธนกร รักเทคโนโลยี",
            phone: "089-123-4567",
            line1: "99/12 หมู่บ้านโวลต์วิลล์ ซอยแจ้งวัฒนะ 14",
            subdistrict: "ทุ่งสองห้อง",
            district: "หลักสี่",
            province: "กรุงเทพมหานคร",
            postalCode: "10210",
            isDefault: true,
          },
        ],
      },
    ]);

    await User.findByIdAndUpdate(customerUser._id, { assignedSalesId: salesUser._id });

    // 3. สร้างหมวดหมู่สินค้า
    const [catAC, catTV, catKitchen] = await Category.insertMany([
      { name: "เครื่องปรับอากาศ", slug: "air-conditioner", isActive: true },
      { name: "ทีวีและเครื่องเสียง", slug: "tv-audio", isActive: true },
      { name: "เครื่องใช้ไฟฟ้าในครัว", slug: "kitchen-appliances", isActive: true },
    ]);

    const catInverterAC = await Category.create({
      name: "แอร์อินเวอร์เตอร์ติดผนัง",
      slug: "inverter-wall-ac",
      parentId: catAC._id,
      isActive: true,
    });

    // 4. สร้างสินค้าตัวอย่าง 6 รายการ (พร้อมเงื่อนไข sale หลากหลายรูปแบบ)
    const products = await Product.insertMany([
      {
        sku: "VC-AC-12000",
        name: "VoltCool Inverter Pro 12,000 BTU",
        slug: "voltcool-inverter-pro-12000-btu",
        description: "เครื่องปรับอากาศระบบอินเวอร์เตอร์ ประหยัดไฟเบอร์ 5 พร้อมแผ่นกรองฝุ่น PM 2.5 และสั่งงานผ่าน Wi-Fi",
        categoryId: catInverterAC._id,
        price: 15900,
        // กรณีที่ 1: ลดราคาเป็นบาท (fixed) มีวันเริ่ม-สิ้นสุดชัดเจน (เหลือ 14,400 บาท)
        sale: {
          isActive: true,
          type: "fixed",
          value: 1500,
          startsAt: new Date("2026-01-01"),
          expiresAt: new Date("2027-12-31"),
        },
        images: ["https://placehold.co/600x400/0f172a/f59e0b?text=VoltCool+12000+BTU"],
        attributes: {
          BTU: "12,000 BTU",
          System: "Dual Inverter",
          EnergyRating: "เบอร์ 5 (3 ดาว)",
          Warranty: "คอมเพรสเซอร์ 10 ปี",
        },
        status: "active",
        ratingAvg: 5,
        ratingCount: 1,
      },
      {
        sku: "VC-AC-18000",
        name: "VoltCool Ultra Silent 18,000 BTU",
        slug: "voltcool-ultra-silent-18000-btu",
        description: "แอร์ขนาดใหญ่เย็นเร็วทันใจ เสียงเงียบพิเศษเพียง 19 เดซิเบล เหมาะสำหรับห้องนั่งเล่น",
        categoryId: catInverterAC._id,
        price: 22500,
        // กรณีที่ 2: ไม่ได้เปิดลดราคา (ราคาปกติ)
        sale: {
          isActive: false,
          type: "fixed",
          value: 0,
        },
        images: ["https://placehold.co/600x400/0f172a/f59e0b?text=VoltCool+18000+BTU"],
        attributes: {
          BTU: "18,000 BTU",
          NoiseLevel: "19 dB",
          SmartWifi: "รองรับแอป VoltHome",
        },
        status: "active",
        ratingAvg: 0,
        ratingCount: 0,
      },
      {
        sku: "VC-TV-55QLED",
        name: "VoltVision 4K QLED Smart TV 55 นิ้ว",
        slug: "voltvision-4k-qled-55",
        description: "สมาร์ททีวีจอ QLED สีสันสมจริง รองรับ Dolby Vision และอัตรารีเฟรช 120Hz สำหรับเล่นเกม",
        categoryId: catTV._id,
        price: 18900,
        // กรณีที่ 3: ลดเป็นเปอร์เซ็นต์ (10%) ไม่ระบุวันหมดอายุ (ลดจนกว่าจะปิด) -> เหลือ 17,010 บาท
        sale: {
          isActive: true,
          type: "percent",
          value: 10,
        },
        images: ["https://placehold.co/600x400/0f172a/f59e0b?text=VoltVision+55+QLED"],
        attributes: {
          ScreenSize: "55 นิ้ว",
          Resolution: "3840 x 2160 (4K UHD)",
          RefreshRate: "120Hz",
          OS: "Google TV",
        },
        status: "active",
        ratingAvg: 0,
        ratingCount: 0,
      },
      {
        sku: "VC-TV-65OLED",
        name: "VoltVision Cinema OLED 65 นิ้ว",
        slug: "voltvision-cinema-oled-65",
        description: "ทีวีระดับเรือธง จอ OLED ดำสนิท คอนทราสต์ไร้ขีดจำกัด พร้อมลำโพงรอบทิศทาง 60W",
        categoryId: catTV._id,
        price: 39900,
        // กรณีที่ 4: เปิด isActive: true แต่โปรโมชันหมดอายุไปแล้ว (ทดสอบระบบเช็กวันหมดอายุอัตโนมัติ)
        sale: {
          isActive: true,
          type: "fixed",
          value: 4000,
          startsAt: new Date("2025-01-01"),
          expiresAt: new Date("2025-12-31"),
        },
        images: ["https://placehold.co/600x400/0f172a/f59e0b?text=VoltVision+65+OLED"],
        attributes: {
          ScreenSize: "65 นิ้ว",
          Panel: "OLED Evo",
          Audio: "Dolby Atmos 60W",
        },
        status: "active",
        ratingAvg: 0,
        ratingCount: 0,
      },
      {
        sku: "VC-KT-FRIDGE",
        name: "VoltChill Multi-Door Refrigerator 18 คิว",
        slug: "voltchill-multi-door-18q",
        description: "ตู้เย็น 4 ประตู ระบบกระจายความเย็นรอบทิศทาง ช่องแช่ผักรักษาความชื้นอัตโนมัติ",
        categoryId: catKitchen._id,
        price: 24900,
        sale: {
          isActive: false,
          type: "fixed",
          value: 0,
        },
        images: ["https://placehold.co/600x400/0f172a/f59e0b?text=VoltChill+18Q"],
        attributes: {
          Capacity: "18.2 คิว (515 ลิตร)",
          Doors: "4 ประตู",
          Color: "Black Stainless",
        },
        status: "active",
        ratingAvg: 0,
        ratingCount: 0,
      },
      {
        sku: "VC-KT-AIRFRY",
        name: "VoltChef Smart Air Fryer 6.5L",
        slug: "voltchef-smart-air-fryer-6-5l",
        description: "หม้อทอดไร้น้ำมันความจุใหญ่ 6.5 ลิตร หน้าจอสัมผัส 12 โปรแกรมทำอาหารอัตโนมัติ",
        categoryId: catKitchen._id,
        price: 2990,
        // กรณีที่ 5: ลดเป็นเปอร์เซ็นต์ 15% (เหลือ 2,542 บาท)
        sale: {
          isActive: true,
          type: "percent",
          value: 15,
        },
        images: ["https://placehold.co/600x400/0f172a/f59e0b?text=VoltChef+Air+Fryer"],
        attributes: {
          Capacity: "6.5 ลิตร",
          Power: "1800W",
          Control: "Digital Touch",
        },
        status: "active",
        ratingAvg: 0,
        ratingCount: 0,
      },
    ]);

    // 5. สร้างสต็อกใน Inventory + ประวัติรับเข้าคลังใน StockMovement
    const inventoryList = await Inventory.insertMany(
      products.map((p, idx) => ({
        productId: p._id,
        onHand: idx === 5 ? 3 : 20, // หม้อทอดเหลือ 3 ชิ้น (ต่ำกว่า reorderPoint = 5)
        reserved: idx === 2 ? 1 : 0, // ทีวี 55 นิ้วถูกจอง 1 เครื่องจากออเดอร์รอชำระ
        reorderPoint: 5,
        location: `RACK-B0${idx + 1}`,
      }))
    );

    await StockMovement.insertMany(
      inventoryList.map((inv) => ({
        productId: inv.productId,
        type: "receive",
        quantity: inv.onHand,
        balanceAfter: inv.onHand,
        refType: "supplier",
        note: "รับสินค้าเข้าคลังเริ่มต้น (Initial Seed)",
        createdBy: warehouseUser._id,
      }))
    );

    // 6. สร้างคูปองส่วนลด 2 โค้ด
    const [couponWelcome] = await Coupon.insertMany([
      {
        code: "VOLT500",
        description: "ส่วนลด 500 บาท เมื่อช้อปครบ 5,000 บาท",
        type: "fixed",
        value: 500,
        minOrderAmount: 5000,
        usageLimit: 100,
        usedCount: 1,
        perUserLimit: 1,
        startsAt: new Date("2026-01-01"),
        expiresAt: new Date("2027-12-31"),
        isActive: true,
        createdBy: salesUser._id,
      },
      {
        code: "COOL10",
        description: "ลด 10% สูงสุด 2,000 บาท เฉพาะหมวดเครื่องปรับอากาศ",
        type: "percent",
        value: 10,
        maxDiscount: 2000,
        minOrderAmount: 10000,
        applicableCategoryIds: [catInverterAC._id],
        usageLimit: 50,
        usedCount: 0,
        perUserLimit: 1,
        startsAt: new Date("2026-01-01"),
        expiresAt: new Date("2027-12-31"),
        isActive: true,
        createdBy: salesUser._id,
      },
    ]);

    // 7. สร้างตะกร้าสินค้าปัจจุบันของลูกค้า
    await Cart.create({
      customerId: customerUser._id,
      items: [{ productId: products[5]._id, quantity: 1 }],
    });

    // 8. สร้างตัวอย่างออเดอร์ 2 สถานะ (คำนวณราคาหลังหัก sale ของสินค้าจริง)
    // --- ออเดอร์ที่ 1: Delivered (แอร์ 15,900 ลดโปรสินค้า 1,500 = 14,400 + ใช้คูปอง VOLT500 = 13,900) ---
    const order1 = await Order.create({
      orderNo: "VC-2611-000001",
      customerId: customerUser._id,
      salesId: salesUser._id,
      createdBy: customerUser._id,
      channel: "online",
      items: [
        {
          productId: products[0]._id,
          sku: products[0].sku,
          name: products[0].name,
          unitPrice: 14400, // Snapshot ราคาหลังหักโปรโมชันสินค้า ณ วันที่สั่งซื้อ
          quantity: 1,
          lineTotal: 14400,
        },
      ],
      shippingAddress: {
        recipient: "ธนกร รักเทคโนโลยี",
        phone: "089-123-4567",
        line1: "99/12 หมู่บ้านโวลต์วิลล์ ซอยแจ้งวัฒนะ 14",
        subdistrict: "ทุ่งสองห้อง",
        district: "หลักสี่",
        province: "กรุงเทพมหานคร",
        postalCode: "10210",
      },
      subtotal: 14400,
      coupon: {
        couponId: couponWelcome._id,
        code: "VOLT500",
        discountAmount: 500,
      },
      discount: 500,
      shippingFee: 0,
      tax: 0,
      total: 13900,
      status: "delivered",
      paymentStatus: "paid",
      statusHistory: [
        { status: "pending", by: customerUser._id, note: "สร้างคำสั่งซื้อ" },
        { status: "confirmed", by: salesUser._id, note: "ยืนยันยอดโอนเรียบร้อย" },
        { status: "shipped", by: warehouseUser._id, note: "จัดส่งโดย Flash Express" },
        { status: "delivered", by: warehouseUser._id, note: "ลูกค้าได้รับสินค้าแล้ว" },
      ],
    });

    await Payment.create({
      orderId: order1._id,
      method: "promptpay",
      amount: 13900,
      status: "verified",
      slipUrl: "https://placehold.co/400x600?text=Verified+Slip",
      paidAt: new Date(),
      verifiedBy: salesUser._id,
    });

    await Shipment.create({
      orderId: order1._id,
      carrier: "Flash Express",
      trackingNo: "TH0123456789VC",
      status: "delivered",
      packedBy: warehouseUser._id,
      shippedAt: new Date(),
      deliveredAt: new Date(),
    });

    await CouponRedemption.create({
      couponId: couponWelcome._id,
      userId: customerUser._id,
      orderId: order1._id,
      discountAmount: 500,
    });

    await Review.create({
      productId: products[0]._id,
      customerId: customerUser._id,
      orderId: order1._id,
      rating: 5,
      comment: "แอร์เย็นเร็วมาก เสียงเงียบสุดๆ ค่าไฟลดลงเห็นได้ชัดครับ",
      status: "published",
      reply: {
        text: "ขอบพระคุณคุณธนกรที่ไว้วางใจ VoltCraft ครับ",
        by: salesUser._id,
        at: new Date(),
      },
    });

    // --- ออเดอร์ที่ 2: Pending (ทีวี 18,900 ลด 10% = 17,010 บาท รอฝ่าย Sale ตรวจสลิป) ---
    const order2 = await Order.create({
      orderNo: "VC-2611-000002",
      customerId: customerUser._id,
      salesId: salesUser._id,
      createdBy: customerUser._id,
      channel: "online",
      items: [
        {
          productId: products[2]._id,
          sku: products[2].sku,
          name: products[2].name,
          unitPrice: 17010, // Snapshot ราคาหลังลด 10%
          quantity: 1,
          lineTotal: 17010,
        },
      ],
      shippingAddress: {
        recipient: "ธนกร รักเทคโนโลยี",
        phone: "089-123-4567",
        line1: "99/12 หมู่บ้านโวลต์วิลล์ ซอยแจ้งวัฒนะ 14",
        subdistrict: "ทุ่งสองห้อง",
        district: "หลักสี่",
        province: "กรุงเทพมหานคร",
        postalCode: "10210",
      },
      subtotal: 17010,
      discount: 0,
      shippingFee: 0,
      tax: 0,
      total: 17010,
      status: "pending",
      paymentStatus: "unpaid",
      statusHistory: [{ status: "pending", by: customerUser._id, note: "รอตรวจสอบสลิปโอนเงิน" }],
    });

    await Payment.create({
      orderId: order2._id,
      method: "transfer",
      amount: 17010,
      status: "pending",
      slipUrl: "https://placehold.co/400x600?text=Pending+Slip",
      paidAt: new Date(),
    });

    // 9. ตั้งค่า Counter และ AuditLog เริ่มต้น
    await Counter.create({ key: "order-2611", seq: 2 });

    await AuditLog.create({
      actorId: adminUser._id,
      action: "system.seed",
      entity: "Database",
      after: { message: "Seeded initial 14 collections data with product sales" },
    });

    return NextResponse.json({
      message: "Seed ข้อมูลครบทั้ง 14 Collections สำเร็จ!",
      testAccounts: {
        passwordAll: "123456",
        admin: "admin@voltcraft.com",
        sales: "sales@voltcraft.com",
        warehouse: "warehouse@voltcraft.com",
        customer: "customer@voltcraft.com",
      },
    });
  } catch (error: any) {
    console.error("Seed Error:", error);
    return NextResponse.json(
      { error: "Seed ล้มเหลว", details: error.message },
      { status: 500 }
    );
  }
}