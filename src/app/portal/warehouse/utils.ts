import type { FulfillmentOrder } from "./types";

export const getOrderSerialProgress = (order: FulfillmentOrder) => {
  let totalRequired = 0;
  let totalBound = 0;
  order.items.forEach((item) => {
    totalRequired += item.quantity;
    item.boundSerials.forEach((sn) => {
      if (sn && sn.trim().length >= 6) {
        totalBound += 1;
      }
    });
  });
  return {
    totalRequired,
    totalBound,
    isComplete: totalRequired > 0 && totalBound === totalRequired,
  };
};
