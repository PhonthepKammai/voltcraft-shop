import { model, models, Schema} from "mongoose";

export const opts = { timestamps: true } as const;
export const ref = (name: string) => ({
  type: Schema.Types.ObjectId,
  ref: name,
});

export function registerModel<S extends Schema>(name: string, schema: S) {
  type Doc = InferSchemaType<S>;
  return (models[name] as Model<Doc>) || model<Doc>(name, schema);
}