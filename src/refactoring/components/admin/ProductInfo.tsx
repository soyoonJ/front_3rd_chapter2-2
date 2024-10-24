import { ChangeEvent } from 'react';
import { Discount, Product } from '../../../types';
import { useAdmin } from '../../hooks';
import { getFormattedValue } from '../../helpers/admin';
import { formatRateToPercent } from '../../helpers';
import { EditDiscountInfo } from './EditDiscountInfo';
import { ProductSummary, ProductDetailInfo, DiscountManage } from './';

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
      <ProductSummary onClick={() => toggleProductAccordion(product.id)}>
        {product.name} - {product.price}원 (재고: {product.stock})
      </ProductSummary>

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

              <DiscountManage
                editingProduct={editingProduct}
                onChange={handleUpdateDiscount}
                onDiscountRemove={() => handleRemoveDiscount(product.id, index)}
                newDiscount={newDiscount}
                onAddDiscount={() => handleAddDiscount(product.id)}
              />

              <button
                onClick={handleEditComplete}
                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mt-2"
              >
                수정 완료
              </button>
            </div>
          ) : (
            <ProductDetailInfo product={product} onEdit={() => handleEditProduct(product)} />
          )}
        </div>
      )}
    </div>
  );
};
