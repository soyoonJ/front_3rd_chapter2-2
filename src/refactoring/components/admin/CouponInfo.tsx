import { Coupon } from '../../../types';
import { formatDiscountValue } from '../../services';

interface Props {
  coupon: Coupon;
  index: number;
}

export const CouponInfo = ({ coupon, index }: Props) => {
  return (
    <div data-testid={`coupon-${index + 1}`} className="bg-gray-100 p-2 rounded">
      {coupon.name} ({coupon.code}):
      {formatDiscountValue(coupon)} 할인
    </div>
  );
};
