import { formatRateToPercent } from '@/refactoring/helpers';
import { Discount } from '@/types';

interface Props {
  discount: Discount;
  onClick: () => void;
}

export const EditDiscountInfo = ({ discount, onClick }: Props) => {
  return (
    <div className="flex justify-between items-center mb-2">
      <span>
        {discount.quantity}개 이상 구매 시 {formatRateToPercent(discount.rate)}% 할인
      </span>
      <button onClick={onClick} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
        삭제
      </button>
    </div>
  );
};
