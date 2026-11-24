export const skipOf = (page: number, limit: number) => (page - 1) * limit;

export const pageMeta = (total: number, page: number, limit: number) => ({
  page,
  limit,
  total,
  totalPages: Math.max(1, Math.ceil(total / limit)),
});
