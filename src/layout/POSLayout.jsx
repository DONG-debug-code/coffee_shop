import React from 'react'
import { Header } from '../page/pos/Header'
import { Product } from '../page/pos/Product'
import { Cart } from '../page/pos/Cart'

export const POSLayout = ({dl}) => {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto bg-gray-100">
          <Product dl={dl}/>
        </div>

        <div className="border-l border-gray-300 w-96 bg-white flex flex-col shadow-xl">
          <Cart/>
        </div>
      </div>
    </div>
  )
}

export default POSLayout;
