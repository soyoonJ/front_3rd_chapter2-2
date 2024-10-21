import { useState } from 'react';
import { AdminActions, Product } from '../../../types';
import { createProductWithId } from '../utils/adminUtils';

export const useNewProduct = (addProduct: AdminActions['addProduct']) => {
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    stock: 0,
    discounts: [],
  });

  const toggleShowNewProductForm = () => {
    setShowNewProductForm((prev) => !prev);
  };

  const updateNewProduct = (
    newProduct: Omit<Product, 'id'>,
    targetKey: keyof Product,
    newValue: Product[keyof Product],
  ) => {
    const updatedProduct = { ...newProduct, [targetKey]: newValue };
    setNewProduct(updatedProduct);
  };

  const handleAddNewProduct = () => {
    const productWithId = createProductWithId(newProduct);
    addProduct(productWithId);
    setNewProduct({
      name: '',
      price: 0,
      stock: 0,
      discounts: [],
    });
    setShowNewProductForm(false);
  };

  return { showNewProductForm, toggleShowNewProductForm, newProduct, updateNewProduct, handleAddNewProduct };
};
