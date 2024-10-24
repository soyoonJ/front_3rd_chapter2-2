import { ChangeEvent } from 'react';

import { formatRateToPercent } from '@/refactoring/helpers';
import { Discount, Product } from '@/types';

import { DiscountInfoEdit } from './DiscountInfoEdit';

interface Props {
  editingProduct: Product;
  onChangeProduct: (e: ChangeEvent<HTMLInputElement>) => void;
  newDiscount: Discount;
  onChangeDiscount: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemoveDiscount: () => void;
  onAddDiscount: () => void;
  onEditComplete: () => void;
}

export const ProductInfoEdit = ({
  editingProduct,
  onChangeProduct,
  newDiscount,
  onChangeDiscount,
  onRemoveDiscount,
  onAddDiscount,
  onEditComplete,
}: Props) => {
  return (
    <div>
      <div className="mb-4">
        <label className="block mb-1">상품명: </label>
        <input
          type="text"
          name="name"
          value={editingProduct.name}
          onChange={onChangeProduct}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">가격: </label>
        <input
          type="number"
          name="price"
          value={editingProduct.price}
          onChange={onChangeProduct}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">재고: </label>
        <input
          type="number"
          name="stock"
          value={editingProduct.stock}
          onChange={onChangeProduct}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <h4 className="text-lg font-semibold mb-2">할인 정보</h4>
        {editingProduct.discounts.map((discount: Discount, index: number) => (
          <DiscountInfoEdit key={index} discount={discount} onClick={onRemoveDiscount} />
        ))}

        <div className="flex space-x-2">
          <input
            type="number"
            placeholder="수량"
            name="quantity"
            value={newDiscount.quantity}
            onChange={onChangeDiscount}
            className="w-1/3 p-2 border rounded"
          />
          <input
            type="number"
            placeholder="할인율 (%)"
            name="rate"
            value={formatRateToPercent(newDiscount.rate)}
            onChange={onChangeDiscount}
            className="w-1/3 p-2 border rounded"
          />
          <button onClick={onAddDiscount} className="w-1/3 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            할인 추가
          </button>
        </div>
      </div>

      <button onClick={onEditComplete} className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mt-2">
        수정 완료
      </button>
    </div>
  );
};
