import { CartItem, Coupon, Discount } from "../../../types";

const getAppliedDiscount = (discounts: Discount[], quantity: number) => {
	let appliedDiscount = 0;
	for (const discount of discounts) {
		if (quantity >= discount.quantity) {
			appliedDiscount = Math.max(appliedDiscount, discount.rate);
		}
	}

	return appliedDiscount;
};
export const calculateItemTotal = (item: CartItem) => {
	const { price, discounts } = item.product;
	const { quantity } = item;

	const itemTotal = price * quantity;
	const appliedDiscount = getAppliedDiscount(discounts, quantity);

	return itemTotal * (1 - appliedDiscount);
};

export const getMaxApplicableDiscount = (item: CartItem) => {
	return 0;
};

export const calculateCartTotal = (cart: CartItem[], selectedCoupon: Coupon | null) => {
	return {
		totalBeforeDiscount: 0,
		totalAfterDiscount: 0,
		totalDiscount: 0,
	};
};

export const updateCartItemQuantity = (
	cart: CartItem[],
	productId: string,
	newQuantity: number
): CartItem[] => {
	if (newQuantity <= 0) {
		return cart.filter((item) => item.product.id !== productId);
	}

	const productStock = cart.find((item) => item.product.id === productId)?.product.stock || 0;
	newQuantity = Math.min(newQuantity, productStock);

	return cart.map((item) => {
		if (item.product.id === productId) {
			return { ...item, quantity: newQuantity };
		}
		return item;
	});
};
