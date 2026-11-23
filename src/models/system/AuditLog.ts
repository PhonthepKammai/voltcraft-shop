import { Schema } from "mongoose";
import { ref, registerModel } from "../_shared/helpers";

const AuditLogSchema = new Schema(
  {
    actorId: { ...ref("User"), index: true },
    action: { type: String, required: true }, // "product.update", "order.cancel"
    entity: String,
    entityId: Schema.Types.ObjectId,
    before: Schema.Types.Mixed,
    after: Schema.Types.Mixed,
    ip: String,
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const AuditLog = registerModel("AuditLog", AuditLogSchema);