import { create } from 'zustand';
import { Coupon } from '@/types';
import initialCoupons from '../data/coupons.json';
import { getLocalStorage } from '../utils/localStorage';

interface CouponState {
  coupons: Coupon[];
  addCoupon: (newCoupon: Coupon) => void;
}

export const useCouponStore = create<CouponState>()((set) => ({
  // json에서 string으로 넘어오는 discountType 때문에 타입 단언 필요
  // 실제 initialCoupons 데이터는 Coupon 타입 유지하고 있음
  coupons: getLocalStorage('coupons') || initialCoupons,
  addCoupon: (newCoupon) => set((state) => ({ coupons: [...state.coupons, newCoupon] })),
}));
