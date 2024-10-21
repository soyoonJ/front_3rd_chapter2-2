import { AdminActions, Coupon, Product } from '../../types.ts';
import { Coupons } from '../components/admin/Coupons.tsx';
import { NewProduct } from '../components/admin/NewProduct.tsx';
import { ProductInfo } from '../components/admin/ProductInfo.tsx';

interface Props {
  products: Product[];
  coupons: Coupon[];
  onProductUpdate: (updatedProduct: Product) => void;
  onProductAdd: (newProduct: Product) => void;
  onCouponAdd: (newCoupon: Coupon) => void;
}

export const AdminPage = ({ products, coupons, onProductUpdate, onProductAdd, onCouponAdd }: Props) => {
  const adminActions: AdminActions = {
    updateProduct: onProductUpdate,
    addProduct: onProductAdd,
    addCoupon: onCouponAdd,
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">관리자 페이지</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">상품 관리</h2>

          <NewProduct addProduct={onProductAdd} />

          <div className="space-y-2">
            {products.map((product, index) => (
              <ProductInfo
                key={product.id}
                product={product}
                index={index}
                products={products}
                adminActions={adminActions}
              />
            ))}
          </div>
        </div>
        <Coupons coupons={coupons} addCoupon={onCouponAdd} />
      </div>
    </div>
  );
};
