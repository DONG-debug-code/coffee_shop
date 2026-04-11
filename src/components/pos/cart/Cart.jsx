import React from 'react'
import { useCart } from '../../../context/CartContext'
import { useOrder } from '../../../context/OrderContext'
import { CartItem } from './CartItem'
import { OrderedItem } from './OrderedItem'  // ← tạo mới
import { SummaryCart } from './SummaryCart'

export const Cart = ({ onConfirmed, resetOrder, }) => {
    const { cartItems } = useCart()
    const { currentOrder } = useOrder()
    console.log("currentOrder trong Cart:", currentOrder?.tableName, currentOrder?.items);

    const orderedItems = currentOrder?.items || []  // món đã lưu Firestore
    const hasAnything = orderedItems.length > 0 || cartItems.length > 0

    return (
        <div className='h-full flex flex-col select-none'>
            <div className="px-4 py-4 flex-shrink-0 shadow-sm border-b border-gray-300">
                <h2 className="text-xl font-bold flex items-center">
                    Giỏ hàng
                    {cartItems.length > 0 && (
                        <span className="ml-2 bg-blue-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                            {cartItems.length}
                        </span>
                    )}
                </h2>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3">
                {!hasAnything ? (
                    <p className="text-center text-gray-400 mt-10 text-sm">Chưa có món nào</p>
                ) : (
                    <>
                        {/* Món đã xác nhận (từ Firestore) */}
                        {orderedItems.length > 0 && (
                            <div className="mb-3">
                                <p className="text-xs text-gray-400 font-semibold mb-2 uppercase">
                                    Đã order
                                </p>
                                {orderedItems.map((item, idx) => (
                                    <OrderedItem key={idx} item={item} />
                                ))}
                            </div>
                        )}

                        {/* Món mới chưa xác nhận (local) */}
                        {cartItems.length > 0 && (
                            <div>
                                <p className="text-xs text-amber-500 font-semibold mb-2 uppercase">
                                    Món mới chưa xác nhận
                                </p>
                                {cartItems.map(item => (
                                    <CartItem key={item.cartId} item={item} />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            <SummaryCart onConfirmed={onConfirmed} />
        </div>
    )
}