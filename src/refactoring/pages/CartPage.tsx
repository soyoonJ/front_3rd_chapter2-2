import { Coupon, Product } from '../../types.ts';
import { CartItemManage } from '../components/cart/CartItemManage.tsx';
import { ProductInfo } from '../components/cart/ProductInfo.tsx';
import { Layout } from '../components/layout/Layout.tsx';
import { useCart } from '../hooks/index.ts';
import { getRemainingStock } from '../hooks/utils/cartUtils.ts';

interface Props {
  products: Product[];
  coupons: Coupon[];
}

export const CartPage = ({ products, coupons }: Props) => {
  const { cart, addToCart, updateQuantity, removeFromCart, applyCoupon, calculateTotal, selectedCoupon } = useCart();

  const { totalBeforeDiscount, totalAfterDiscount, totalDiscount } = calculateTotal();

  return (
    <Layout title="장바구니">
      <div>
        <h2 className="text-2xl font-semibold mb-4">상품 목록</h2>
        <div className="space-y-2">
          {products.map((product) => {
            const remainingStock = getRemainingStock(cart, product);

            return (
              <ProductInfo
                key={product.id}
                product={product}
                remainingStock={remainingStock}
                onAddToCart={() => addToCart(product)}
              />
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">장바구니 내역</h2>

        <div className="space-y-2">
          {cart.map((item) => {
            return (
              <CartItemManage
                key={item.product.id}
                item={item}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
              />
            );
          })}
        </div>

        <div className="mt-6 bg-white p-4 rounded shadow">
          <h2 className="text-2xl font-semibold mb-2">쿠폰 적용</h2>
          <select
            onChange={(e) => applyCoupon(coupons[parseInt(e.target.value)])}
            className="w-full p-2 border rounded mb-2"
          >
            <option value="">쿠폰 선택</option>
            {coupons.map((coupon, index) => (
              <option key={coupon.code} value={index}>
                {coupon.name} -{' '}
                {coupon.discountType === 'amount' ? `${coupon.discountValue}원` : `${coupon.discountValue}%`}
              </option>
            ))}
          </select>
          {selectedCoupon && (
            <p className="text-green-600">
              적용된 쿠폰: {selectedCoupon.name}(
              {selectedCoupon.discountType === 'amount'
                ? `${selectedCoupon.discountValue}원`
                : `${selectedCoupon.discountValue}%`}{' '}
              할인)
            </p>
          )}
        </div>

        <div className="mt-6 bg-white p-4 rounded shadow">
          <h2 className="text-2xl font-semibold mb-2">주문 요약</h2>
          <div className="space-y-1">
            <p>상품 금액: {totalBeforeDiscount.toLocaleString()}원</p>
            <p className="text-green-600">할인 금액: {totalDiscount.toLocaleString()}원</p>
            <p className="text-xl font-bold">최종 결제 금액: {totalAfterDiscount.toLocaleString()}원</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};
