import { useState } from 'react';
import { Discount } from '../../../types';

export const useNewDiscount = () => {
  const [newDiscount, setNewDiscount] = useState<Discount>({ quantity: 0, rate: 0 });
  const updateDiscount = (updatedDiscount: Discount) => {
    setNewDiscount(updatedDiscount);
  };
  const addDiscount = () => {
    setNewDiscount({ quantity: 0, rate: 0 });
  };

  return { newDiscount, updateDiscount, addDiscount };
};
