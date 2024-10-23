import { Product } from '../../../../types';
import { formatRateToPercent, getMaxDiscount } from '../../../services';
import { AddToCartButton } from './AddToCartButton';
import DiscountInfo from './DiscountInfo';

interface Props {
  product: Product;
  remainingStock: number;
  addToCart: (product: Product) => void;
}

export const ProductInfo = ({ product, remainingStock, addToCart }: Props) => {
  return (
    <div key={product.id} data-testid={`product-${product.id}`} className="bg-white p-3 rounded shadow">
      {/* 가격 정보 */}
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold">{product.name}</span>
        <span className="text-gray-600">{product.price.toLocaleString()}원</span>
      </div>

      {/* 재고/할인 정보 */}
      <div className="text-sm text-gray-500 mb-2">
        <span className={`font-medium ${remainingStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
          재고: {remainingStock}개
        </span>
        {product.discounts.length > 0 && (
          <span className="ml-2 font-medium text-blue-600">
            최대 {formatRateToPercent(getMaxDiscount(product.discounts))}% 할인
          </span>
        )}
      </div>

      {/* 할인 세부 정보 */}
      {product.discounts.length > 0 && (
        <ul className="list-disc list-inside text-sm text-gray-500 mb-2">
          {product.discounts.map((discount, index) => (
            <DiscountInfo key={index} discount={discount} />
          ))}
        </ul>
      )}

      <AddToCartButton onClick={() => addToCart(product)} disabled={remainingStock <= 0}>
        {remainingStock > 0 ? '장바구니에 추가' : '품절'}
      </AddToCartButton>
    </div>
  );
};
