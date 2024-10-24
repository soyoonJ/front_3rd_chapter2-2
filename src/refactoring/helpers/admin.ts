import { Discount, Product } from '@/types';

export const updateOpenProductIds = (prevSet: Set<string>, productId: string): Set<string> => {
  const newSet = new Set(prevSet);
  if (newSet.has(productId)) {
    newSet.delete(productId);
  } else {
    newSet.add(productId);
  }
  return newSet;
};

export const getFormattedValue = (name: keyof Product | keyof Discount, value: string) => {
  if (name === 'rate') {
    return parseInt(value) / 100;
  } else if (name !== 'name') {
    return parseInt(value);
  }
  return value;
};
