import React from 'react'
import { SummaryCart } from '../../components/pos/cart/SummaryCart'
import { CartItem } from '../../components/pos/cart/CartItem'

export const Cart = () => {
    return (
        <div className='h-full flex flex-col select-none'>
            <div className="px-4 py-4 flex-shrink-0 shadow-sm border-b border-gray-300">
                <h2 className="text-xl font-bold flex items-center">
                    Đơn hàng
                </h2>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-3">
                <CartItem/>
                <CartItem/>
                <CartItem/>
                <CartItem/>
                <CartItem/>
                <CartItem/>
                <CartItem/>
                <CartItem/>
                <CartItem/>
                <CartItem/>
                <CartItem/>
                <CartItem/>
                <CartItem/>
                <CartItem/>
                <CartItem/>
                <CartItem/>
            </div>
            <SummaryCart />
        </div>
    )
}
