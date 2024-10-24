import { ChangeEvent } from 'react';

import { excludeTargetIndexDiscount, getTargetProduct } from '@/refactoring/helpers';
import { useEditingProduct, useNewDiscount, useOpenProductIds } from '@/refactoring/hooks';
import { useProductStore } from '@/refactoring/stores';
import { Product } from '@/types';

import { ProductInfoDetail, ProductInfoEdit, ProductInfoSummary } from '..';

interface Props {
  product: Product;
  index: number;
}

export const ProductInfo = ({ product, index }: Props) => {
  const products = useProductStore((state) => state.products);
  const updateProduct = useProductStore((state) => state.updateProduct);

  const { openProductIds, toggleProductAccordion } = useOpenProductIds();
  const { editingProduct, updateEditingProduct, handleEditingProductUpdate } = useEditingProduct();
  const { newDiscount, addDiscount, handleUpdateDiscount } = useNewDiscount();

  const handleEditComplete = () => {
    if (!editingProduct) return;

    updateProduct(editingProduct);
    updateEditingProduct(null);
  };
  const handleAddComplete = (productId: string) => {
    const targetProduct = getTargetProduct(products, productId);
    if (!targetProduct || !editingProduct) return;

    const newProduct = { ...targetProduct, discounts: [...targetProduct.discounts, newDiscount] };

    updateEditingProduct(newProduct);
    updateProduct(newProduct);
    addDiscount();
  };
  const handleRemoveDiscount = (productId: string, index: number) => {
    const targetProduct = getTargetProduct(products, productId);
    if (!targetProduct) return;

    const newDiscounts = excludeTargetIndexDiscount(targetProduct.discounts, index);
    const newProduct = { ...targetProduct, discounts: newDiscounts };

    updateProduct(newProduct);
    updateEditingProduct(newProduct);
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
              onAddDiscount={() => handleAddComplete(product.id)}
              onEditComplete={handleEditComplete}
            />
          ) : (
            <ProductInfoDetail product={product} onEdit={() => updateEditingProduct(product)} />
          )}
        </div>
      )}
    </div>
  );
};
