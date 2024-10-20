import { Product } from '../../../types';

export const updateProduct = <T extends Product | Omit<Product, 'id'>>(
  product: T,
  targetKey: keyof Product,
  newValue: Product[keyof Product],
) => {
  return { ...product, [targetKey]: newValue };
};
