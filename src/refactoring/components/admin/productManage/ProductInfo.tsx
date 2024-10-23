import { ChangeEvent } from 'react';
import { Discount, Product } from '../../../../types';
import { useAdmin } from '../../../hooks';
import { getFormattedValue } from '../../../services/admin';
import { ProductInfoSummary, ProductInfoDetail, ProductInfoEdit } from '..';

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
      <ProductInfoSummary onClick={() => toggleProductAccordion(product.id)}>
        {product.name} - {product.price}원 (재고: {product.stock})
      </ProductInfoSummary>

      {openProductIds.has(product.id) && (
        <div className="mt-2">
          {editingProduct && editingProduct.id === product.id ? (
            <ProductInfoEdit
              editingProduct={editingProduct}
              onChangeProduct={(e: ChangeEvent<HTMLInputElement>) => handleEditingProductUpdate(e, product.id)}
              newDiscount={newDiscount}
              onChangeDiscount={handleUpdateDiscount}
              onRemoveDiscount={() => handleRemoveDiscount(product.id, index)}
              onAddDiscount={() => handleAddDiscount(product.id)}
              onEditComplete={handleEditComplete}
            />
          ) : (
            <ProductInfoDetail product={product} onEdit={() => handleEditProduct(product)} />
          )}
        </div>
      )}
    </div>
  );
};
