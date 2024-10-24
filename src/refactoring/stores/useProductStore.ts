import { create } from 'zustand';

import { Product } from '@/types';

import initialProducts from '../data/products.json';

interface ProductState {
  products: Product[];
  addProduct: (newProduct: Product) => void;
  updateProduct: (updatedProduct: Product) => void;
}

export const useProductStore = create<ProductState>()((set) => ({
  products: initialProducts,
  addProduct: (newProduct) => set((state) => ({ products: [...state.products, newProduct] })),
  updateProduct: (updatedProduct) =>
    set((state) => ({ products: state.products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)) })),
}));
