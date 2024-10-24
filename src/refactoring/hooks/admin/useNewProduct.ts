import { useState } from 'react';

import { Product } from '@/types';

export const useNewProduct = () => {
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

  const updateNewProduct = (updatedProduct: Omit<Product, 'id'>) => {
    setNewProduct(updatedProduct);
  };

  const initializeNewProduct = () => {
    setNewProduct({
      name: '',
      price: 0,
      stock: 0,
      discounts: [],
    });
    setShowNewProductForm(false);
  };

  return { showNewProductForm, toggleShowNewProductForm, newProduct, updateNewProduct, initializeNewProduct };
};
