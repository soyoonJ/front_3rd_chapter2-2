import { CartItem, Coupon, Product } from '../../types';
import { getMaxApplicableDiscount } from './discount';

export const formatCurrency = (price: number) => {
  return price.toLocaleString();
};

export const getRemainingStock = (cart: CartItem[], product: Product) => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  return product.stock - (cartItem?.quantity || 0);
};

export const updateCartItemQuantity = (cart: CartItem[], productId: string, newQuantity: number): CartItem[] => {
  return cart
    .map((item) => {
      if (item.product.id === productId) {
        const maxQuantity = item.product.stock;
        const updatedQuantity = Math.max(0, Math.min(newQuantity, maxQuantity));
        return updatedQuantity > 0 ? { ...item, quantity: updatedQuantity } : null;
      }
      return item;
    })
    .filter((item): item is CartItem => item !== null);
};

// 상품 가격 및 할인 관련 ========================================================

const getDiscountedPrice = (prevPrice: number, discountRate: number) => prevPrice * (1 - discountRate);
const getTotalPrice = (price: number, quantity: number) => price * quantity;

export const calculateItemTotal = (item: CartItem) => {
  const { price } = item.product;
  const { quantity } = item;

  const maxApplicableDiscount = getMaxApplicableDiscount(item);
  const totalPrice = getTotalPrice(price, quantity);

  return getDiscountedPrice(totalPrice, maxApplicableDiscount);
};
const calculateCouponDiscount = (
  totalAfterDiscount: number,
  totalBeforeDiscount: number,
  selectedCoupon: Coupon | null,
) => {
  if (!selectedCoupon) {
    return {
      updatedTotalAfterDiscount: totalAfterDiscount,
      updatedTotalDiscount: totalBeforeDiscount - totalAfterDiscount,
    };
  }

  let updatedTotalAfterDiscount = totalAfterDiscount;

  if (selectedCoupon.discountType === 'amount') {
    updatedTotalAfterDiscount = Math.max(0, totalAfterDiscount - selectedCoupon.discountValue);
  } else {
    updatedTotalAfterDiscount = getDiscountedPrice(updatedTotalAfterDiscount, selectedCoupon.discountValue / 100);
  }

  let updatedTotalDiscount = totalBeforeDiscount - updatedTotalAfterDiscount;

  return { updatedTotalAfterDiscount, updatedTotalDiscount };
};
export const calculateCartTotal = (cart: CartItem[], selectedCoupon: Coupon | null) => {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;
  let totalDiscount = 0;

  // 총 가격 계산
  totalBeforeDiscount = cart.reduce((acc, item) => acc + getTotalPrice(item.product.price, item.quantity), 0);
  totalAfterDiscount = cart.reduce((acc, item) => acc + calculateItemTotal(item), 0);
  totalDiscount = totalBeforeDiscount - totalAfterDiscount;

  // 쿠폰 업데이트
  const { updatedTotalAfterDiscount, updatedTotalDiscount } = calculateCouponDiscount(
    totalAfterDiscount,
    totalBeforeDiscount,
    selectedCoupon,
  );

  totalAfterDiscount = updatedTotalAfterDiscount;
  totalDiscount = updatedTotalDiscount;

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
    totalDiscount: Math.round(totalDiscount),
  };
};
