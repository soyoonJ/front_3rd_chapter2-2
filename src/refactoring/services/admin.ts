import { Discount, Product } from '../../types';

export const updateOpenProductIds = (prevSet: Set<string>, productId: string): Set<string> => {
  const newSet = new Set(prevSet);
  if (newSet.has(productId)) {
    newSet.delete(productId);
  } else {
    newSet.add(productId);
  }
  return newSet;
};

export const getTargetProduct = (products: Product[], targetProductId: string): Product | undefined => {
  return products.find((product) => product.id === targetProductId);
};

export const excludeTargetIndexDiscount = (discounts: Discount[], index: number) => {
  return discounts.filter((_, i) => i !== index);
};

export const createProductWithId = (product: Omit<Product, 'id'>, id = Date.now().toString()) => {
  return { ...product, id };
};
