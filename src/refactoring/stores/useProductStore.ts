import { create } from 'zustand';
import { Product } from '../../types';

interface ProductState {
  products: Product[];
  addProduct: (newProduct: Product) => void;
  updateProduct: (updatedProduct: Product) => void;
}

const initialProducts: Product[] = [
  {
    id: 'p1',
    name: '상품1',
    price: 10000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.1 }],
  },
  {
    id: 'p2',
    name: '상품2',
    price: 20000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.15 }],
  },
  {
    id: 'p3',
    name: '상품3',
    price: 30000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.2 }],
  },
];

export const useProductStore = create<ProductState>()((set) => ({
  products: initialProducts,
  addProduct: (newProduct) => set((state) => ({ products: [...state.products, newProduct] })),
  updateProduct: (updatedProduct) =>
    set((state) => ({ products: state.products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)) })),
}));
