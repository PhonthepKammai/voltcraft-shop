import { badRequest } from "./errors";

export const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

const OID = /^[a-fA-F0-9]{24}$/;

export function assertObjectId(id: string, label = "ID") {
  if (!OID.test(id)) throw badRequest(`${label} ไม่ถูกต้อง`);
  return id;
}

/** ตัด passwordHash/__v ออกก่อนส่งให้ client */
export function toPublicUser<T extends object>(u: T) {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const obj = (typeof (u as any).toObject === "function" ? (u as any).toObject() : u) as Record<string, unknown>;
  const { passwordHash: _p, __v: _v, ...rest } = obj;
  return rest;
}

/** ซ่อนชื่อผู้รีวิว: ส...ข */
export const maskName = (name: string) =>
  name.length <= 2 ? `${name.slice(0, 1)}***` : `${name.slice(0, 1)}***${name.slice(-1)}`;
