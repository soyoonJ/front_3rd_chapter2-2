import { useState } from 'react';
import { Discount, Product } from '../../../types';
import { getFormattedValue } from '../../helpers';

export const useEditingProduct = () => {
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
    editingProduct,
    updateEditingProduct,
    handleEditingProductUpdate,
  };
};
