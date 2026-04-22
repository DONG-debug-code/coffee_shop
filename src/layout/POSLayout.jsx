import React from 'react'
import { POSPage } from '../page/pos/POSPage'
import { Header } from '../components/pos/Header';
import { CartProvider } from '../context/CartContext';
import { TableProvider } from '../context/TableContext';
import { OrderProvider } from '../context/OrderContext';
import { ShiftProvider } from '../context/ShiftContext';
import { Outlet } from 'react-router-dom';

export const POSLayout = () => {
  return (
    <ShiftProvider>
      <TableProvider>
        <OrderProvider>
          <CartProvider>
            <div className="flex flex-col h-screen bg-gray-50">
              <Header />
              <div className="flex-1 flex overflow-hidden">
                <Outlet />
              </div>
            </div>
          </CartProvider>
        </OrderProvider>
      </TableProvider>
    </ShiftProvider>
  )
}

export default POSLayout;
