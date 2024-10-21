import { Coupon, Product } from '../../types.ts';
import { CartItemManage } from '../components/cart/CartItemManage.tsx';
import { CartSummary } from '../components/cart/CartSummary.tsx';
import { CouponApply } from '../components/cart/CouponApply.tsx';
import { ProductInfo } from '../components/cart/ProductInfo.tsx';
import { Layout } from '../components/layout/Layout.tsx';
import { useCart } from '../hooks/index.ts';
import { getRemainingStock } from '../services/cart.ts';

interface Props {
  products: Product[];
  coupons: Coupon[];
}

export const CartPage = ({ products, coupons }: Props) => {
  const { cart, addToCart, updateQuantity, removeFromCart, applyCoupon, selectedCoupon, calculateTotal } = useCart();

  return (
    <Layout title="장바구니">
      <div>
        <h2 className="text-2xl font-semibold mb-4">상품 목록</h2>
        <div className="space-y-2">
          {products.map((product) => {
            const remainingStock = getRemainingStock(cart, product);

            return (
              <ProductInfo key={product.id} product={product} remainingStock={remainingStock} addToCart={addToCart} />
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

        <CouponApply coupons={coupons} applyCoupon={applyCoupon} selectedCoupon={selectedCoupon} />

        <CartSummary cartTotal={calculateTotal()} />
      </div>
    </Layout>
  );
};
