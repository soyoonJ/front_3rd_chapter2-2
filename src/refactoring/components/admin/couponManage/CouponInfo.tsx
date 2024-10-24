import { formatCouponDiscountValue } from '@/refactoring/helpers';
import { Coupon } from '@/types';

interface Props {
  coupon: Coupon;
  index: number;
}

export const CouponInfo = ({ coupon, index }: Props) => {
  return (
    <div data-testid={`coupon-${index + 1}`} className="bg-gray-100 p-2 rounded">
      {coupon.name} ({coupon.code}):
      {formatCouponDiscountValue(coupon)} 할인
    </div>
  );
};
