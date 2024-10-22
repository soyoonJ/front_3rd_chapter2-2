import { ChangeEvent } from 'react';
import { useNewProduct } from '../../hooks/admin/useNewProduct';
import { createProductWithId } from '../../services/admin';
import { useProductStore } from '../../stores/useProductStore';

export const NewProduct = () => {
  const addProduct = useProductStore((state) => state.addProduct);

  const { showNewProductForm, toggleShowNewProductForm, newProduct, updateNewProduct, initializeNewProduct } =
    useNewProduct();

  const handleAddNewProduct = () => {
    initializeNewProduct();
    addProduct(createProductWithId(newProduct));
  };
  const handleUpdateNewProduct = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateNewProduct({ ...newProduct, [name]: value });
  };

  return (
    <>
      <button
        onClick={toggleShowNewProductForm}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600"
      >
        {showNewProductForm ? '취소' : '새 상품 추가'}
      </button>

      {showNewProductForm && (
        <div className="bg-white p-4 rounded shadow mb-4">
          <h3 className="text-xl font-semibold mb-2">새 상품 추가</h3>
          <div className="mb-2">
            <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
              상품명
            </label>
            <input
              id="productName"
              type="text"
              name="name"
              value={newProduct.name}
              onChange={handleUpdateNewProduct}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700">
              가격
            </label>
            <input
              id="productPrice"
              type="number"
              name="price"
              value={newProduct.price}
              onChange={handleUpdateNewProduct}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="productStock" className="block text-sm font-medium text-gray-700">
              재고
            </label>
            <input
              id="productStock"
              type="number"
              name="stock"
              value={newProduct.stock}
              onChange={handleUpdateNewProduct}
              className="w-full p-2 border rounded"
            />
          </div>
          <button onClick={handleAddNewProduct} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            추가
          </button>
        </div>
      )}
    </>
  );
};
