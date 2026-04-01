import React from 'react'
import { useCart } from '../../../context/CartContext'
import { CartItem } from './CartItem'
import { SummaryCart } from './SummaryCart'


export const Cart = () => {
    const { cartItems } = useCart();

    return (
        <div className='h-full flex flex-col select-none'>
            <div className="px-4 py-4 flex-shrink-0 shadow-sm border-b border-gray-300">
                <h2 className="text-xl font-bold flex items-center">
                    Giỏ hàng
                    {cartItems.length > 0 && (
                        <span className="ml-2 bg-amber-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                            {cartItems.length}
                        </span>
                    )}
                </h2>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-3">
                 {cartItems.length === 0 ? (
                    <p className="text-center text-gray-400 mt-10 text-sm">Chưa có món nào</p>
                ) : (
                    cartItems.map(item => (
                        <CartItem key={item.cartId} item={item} />
                    ))
                )}
            </div>
            <SummaryCart />
        </div>
    )
}
