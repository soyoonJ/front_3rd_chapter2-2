import { AdminActions, Coupon, Product } from '../../types.ts';
import { CouponManage } from '../components/admin/CouponManage.tsx';
import { NewProduct } from '../components/admin/NewProduct.tsx';
import { ProductInfo } from '../components/admin/ProductInfo.tsx';
import { Layout } from '../components/layout/Layout.tsx';

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
    <Layout title="관리자 페이지">
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
      <CouponManage coupons={coupons} addCoupon={onCouponAdd} />
    </Layout>
  );
};
