import { Discount } from '../../../../types';
import { formatRateToPercent } from '../../../services';

interface Props {
  discount: Discount;
}

const DiscountInfo = ({ discount }: Props) => {
  return (
    <li>
      {discount.quantity}개 이상: {formatRateToPercent(discount.rate)}% 할인
    </li>
  );
};

export default DiscountInfo;
