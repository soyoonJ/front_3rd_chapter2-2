import { useState } from 'react';
import { AdminActions, Discount, Product } from '../../../types';
import { excludeTargetIndexDiscount, getTargetProduct, updateOpenProductIds } from '../../services/admin';

export const useAdmin = (products: Product[], adminActions: AdminActions) => {
  // 상품 상세 토글
  const [openProductIds, setOpenProductIds] = useState<Set<string>>(new Set());
  const toggleProductAccordion = (productId: string) => {
    setOpenProductIds((prev) => updateOpenProductIds(prev, productId));
  };

  // 상품 정보 수정
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product });
  };
  const handleEditingProductUpdate = (
    productId: string,
    targetKey: keyof Product,
    newValue: Product[keyof Product],
  ) => {
    if (editingProduct && editingProduct.id === productId) {
      const updatedProduct = { ...editingProduct, [targetKey]: newValue };
      setEditingProduct(updatedProduct);
    }
  };
  const handleEditComplete = () => {
    if (editingProduct) {
      adminActions.updateProduct(editingProduct);
      setEditingProduct(null);
    }
  };

  // 할인 정보 추가/삭제 관련
  const [newDiscount, setNewDiscount] = useState<Discount>({ quantity: 0, rate: 0 });
  const handleAddDiscount = (productId: string) => {
    const targetProduct = getTargetProduct(products, productId);
    if (targetProduct && editingProduct) {
      const newProduct = { ...targetProduct, discounts: [...targetProduct.discounts, newDiscount] };

      adminActions.updateProduct(newProduct);
      setEditingProduct(newProduct);
      setNewDiscount({ quantity: 0, rate: 0 });
    }
  };
  const updateDiscount = (discount: Discount, targetKey: keyof Discount, newValue: Discount[keyof Discount]) => {
    setNewDiscount({ ...discount, [targetKey]: newValue });
  };
  const handleRemoveDiscount = (productId: string, index: number) => {
    const targetProduct = getTargetProduct(products, productId);
    if (targetProduct) {
      const newDiscounts = excludeTargetIndexDiscount(targetProduct.discounts, index);
      const newProduct = { ...targetProduct, discounts: newDiscounts };

      adminActions.updateProduct(newProduct);
      setEditingProduct(newProduct);
    }
  };

  return {
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
  };
};
