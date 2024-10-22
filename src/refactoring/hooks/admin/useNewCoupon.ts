import { useState } from 'react';
import { Coupon } from '../../../types';

export const useNewCoupon = () => {
  const couponInitialState: Coupon = {
    name: '',
    code: '',
    discountType: 'percentage',
    discountValue: 0,
  };

  const [newCoupon, setNewCoupon] = useState<Coupon>(couponInitialState);

  const updateNewCoupon = (newCoupon: Coupon) => {
    setNewCoupon(newCoupon);
  };

  const initializeNewCoupon = () => {
    setNewCoupon(couponInitialState);
  };

  return { newCoupon, updateNewCoupon, initializeNewCoupon };
};
