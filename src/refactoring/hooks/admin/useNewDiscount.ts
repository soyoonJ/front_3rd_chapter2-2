import { ChangeEvent, useState } from 'react';
import { Discount } from '../../../types';
import { getFormattedValue } from '../../helpers';

export const useNewDiscount = () => {
  const [newDiscount, setNewDiscount] = useState<Discount>({ quantity: 0, rate: 0 });
  const updateDiscount = (updatedDiscount: Discount) => {
    setNewDiscount(updatedDiscount);
  };
  const addDiscount = () => {
    setNewDiscount({ quantity: 0, rate: 0 });
  };

  const handleUpdateDiscount = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const formattedValue = getFormattedValue(name as keyof Discount, value);
    updateDiscount({ ...newDiscount, [name]: formattedValue });
  };

  return { newDiscount, updateDiscount, addDiscount, handleUpdateDiscount };
};
