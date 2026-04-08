import React from 'react'
import { POSPage } from '../page/pos/POSPage'
import { Header } from '../components/pos/Header';
import { CartProvider } from '../context/CartContext';
import { TableProvider } from '../context/TableContext';

export const POSLayout = () => {
  return (
    <TableProvider>
      <CartProvider>
        <div className="flex flex-col h-screen bg-gray-50">
          <Header />
          <div className="flex-1 flex overflow-hidden">
            <POSPage />
          </div>
        </div>
      </CartProvider>
    </TableProvider>
  )
}

export default POSLayout;
