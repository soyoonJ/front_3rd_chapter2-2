import { formatCurrency } from '@/refactoring/utils';

interface Props {
  cartTotal: {
    totalBeforeDiscount: number;
    totalDiscount: number;
    totalAfterDiscount: number;
  };
}

export const CartSummary = ({ cartTotal }: Props) => {
  return (
    <div className="mt-6 bg-white p-4 rounded shadow">
      <h2 className="text-2xl font-semibold mb-2">주문 요약</h2>
      <div className="space-y-1">
        <p>상품 금액: {formatCurrency(cartTotal.totalBeforeDiscount)}원</p>
        <p className="text-green-600">할인 금액: {formatCurrency(cartTotal.totalDiscount)}원</p>
        <p className="text-xl font-bold">최종 결제 금액: {formatCurrency(cartTotal.totalAfterDiscount)}원</p>
      </div>
    </div>
  );
};
