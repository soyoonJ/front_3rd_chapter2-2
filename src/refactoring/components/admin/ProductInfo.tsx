import { ChangeEvent } from 'react';
import { Discount, Product } from '../../../types';
import { useAdmin } from '../../hooks';
import { getFormattedValue } from '../../services/admin';
import { formatRateToPercent } from '../../services';

interface Props {
  product: Product;
  index: number;
}

export const ProductInfo = ({ product, index }: Props) => {
  const {
    openProductIds,
    toggleProductAccordion,

    editingProduct,
    handleEditProduct,
    handleEditingProductUpdate,
    handleEditComplete,

    newDiscount,
    updateDiscount,
    handleAddDiscount,
    handleRemoveDiscount,
  } = useAdmin();

  const handleUpdateDiscount = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const formattedValue = getFormattedValue(name as keyof Discount, value);
    updateDiscount({ ...newDiscount, [name]: formattedValue });
  };

  return (
    <div data-testid={`product-${index + 1}`} className="bg-white p-4 rounded shadow">
      <button
        data-testid="toggle-button"
        onClick={() => toggleProductAccordion(product.id)}
        className="w-full text-left font-semibold"
      >
        {product.name} - {product.price}원 (재고: {product.stock})
      </button>

      {openProductIds.has(product.id) && (
        <div className="mt-2">
          {editingProduct && editingProduct.id === product.id ? (
            <div>
              <div className="mb-4">
                <label className="block mb-1">상품명: </label>
                <input
                  type="text"
                  name="name"
                  value={editingProduct.name}
                  onChange={(e) => handleEditingProductUpdate(e, product.id)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">가격: </label>
                <input
                  type="number"
                  name="price"
                  value={editingProduct.price}
                  onChange={(e) => handleEditingProductUpdate(e, product.id)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">재고: </label>
                <input
                  type="number"
                  name="stock"
                  value={editingProduct.stock}
                  onChange={(e) => handleEditingProductUpdate(e, product.id)}
                  className="w-full p-2 border rounded"
                />
              </div>
              {/* 할인 정보 수정 부분 */}
              <div>
                <h4 className="text-lg font-semibold mb-2">할인 정보</h4>
                {editingProduct.discounts.map((discount, index) => (
                  <div key={index} className="flex justify-between items-center mb-2">
                    <span>
                      {discount.quantity}개 이상 구매 시 {formatRateToPercent(discount.rate)}% 할인
                    </span>
                    <button
                      onClick={() => handleRemoveDiscount(product.id, index)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      삭제
                    </button>
                  </div>
                ))}
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="수량"
                    name="quantity"
                    value={newDiscount.quantity}
                    onChange={handleUpdateDiscount}
                    className="w-1/3 p-2 border rounded"
                  />
                  <input
                    type="number"
                    placeholder="할인율 (%)"
                    name="rate"
                    value={formatRateToPercent(newDiscount.rate)}
                    onChange={handleUpdateDiscount}
                    className="w-1/3 p-2 border rounded"
                  />
                  <button
                    onClick={() => handleAddDiscount(product.id)}
                    className="w-1/3 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                  >
                    할인 추가
                  </button>
                </div>
              </div>
              <button
                onClick={handleEditComplete}
                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mt-2"
              >
                수정 완료
              </button>
            </div>
          ) : (
            <div>
              {product.discounts.map((discount, index) => (
                <div key={index} className="mb-2">
                  <span>
                    {discount.quantity}개 이상 구매 시 {formatRateToPercent(discount.rate)}% 할인
                  </span>
                </div>
              ))}
              <button
                data-testid="modify-button"
                onClick={() => handleEditProduct(product)}
                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mt-2"
              >
                수정
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
