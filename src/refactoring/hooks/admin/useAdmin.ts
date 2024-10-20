import { useState } from 'react';
import { AdminActions, Coupon, Discount, Product } from '../../../types';
import { updateProduct } from '../utils/adminUtils';

export const useAdmin = (products: Product[], adminActions: AdminActions) => {
  // 상품 상세 토글
  const [openProductIds, setOpenProductIds] = useState<Set<string>>(new Set());
  const toggleProductAccordion = (productId: string) => {
    setOpenProductIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  // 상품 정보 수정
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product });
  };
  const handleEditingProductUpdate = (
    productId: string,
    targetKey: keyof Product,
    newValue: Product[keyof Product],
  ) => {
    if (editingProduct && editingProduct.id === productId) {
      const updatedProduct = updateProduct(editingProduct, targetKey, newValue);
      // TODO: stock인 경우 바로 업데이트 처리여부 확인 후 반영 필요
      // adminActions.updateProduct(newProduct);
      setEditingProduct(updatedProduct);
    }
  };
  const handleEditComplete = () => {
    if (editingProduct) {
      adminActions.updateProduct(editingProduct);
      setEditingProduct(null);
    }
  };

  // 할인 정보 추가/삭제 관련
  const [newDiscount, setNewDiscount] = useState<Discount>({ quantity: 0, rate: 0 });
  const handleAddDiscount = (productId: string) => {
    const updatedProduct = products.find((p) => p.id === productId);
    if (updatedProduct && editingProduct) {
      const newProduct = {
        ...updatedProduct,
        discounts: [...updatedProduct.discounts, newDiscount],
      };
      adminActions.updateProduct(newProduct);
      setEditingProduct(newProduct);
      setNewDiscount({ quantity: 0, rate: 0 });
    }
  };
  const handleRemoveDiscount = (productId: string, index: number) => {
    const updatedProduct = products.find((p) => p.id === productId);
    if (updatedProduct) {
      const newProduct = {
        ...updatedProduct,
        discounts: updatedProduct.discounts.filter((_, i) => i !== index),
      };
      adminActions.updateProduct(newProduct);
      setEditingProduct(newProduct);
    }
  };

  // 신규 쿠폰 추가
  const [newCoupon, setNewCoupon] = useState<Coupon>({
    name: '',
    code: '',
    discountType: 'percentage',
    discountValue: 0,
  });
  const handleAddCoupon = () => {
    adminActions.addCoupon(newCoupon);
    setNewCoupon({
      name: '',
      code: '',
      discountType: 'percentage',
      discountValue: 0,
    });
  };

  return {
    openProductIds,
    toggleProductAccordion,

    editingProduct,
    handleEditProduct,
    handleEditingProductUpdate,
    handleEditComplete,

    newDiscount,
    setNewDiscount,
    handleAddDiscount,
    handleRemoveDiscount,

    newCoupon,
    setNewCoupon,
    handleAddCoupon,
  };
};
