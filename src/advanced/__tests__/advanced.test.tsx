import { describe, expect, test } from 'vitest';
import { act, fireEvent, render, renderHook, screen, within } from '@testing-library/react';
import { AdminPage, CartPage } from '../../refactoring/pages';
import { CartItem, Coupon, Product } from '../../types';
import {
  createProductWithId,
  excludeTargetIndexDiscount,
  getFormattedValue,
  getTargetProduct,
  updateOpenProductIds,
  calculateCartTotal,
  calculateItemTotal,
  formatCurrency,
  getMaxApplicableDiscount,
  getRemainingStock,
  updateCartItemQuantity,
  formatDiscountValue,
  formatRateToPercent,
} from '../../refactoring/helpers';
import { useCouponStore, useProductStore } from '../../refactoring/stores';
import { useAdmin, useNewCoupon, useNewDiscount, useNewProduct } from '../../refactoring/hooks';

const mockProducts: Product[] = [
  {
    id: 'p1',
    name: '상품1',
    price: 10000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.1 }],
  },
  {
    id: 'p2',
    name: '상품2',
    price: 20000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.15 }],
  },
  {
    id: 'p3',
    name: '상품3',
    price: 30000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.2 }],
  },
];
const mockCoupons: Coupon[] = [
  {
    name: '5000원 할인 쿠폰',
    code: 'AMOUNT5000',
    discountType: 'amount',
    discountValue: 5000,
  },
  {
    name: '10% 할인 쿠폰',
    code: 'PERCENT10',
    discountType: 'percentage',
    discountValue: 10,
  },
];
const mockCart: CartItem[] = [
  {
    product: {
      id: '1',
      name: 'product1',
      price: 10000,
      stock: 20,
      discounts: [
        { quantity: 10, rate: 0.1 },
        { quantity: 20, rate: 0.2 },
        { quantity: 30, rate: 0.3 },
      ],
    },
    quantity: 40,
  },
  { product: { id: '2', name: 'product2', price: 20000, stock: 20, discounts: [] }, quantity: 10 },
];

const TestAdminPage = () => {
  return <AdminPage />;
};

describe('advanced > ', () => {
  useCouponStore.setState({ coupons: mockCoupons });
  useProductStore.setState({ products: mockProducts });

  describe('시나리오 테스트 > ', () => {
    test('장바구니 페이지 테스트 > ', async () => {
      render(<CartPage />);
      const product1 = screen.getByTestId('product-p1');
      const product2 = screen.getByTestId('product-p2');
      const product3 = screen.getByTestId('product-p3');
      const addToCartButtonsAtProduct1 = within(product1).getByText('장바구니에 추가');
      const addToCartButtonsAtProduct2 = within(product2).getByText('장바구니에 추가');
      const addToCartButtonsAtProduct3 = within(product3).getByText('장바구니에 추가');

      // 1. 상품 정보 표시
      expect(product1).toHaveTextContent('상품1');
      expect(product1).toHaveTextContent('10,000원');
      expect(product1).toHaveTextContent('재고: 20개');
      expect(product2).toHaveTextContent('상품2');
      expect(product2).toHaveTextContent('20,000원');
      expect(product2).toHaveTextContent('재고: 20개');
      expect(product3).toHaveTextContent('상품3');
      expect(product3).toHaveTextContent('30,000원');
      expect(product3).toHaveTextContent('재고: 20개');

      // 2. 할인 정보 표시
      expect(screen.getByText('10개 이상: 10% 할인')).toBeInTheDocument();

      // 3. 상품1 장바구니에 상품 추가
      fireEvent.click(addToCartButtonsAtProduct1); // 상품1 추가

      // 4. 할인율 계산
      expect(screen.getByText('상품 금액: 10,000원')).toBeInTheDocument();
      expect(screen.getByText('할인 금액: 0원')).toBeInTheDocument();
      expect(screen.getByText('최종 결제 금액: 10,000원')).toBeInTheDocument();

      // 5. 상품 품절 상태로 만들기
      for (let i = 0; i < 19; i++) {
        fireEvent.click(addToCartButtonsAtProduct1);
      }

      // 6. 품절일 때 상품 추가 안 되는지 확인하기
      expect(product1).toHaveTextContent('재고: 0개');
      fireEvent.click(addToCartButtonsAtProduct1);
      expect(product1).toHaveTextContent('재고: 0개');

      // 7. 할인율 계산
      expect(screen.getByText('상품 금액: 200,000원')).toBeInTheDocument();
      expect(screen.getByText('할인 금액: 20,000원')).toBeInTheDocument();
      expect(screen.getByText('최종 결제 금액: 180,000원')).toBeInTheDocument();

      // 8. 상품을 각각 10개씩 추가하기
      fireEvent.click(addToCartButtonsAtProduct2); // 상품2 추가
      fireEvent.click(addToCartButtonsAtProduct3); // 상품3 추가

      const increaseButtons = screen.getAllByText('+');
      for (let i = 0; i < 9; i++) {
        fireEvent.click(increaseButtons[1]); // 상품2
        fireEvent.click(increaseButtons[2]); // 상품3
      }

      // 9. 할인율 계산
      expect(screen.getByText('상품 금액: 700,000원')).toBeInTheDocument();
      expect(screen.getByText('할인 금액: 110,000원')).toBeInTheDocument();
      expect(screen.getByText('최종 결제 금액: 590,000원')).toBeInTheDocument();

      // 10. 쿠폰 적용하기
      const couponSelect = screen.getByRole('combobox');
      fireEvent.change(couponSelect, { target: { value: '1' } }); // 10% 할인 쿠폰 선택

      // 11. 할인율 계산
      expect(screen.getByText('상품 금액: 700,000원')).toBeInTheDocument();
      expect(screen.getByText('할인 금액: 169,000원')).toBeInTheDocument();
      expect(screen.getByText('최종 결제 금액: 531,000원')).toBeInTheDocument();

      // 12. 다른 할인 쿠폰 적용하기
      fireEvent.change(couponSelect, { target: { value: '0' } }); // 5000원 할인 쿠폰
      expect(screen.getByText('상품 금액: 700,000원')).toBeInTheDocument();
      expect(screen.getByText('할인 금액: 115,000원')).toBeInTheDocument();
      expect(screen.getByText('최종 결제 금액: 585,000원')).toBeInTheDocument();
    });

    test('관리자 페이지 테스트 > ', async () => {
      render(<TestAdminPage />);

      const $product1 = screen.getByTestId('product-1');

      // 1. 새로운 상품 추가
      fireEvent.click(screen.getByText('새 상품 추가'));

      fireEvent.change(screen.getByLabelText('상품명'), { target: { value: '상품4' } });
      fireEvent.change(screen.getByLabelText('가격'), { target: { value: '15000' } });
      fireEvent.change(screen.getByLabelText('재고'), { target: { value: '30' } });

      fireEvent.click(screen.getByText('추가'));

      const $product4 = screen.getByTestId('product-4');

      expect($product4).toHaveTextContent('상품4');
      expect($product4).toHaveTextContent('15000원');
      expect($product4).toHaveTextContent('재고: 30');

      // 2. 상품 선택 및 수정
      fireEvent.click($product1);
      fireEvent.click(within($product1).getByTestId('toggle-button'));
      fireEvent.click(within($product1).getByTestId('modify-button'));

      act(() => {
        fireEvent.change(within($product1).getByDisplayValue('20'), { target: { value: '25' } });
        fireEvent.change(within($product1).getByDisplayValue('10000'), { target: { value: '12000' } });
        fireEvent.change(within($product1).getByDisplayValue('상품1'), { target: { value: '수정된 상품1' } });
      });

      fireEvent.click(within($product1).getByText('수정 완료'));

      expect($product1).toHaveTextContent('수정된 상품1');
      expect($product1).toHaveTextContent('12000원');
      expect($product1).toHaveTextContent('재고: 25');

      // 3. 상품 할인율 추가 및 삭제
      fireEvent.click($product1);
      fireEvent.click(within($product1).getByTestId('modify-button'));

      // 할인 추가
      act(() => {
        fireEvent.change(screen.getByPlaceholderText('수량'), { target: { value: '5' } });
        fireEvent.change(screen.getByPlaceholderText('할인율 (%)'), { target: { value: '5' } });
      });
      fireEvent.click(screen.getByText('할인 추가'));

      expect(screen.queryByText('5개 이상 구매 시 5% 할인')).toBeInTheDocument();

      // 할인 삭제
      fireEvent.click(screen.getAllByText('삭제')[0]);
      expect(screen.queryByText('10개 이상 구매 시 10% 할인')).not.toBeInTheDocument();
      expect(screen.queryByText('5개 이상 구매 시 5% 할인')).toBeInTheDocument();

      fireEvent.click(screen.getAllByText('삭제')[0]);
      expect(screen.queryByText('10개 이상 구매 시 10% 할인')).not.toBeInTheDocument();
      expect(screen.queryByText('5개 이상 구매 시 5% 할인')).not.toBeInTheDocument();

      // 4. 쿠폰 추가
      fireEvent.change(screen.getByPlaceholderText('쿠폰 이름'), { target: { value: '새 쿠폰' } });
      fireEvent.change(screen.getByPlaceholderText('쿠폰 코드'), { target: { value: 'NEW10' } });
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'percentage' } });
      fireEvent.change(screen.getByPlaceholderText('할인 값'), { target: { value: '10' } });

      fireEvent.click(screen.getByText('쿠폰 추가'));

      const $newCoupon = screen.getByTestId('coupon-3');

      expect($newCoupon).toHaveTextContent('새 쿠폰 (NEW10):10% 할인');
    });
  });

  describe('유틸함수 테스트', () => {
    describe('services/admin', () => {
      describe('updateOpenProductIds', () => {
        test.each([
          { prevSetValue: [], productId: '1', newSetValue: ['1'] },
          { prevSetValue: ['1'], productId: '2', newSetValue: ['1', '2'] },
          { prevSetValue: ['1', '2'], productId: '3', newSetValue: ['1', '2', '3'] },
          { prevSetValue: ['1', '2', '3'], productId: '1', newSetValue: ['2', '3'] },
          { prevSetValue: ['1'], productId: '1', newSetValue: [] },
        ])(
          'updateOpenProductIds(new Set($prevSetValue), $productId) -> new Set($newSetValue)',
          ({ prevSetValue, productId, newSetValue }) => {
            const prevSet = new Set<string>(prevSetValue);
            expect(updateOpenProductIds(prevSet, productId)).toEqual(new Set(newSetValue));
          },
        );
      });

      test('getFormattedValue', () => {
        expect(getFormattedValue('rate', '10')).toBe(0.1);
        expect(getFormattedValue('price', '10000')).toBe(10000);
        expect(getFormattedValue('name', 'product1')).toBe('product1');
      });
    });

    describe('services/cart', () => {
      test('formatCurrency', () => {
        expect(formatCurrency(10000)).toBe('10,000');
      });

      test('getRemainingStock', () => {
        const product = { id: '1', name: 'product1', price: 10000, stock: 50, discounts: [] };

        expect(getRemainingStock(mockCart, product)).toBe(10);
      });

      describe('updateCartItemQuantity', () => {
        test('newQuantity가 0보다 클 때', () => {
          const updatedCartQuantity = updateCartItemQuantity(mockCart, '1', 15)[0].quantity;
          expect(updatedCartQuantity).toEqual(15);
        });

        test('newQuantity가 0일 때', () => {
          const updatedCart = updateCartItemQuantity(mockCart, '1', 0);
          expect(updatedCart).toHaveLength(1);
        });

        test('newQuantity가 마이너스일 때', () => {
          const updatedCart = updateCartItemQuantity(mockCart, '1', -10);
          expect(updatedCart).toHaveLength(1);
        });
      });

      test('calculateItemTotal', () => {
        const item = {
          product: {
            id: '1',
            name: 'product1',
            price: 10000,
            stock: 20,
            discounts: [
              { quantity: 10, rate: 0.1 },
              { quantity: 20, rate: 0.2 }, // 적용됨
              { quantity: 30, rate: 0.3 },
            ],
          },
          quantity: 25,
        };

        const itemTotal = calculateItemTotal(item);
        expect(itemTotal).toBe(200000);
      });

      test('calculateCartTotal', () => {
        const cartTotal = calculateCartTotal(mockCart, mockCoupons[0]);
        expect(cartTotal).toEqual({
          totalAfterDiscount: 475000,
          totalBeforeDiscount: 600000,
          totalDiscount: 125000,
        });
      });
    });

    describe('services/coupon', () => {
      describe('formatDiscountValue', () => {
        test('discountType: amount', () => {
          const amountCoupon: Coupon = {
            name: 'coupon1',
            code: 'couponCode1',
            discountType: 'amount',
            discountValue: 5000,
          };
          expect(formatDiscountValue(amountCoupon)).toBe('5000원');
        });
        test('discountType: percentage', () => {
          const percentageCoupon: Coupon = {
            name: 'coupon1',
            code: 'couponCode1',
            discountType: 'percentage',
            discountValue: 10,
          };
          expect(formatDiscountValue(percentageCoupon)).toBe('10%');
        });
      });
    });

    describe('services/product', () => {
      test('createProductWithId', () => {
        const product = { name: 'product1', price: 10000, stock: 20, discounts: [] };
        const newId = Date.now().toString();

        expect(createProductWithId(product, newId)).toEqual({ ...product, id: newId });
      });

      test('getTargetProduct', () => {
        const products = [
          { id: '1', name: 'product1', price: 10000, stock: 20, discounts: [] },
          { id: '2', name: 'product2', price: 20000, stock: 20, discounts: [] },
          { id: '3', name: 'product3', price: 30000, stock: 20, discounts: [] },
        ];

        expect(getTargetProduct(products, '1')).toEqual({
          id: '1',
          name: 'product1',
          price: 10000,
          stock: 20,
          discounts: [],
        });
      });
    });

    describe('services/discount', () => {
      test('formatRateToPercent', () => {
        expect(formatRateToPercent(0.1)).toBe('10');
      });

      test('excludeTargetIndexDiscount', () => {
        const discounts = [
          { quantity: 10, rate: 0.1 },
          { quantity: 20, rate: 0.2 },
          { quantity: 30, rate: 0.3 },
        ];

        expect(excludeTargetIndexDiscount(discounts, 0)).toHaveLength(2);
        expect(excludeTargetIndexDiscount(discounts, 0)).toEqual([
          { quantity: 20, rate: 0.2 },
          { quantity: 30, rate: 0.3 },
        ]);
      });

      test('getMaxDiscount', () => {
        const discounts = [
          { quantity: 10, rate: 0.1 },
          { quantity: 20, rate: 0.2 },
          { quantity: 30, rate: 0.3 },
        ];

        expect(discounts.reduce((max, discount) => Math.max(max, discount.rate), 0)).toBe(0.3);
      });

      test('getMaxApplicableDiscount', () => {
        const item = {
          product: {
            id: '1',
            name: 'product1',
            price: 10000,
            stock: 20,
            discounts: [
              { quantity: 10, rate: 0.1 },
              { quantity: 20, rate: 0.2 },
              { quantity: 30, rate: 0.3 },
            ],
          },
          quantity: 25,
        };

        const maxApplicableDiscount = getMaxApplicableDiscount(item);

        expect(maxApplicableDiscount).toBe(0.2);
      });
    });
  });

  describe('hooks 테스트', () => {
    describe('useNewCoupon', () => {
      const initialCoupon = {
        name: '',
        code: '',
        discountType: 'percentage',
        discountValue: 0,
      };
      const updatedCoupon: Coupon = {
        name: 'newCoupon',
        code: 'newCode',
        discountType: 'amount',
        discountValue: 5000,
      };

      test('newCoupon 초기값', () => {
        const { result } = renderHook(() => useNewCoupon());

        expect(result.current.newCoupon).toEqual(initialCoupon);
      });

      test('updateNewCoupon', () => {
        const { result } = renderHook(() => useNewCoupon());

        act(() => {
          result.current.updateNewCoupon(updatedCoupon);
        });

        expect(result.current.newCoupon).toEqual(updatedCoupon);
      });

      test('initializeNewCoupon', () => {
        const { result } = renderHook(() => useNewCoupon());

        act(() => {
          result.current.updateNewCoupon(updatedCoupon);
        });
        act(() => {
          result.current.initializeNewCoupon();
        });

        expect(result.current.newCoupon).toEqual(initialCoupon);
      });
    });

    describe('useNewProduct', () => {
      const initialProduct = {
        name: '',
        price: 0,
        stock: 0,
        discounts: [],
      };
      const updatedNewProduct: Omit<Product, 'id'> = {
        name: 'newProduct',
        price: 10000,
        stock: 20,
        discounts: [],
      };

      test('newCoupon 초기값', () => {
        const { result } = renderHook(() => useNewProduct());

        expect(result.current.showNewProductForm).toBe(false);
        expect(result.current.newProduct).toEqual(initialProduct);
      });

      test('toggleShowNewProductForm false -> true', () => {
        const { result } = renderHook(() => useNewProduct());

        act(() => {
          result.current.toggleShowNewProductForm();
        });

        expect(result.current.showNewProductForm).toBe(true);
      });

      test('toggleShowNewProductForm true -> false', () => {
        const { result } = renderHook(() => useNewProduct());

        act(() => {
          result.current.toggleShowNewProductForm();
          result.current.toggleShowNewProductForm();
        });

        expect(result.current.showNewProductForm).toBe(false);
      });

      test('updateNewCoupon', () => {
        const { result } = renderHook(() => useNewProduct());

        act(() => {
          result.current.updateNewProduct(updatedNewProduct);
        });

        expect(result.current.newProduct).toEqual(updatedNewProduct);
      });

      test('initializeNewCoupon', () => {
        const { result } = renderHook(() => useNewProduct());

        act(() => {
          result.current.updateNewProduct(updatedNewProduct);
          result.current.initializeNewProduct();
        });

        expect(result.current.showNewProductForm).toEqual(false);
        expect(result.current.newProduct).toEqual(initialProduct);
      });
    });

    describe('useAdmin', () => {
      test('useAdmin state 초기값', () => {
        const { result } = renderHook(() => useAdmin());

        expect(result.current.openProductIds).toBeInstanceOf(Set);
        expect(result.current.editingProduct).toBeNull();
      });

      test('toggleProductAccordion', () => {
        const { result } = renderHook(() => useAdmin());

        act(() => {
          result.current.toggleProductAccordion('1');
        });

        expect(result.current.openProductIds).toEqual(new Set(['1']));
      });

      test('updateEditingProduct', () => {
        const { result } = renderHook(() => useAdmin());

        act(() => {
          result.current.updateEditingProduct(mockProducts[0]);
        });

        expect(result.current.editingProduct).toEqual(mockProducts[0]);
      });

      test('handleEditingProductUpdate', () => {
        const { result } = renderHook(() => useAdmin());

        act(() => {
          result.current.updateEditingProduct(mockProducts[0]);
        });
        act(() => {
          result.current.handleEditingProductUpdate(
            { target: { name: 'name', value: 'newName' } } as React.ChangeEvent<HTMLInputElement>,
            mockProducts[0].id,
          );
        });

        expect(result.current.editingProduct).toEqual({ ...mockProducts[0], name: 'newName' });
      });
    });

    describe('useNewDiscount', () => {
      const initialNewDiscount = { quantity: 0, rate: 0 };

      test('newDiscount 초기값', () => {
        const { result } = renderHook(() => useNewDiscount());
        expect(result.current.newDiscount).toEqual(initialNewDiscount);
      });

      test('updateDiscount', () => {
        const { result } = renderHook(() => useNewDiscount());

        act(() => {
          result.current.updateDiscount({ quantity: 5, rate: 10 });
        });

        expect(result.current.newDiscount).toEqual({ quantity: 5, rate: 10 });
      });

      test('addDiscount', () => {
        const { result } = renderHook(() => useNewDiscount());

        act(() => {
          result.current.addDiscount();
        });

        expect(result.current.newDiscount).toEqual(initialNewDiscount);
      });
    });
  });
});
