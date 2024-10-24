import { ChangeEvent } from 'react';

import { formatRateToPercent } from '@/refactoring/helpers';
import { Discount, Product } from '@/types';

import { DiscountInfoEdit } from './DiscountInfoEdit';

interface Props {
  editingProduct: Product;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onDiscountRemove: () => void;
  newDiscount: Discount;
  onAddDiscount: () => void;
}

export const DiscountManage = ({ editingProduct, onChange, onDiscountRemove, newDiscount, onAddDiscount }: Props) => {
  return (
    <div>
      <h4 className="text-lg font-semibold mb-2">할인 정보</h4>
      {editingProduct.discounts.map((discount: Discount, index: number) => (
        <DiscountInfoEdit key={index} discount={discount} onClick={onDiscountRemove} />
      ))}
      <div className="flex space-x-2">
        <input
          type="number"
          placeholder="수량"
          name="quantity"
          value={newDiscount.quantity}
          onChange={onChange}
          className="w-1/3 p-2 border rounded"
        />
        <input
          type="number"
          placeholder="할인율 (%)"
          name="rate"
          value={formatRateToPercent(newDiscount.rate)}
          onChange={onChange}
          className="w-1/3 p-2 border rounded"
        />
        <button onClick={onAddDiscount} className="w-1/3 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          할인 추가
        </button>
      </div>
    </div>
  );
};
