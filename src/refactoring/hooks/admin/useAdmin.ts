import { useState } from 'react';
import { Discount, Product } from '../../../types';
import { getFormattedValue, updateOpenProductIds } from '../../services';

export const useAdmin = () => {
  // 상품 상세 토글
  const [openProductIds, setOpenProductIds] = useState<Set<string>>(new Set());
  const toggleProductAccordion = (productId: string) => {
    setOpenProductIds((prev) => updateOpenProductIds(prev, productId));
  };

  // 상품 정보 수정
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const updateEditingProduct = (product: Product | null) => {
    setEditingProduct(product);
  };

  const handleEditingProductUpdate = (e: React.ChangeEvent<HTMLInputElement>, productId: string) => {
    if (!editingProduct || editingProduct.id !== productId) return;

    const { name, value } = e.target;
    const formattedValue = getFormattedValue(name as keyof Product | keyof Discount, value);

    const updatedProduct = { ...editingProduct, [name]: formattedValue };
    setEditingProduct(updatedProduct);
  };

  return {
    openProductIds,
    toggleProductAccordion,

    editingProduct,
    updateEditingProduct,
    handleEditingProductUpdate,
  };
};
