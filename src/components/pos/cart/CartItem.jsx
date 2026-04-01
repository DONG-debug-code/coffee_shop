import React from 'react'
import { IoTrashOutline } from "react-icons/io5";
import { useCart } from '../../../context/CartContext'

const fmt = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)
export const CartItem = ({ item }) => {
    const { updateQuantity, removeItem } = useCart();

    return (
        <div className="space-y-3 mb-3">
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                {/* Item Info */}
                <div className="flex justify-between items-start item-center">
                    <div className="flex-1">
                        <p className="font-semibold text-gray-800">{item.product.name}</p>
                        <p className="text-sm text-gray-600">
                            Size {item.size}
                            {item.toppings.length > 0 && ' · ' + item.toppings.map(t => t.name).join(', ')}
                        </p>
                        {item.note && (
                            <p className="text-xs text-amber-600 italic">📝 {item.note}</p>
                        )}
                        <p className="text-sm text-gray-600 mt-1">{fmt(item.unitPrice)}</p>
                    </div>
                    <div>

                        <div className="items-center text-center justify-between">
                            <div className="flex items-center mb-1 gap-1 bg-white rounded-lg border border-gray-300 p-1">
                                <button
                                    onClick={() => updateQuantity(item.cartId, -1)}
                                    className="w-6 h-8 flex items-center justify-center hover:bg-gray-100 rounded transition-colors font-black">-
                                </button>
                                <span className="w-6 text-center font-bold text-lg">1</span>
                                <button
                                    onClick={() => updateQuantity(item.cartId, 1)}
                                    className="w-6 h-8 flex items-center justify-center hover:bg-gray-100 rounded transition-colors font-black">+
                                </button>
                                <button
                                    onClick={() => removeItem(item.cartId)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded"><IoTrashOutline />
                                </button>
                            </div>
                            <p className="font-bold text-green-600 text-lg">  {fmt(item.unitPrice * item.quantity)}</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
