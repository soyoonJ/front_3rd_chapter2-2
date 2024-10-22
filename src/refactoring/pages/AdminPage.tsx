import { CouponManage, NewProduct, ProductInfo } from '../components/admin';
import { Layout } from '../components/layout';
import { useProductStore } from '../stores/useProductStore.ts';

export const AdminPage = () => {
  const products = useProductStore((state) => state.products);

  return (
    <Layout title="관리자 페이지">
      <div>
        <h2 className="text-2xl font-semibold mb-4">상품 관리</h2>

        <NewProduct />

        <div className="space-y-2">
          {products.map((product, index) => (
            <ProductInfo key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
      <CouponManage />
    </Layout>
  );
};
