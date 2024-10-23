import { Product } from '../../../../types';
import { DiscountInfo } from '..';

interface Props {
  product: Product;
  onEdit: () => void;
}

export const ProductInfoDetail = ({ product, onEdit }: Props) => {
  return (
    <div>
      {product.discounts.map((discount, index) => (
        <DiscountInfo key={index} discount={discount} />
      ))}
      <button
        data-testid="modify-button"
        onClick={onEdit}
        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mt-2"
      >
        수정
      </button>
    </div>
  );
};
