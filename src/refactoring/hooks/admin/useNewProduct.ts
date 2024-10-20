import { useState } from 'react';
import { AdminActions, Product } from '../../../types';
import { updateProduct } from '../utils/adminUtils';

export const useNewProduct = (addProduct: AdminActions['addProduct']) => {
  // 새 상품 추가
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    stock: 0,
    discounts: [],
  });
  const updateNewProduct = (
    newProduct: Omit<Product, 'id'>,
    targetKey: keyof Product,
    newValue: Product[keyof Product],
  ) => {
    const updatedProduct = updateProduct(newProduct, targetKey, newValue);
    setNewProduct(updatedProduct);
  };
  const handleAddNewProduct = () => {
    const productWithId = { ...newProduct, id: Date.now().toString() };
    addProduct(productWithId);
    setNewProduct({
      name: '',
      price: 0,
      stock: 0,
      discounts: [],
    });
    setShowNewProductForm(false);
  };

  return { showNewProductForm, setShowNewProductForm, newProduct, updateNewProduct, handleAddNewProduct };
};
