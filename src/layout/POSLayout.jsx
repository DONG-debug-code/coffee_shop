import React from 'react'
import { POSPage } from '../page/pos/POSPage'
import { Header } from '../components/pos/Header';
import { CartProvider } from '../context/CartContext';

export const POSLayout = () => {
  return (
    <CartProvider>
      <div className="flex flex-col h-screen bg-gray-50">
        <Header />
        <div className="flex-1 flex overflow-hidden">
          <POSPage />
        </div>
      </div>
    </CartProvider>
  )
}

export default POSLayout;
