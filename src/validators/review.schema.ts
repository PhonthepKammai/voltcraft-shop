import { z } from "zod";
import { objectId, paginationQuery, boolQuery } from "./common";

export const listReviewsQuery = paginationQuery.extend({
  rating: z.coerce.number().int().min(1).max(5).optional(),
  withImages: boolQuery.optional(),
});

export const createReviewSchema = z.object({
  orderId: objectId,
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().max(2000).optional(),
  images: z.array(z.object({ url: z.string().url() })).max(5).default([]),
});

export const moderateReviewSchema = z.object({
  status: z.enum(["published", "hidden"]),
});

export const replyReviewSchema = z.object({
  text: z.string().trim().min(1).max(1000),
});

export type ListReviewsQuery = z.infer<typeof listReviewsQuery>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type ModerateReviewInput = z.infer<typeof moderateReviewSchema>;
export type ReplyReviewInput = z.infer<typeof replyReviewSchema>;
