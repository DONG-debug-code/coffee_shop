import React from 'react'
import { Product } from '../../components/pos/product/Product'
import { Cart } from '../../components/pos/cart/Cart'

export const POSPage = () => {
    return (
        <>
            <div className="flex-1 overflow-y-auto bg-gray-100">
               <Product />
            </div>

            <div className="border-l border-gray-300 w-96 bg-white flex flex-col shadow-xl">
               <Cart />
            </div></>
    )
}
