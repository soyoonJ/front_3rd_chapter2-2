import { CartItemManage, CartSummary, CouponApply, ProductInfo } from '../components/cart';
import { Layout } from '../components/layout';
import { useCart } from '../hooks/index.ts';
import { getRemainingStock } from '../services/cart.ts';
import { useProductStore } from '../stores/useProductStore.ts';

export const CartPage = () => {
  const products = useProductStore((state) => state.products);
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

        <CouponApply applyCoupon={applyCoupon} selectedCoupon={selectedCoupon} />

        <CartSummary cartTotal={calculateTotal()} />
      </div>
    </Layout>
  );
};
