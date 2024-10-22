import { useState } from 'react';
import { AdminPage, CartPage } from './pages';
import { Header } from './components/layout';

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header title={isAdmin ? '장바구니 페이지로' : '관리자 페이지로'} onClick={() => setIsAdmin(!isAdmin)} />

      <main className="container mx-auto mt-6">{isAdmin ? <AdminPage /> : <CartPage />}</main>
    </div>
  );
};

export default App;
