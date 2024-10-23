import { ChangeEvent } from 'react';
import { Discount, Product } from '../../../../types';
import { useAdmin, useNewDiscount } from '../../../hooks';
import { getFormattedValue } from '../../../services/admin';
import { ProductInfoSummary, ProductInfoDetail, ProductInfoEdit } from '..';
import { useProductStore } from '../../../stores';
import { excludeTargetIndexDiscount, getTargetProduct } from '../../../services';

interface Props {
  product: Product;
  index: number;
}

export const ProductInfo = ({ product, index }: Props) => {
  const products = useProductStore((state) => state.products);
  const updateProduct = useProductStore((state) => state.updateProduct);

  const { newDiscount, updateDiscount, addDiscount } = useNewDiscount();
  const {
    openProductIds,
    toggleProductAccordion,

    editingProduct,
    updateEditingProduct,
    handleEditingProductUpdate,
  } = useAdmin();

  const handleUpdateDiscount = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const formattedValue = getFormattedValue(name as keyof Discount, value);
    updateDiscount({ ...newDiscount, [name]: formattedValue });
  };
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
