import { CartItem, Coupon, Discount } from "../../../types";

const getTotalPrice = (price: number, quantity: number) => price * quantity;
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

	const appliedDiscount = getAppliedDiscount(discounts, quantity);

	return getTotalPrice(price, quantity) * (1 - appliedDiscount);
};

export const getMaxApplicableDiscount = (item: CartItem) => {
	const { discounts } = item.product;
	const { quantity } = item;

	const filteredDiscounts = discounts.filter((discount) => discount.quantity <= quantity);
	const maxDiscount = filteredDiscounts.reduce((max, discount) => Math.max(max, discount.rate), 0);

	return maxDiscount;
};

export const calculateCartTotal = (cart: CartItem[], selectedCoupon: Coupon | null) => {
	let totalBeforeDiscount = 0;
	let totalAfterDiscount = 0;
	let totalDiscount = 0;

	totalBeforeDiscount = cart.reduce(
		(acc, item) => acc + getTotalPrice(item.product.price, item.quantity),
		0
	);
	totalAfterDiscount = cart.reduce((acc, item) => acc + calculateItemTotal(item), 0);
	totalDiscount = totalBeforeDiscount - totalAfterDiscount;

	if (selectedCoupon) {
		if (selectedCoupon.discountType === "amount") {
			totalAfterDiscount = Math.max(0, totalAfterDiscount - selectedCoupon.discountValue);
		} else {
			totalAfterDiscount *= 1 - selectedCoupon.discountValue / 100;
		}
		totalDiscount = totalBeforeDiscount - totalAfterDiscount;
	}

	return {
		totalBeforeDiscount,
		totalAfterDiscount,
		totalDiscount,
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
