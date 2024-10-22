import { Product } from '../../types';

export const createProductWithId = (product: Omit<Product, 'id'>, id = Date.now().toString()) => {
  return { ...product, id };
};

export const getTargetProduct = (products: Product[], targetProductId: string): Product | undefined => {
  return products.find((product) => product.id === targetProductId);
};
