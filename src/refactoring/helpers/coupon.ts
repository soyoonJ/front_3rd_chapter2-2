import { Coupon } from '@/types';

export const formatCouponDiscountValue = (coupon: Coupon) => {
  return coupon.discountType === 'amount' ? `${coupon.discountValue}원` : `${coupon.discountValue}%`;
};
