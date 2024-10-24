import { Coupon } from '../../types';

export const formatDiscountValue = (coupon: Coupon) => {
  return coupon.discountType === 'amount' ? `${coupon.discountValue}원` : `${coupon.discountValue}%`;
};
