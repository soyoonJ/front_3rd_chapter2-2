import { Discount } from '@/types';

import { DiscountInfo } from './DiscountInfo';

interface Props {
  discount: Discount;
  onClick: () => void;
}

export const DiscountInfoEdit = ({ discount, onClick }: Props) => {
  return (
    <div className="flex justify-between items-center mb-2">
      <DiscountInfo discount={discount} />
      <button onClick={onClick} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
        삭제
      </button>
    </div>
  );
};
