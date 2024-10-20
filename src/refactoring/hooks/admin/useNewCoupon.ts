import { useState } from 'react';
import { AdminActions, Coupon } from '../../../types';

export const useNewCoupon = (addCoupon: AdminActions['addCoupon']) => {
  // 신규 쿠폰 추가
  const [newCoupon, setNewCoupon] = useState<Coupon>({
    name: '',
    code: '',
    discountType: 'percentage',
    discountValue: 0,
  });

  const updateNewCoupon = (newCoupon: Coupon) => {
    setNewCoupon(newCoupon);
  };

  const handleAddCoupon = () => {
    addCoupon(newCoupon);
    setNewCoupon({
      name: '',
      code: '',
      discountType: 'percentage',
      discountValue: 0,
    });
  };

  return { newCoupon, updateNewCoupon, handleAddCoupon };
};
