import { ChangeEvent } from 'react';

import { useNewCoupon } from '@/refactoring/hooks/admin/useNewCoupon';
import { useCouponStore } from '@/refactoring/stores/useCouponStore';
import { setLocalStorage } from '@/refactoring/utils/localStorage';

import { CouponInfo } from './CouponInfo';

export const CouponManage = () => {
  const coupons = useCouponStore((state) => state.coupons);
  const addCoupon = useCouponStore((state) => state.addCoupon);

  const { newCoupon, updateNewCoupon, initializeNewCoupon } = useNewCoupon();

  const handleAddCoupon = () => {
    addCoupon(newCoupon);
    setLocalStorage('coupons', [...coupons, newCoupon]);
    initializeNewCoupon();
  };
  const handleUpdateNewCoupon = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateNewCoupon({ ...newCoupon, [name]: value });
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">쿠폰 관리</h2>
      <div className="bg-white p-4 rounded shadow">
        <div className="space-y-2 mb-4">
          <input
            type="text"
            placeholder="쿠폰 이름"
            name="name"
            value={newCoupon.name}
            onChange={handleUpdateNewCoupon}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="쿠폰 코드"
            name="code"
            value={newCoupon.code}
            onChange={handleUpdateNewCoupon}
            className="w-full p-2 border rounded"
          />
          <div className="flex gap-2">
            <select
              value={newCoupon.discountType}
              name="discountType"
              onChange={handleUpdateNewCoupon}
              className="w-full p-2 border rounded"
            >
              <option value="amount">금액(원)</option>
              <option value="percentage">할인율(%)</option>
            </select>
            <input
              type="number"
              placeholder="할인 값"
              name="discountValue"
              value={newCoupon.discountValue}
              onChange={handleUpdateNewCoupon}
              className="w-full p-2 border rounded"
            />
          </div>
          <button onClick={handleAddCoupon} className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
            쿠폰 추가
          </button>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">현재 쿠폰 목록</h3>
          <div className="space-y-2">
            {coupons.map((coupon, index) => (
              <CouponInfo key={index} coupon={coupon} index={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
