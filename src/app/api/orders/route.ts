import { withAuth } from "@/lib/with-auth";
import { ok, created } from "@/lib/response";
import * as orderService from "@/services/order.service";
import { listOrdersQuery, createOrderSchema } from "@/validators/order.schema";

// GET /api/orders  service กรองตาม role:
// customer = ของตัวเอง, sales = ลูกค้าที่ดูแล, warehouse = ที่ต้องแพ็ค/ส่ง, admin = ทั้งหมด
export const GET = withAuth({ permission: "order:read" }, async (req, { session }) => {
  const query = listOrdersQuery.parse(Object.fromEntries(req.nextUrl.searchParams));
  return ok(await orderService.list(session, query));
});

// POST /api/orders  สร้างออเดอร์ (customer สั่งเอง หรือ sales สร้างแทนลูกค้า)
export const POST = withAuth({ permission: "order:create" }, async (req, { session }) => {
  const input = createOrderSchema.parse(await req.json());
  return created(await orderService.create(session, input));
});
