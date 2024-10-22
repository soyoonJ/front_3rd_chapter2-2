import { CartItem, Discount } from '../../types';

export const formatRateToPercent = (discountRate: number) => {
  return (discountRate * 100).toFixed(0);
};

export const excludeTargetIndexDiscount = (discounts: Discount[], index: number) => {
  return discounts.filter((_, i) => i !== index);
};

export const getMaxDiscount = (discounts: { quantity: number; rate: number }[]) => {
  return discounts.reduce((max, discount) => Math.max(max, discount.rate), 0);
};

export const getMaxApplicableDiscount = (item: CartItem): number => {
  const { discounts } = item.product;
  const { quantity } = item;

  const filteredDiscounts = discounts.filter((discount) => discount.quantity <= quantity);

  return getMaxDiscount(filteredDiscounts);
};
