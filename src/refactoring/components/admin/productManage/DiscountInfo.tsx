import { formatRateToPercent } from '@/refactoring/utils';
import { Discount } from '@/types';

interface Props {
  discount: Discount;
}
export const DiscountInfo = ({ discount }: Props) => {
  return (
    <span>
      {discount.quantity}개 이상 구매 시 {formatRateToPercent(discount.rate)}% 할인
    </span>
  );
};
