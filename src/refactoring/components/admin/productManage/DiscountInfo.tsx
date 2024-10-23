import { Discount } from '../../../../types';
import { formatRateToPercent } from '../../../services';

interface Props {
  discount: Discount;
}
export const DiscountInfo = ({ discount }: Props) => {
  return (
    <div className="mb-2">
      <span>
        {discount.quantity}개 이상 구매 시 {formatRateToPercent(discount.rate)}% 할인
      </span>
    </div>
  );
};
