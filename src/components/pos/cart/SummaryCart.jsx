import React, { useState } from 'react'
import { useCart } from '../../../context/CartContext'

const fmt = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)

export const SummaryCart = () => {
    const {
        cartItems,
        subtotal, tax, total, TAX_RATE,
        coupon, couponError, applyCoupon, removeCoupon, couponDiscount,
        manualDiscount, setManualDiscount, manualDiscountAmount, clearCart,
    } = useCart()

    const [couponInput, setCouponInput] = useState("")


    return (
        <div className="px-4 py-4 border-t border-gray-300 bg-gray-50 flex-shrink-0">

            {/* Xoá tất cả */}
            <button
                onClick={clearCart}
                className="w-full text-red-600 hover:bg-red-50 py-2 rounded-lg font-medium transition-colors">
                Xóa tất cả
            </button>

            {/* Mã giảm giá */}
            <div className="mb-3">
                {coupon ? (
                    <div className="flex items-center justify-between bg-green-50 border border-green-300 rounded-lg px-3 py-2 text-sm">
                        <span className="text-green-700 font-medium">✅ {coupon.code}</span>
                        <button onClick={removeCoupon} className="text-red-400 hover:text-red-600">Xoá</button>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Mã giảm giá..."
                            value={couponInput}
                            onChange={e => setCouponInput(e.target.value)}
                            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
                        />
                        <button
                            onClick={() => applyCoupon(couponInput)}
                            className="px-3 py-2 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600"
                        >
                            Áp dụng
                        </button>
                    </div>
                )}
                {couponError && <p className="text-red-500 text-xs mt-1">{couponError}</p>}
            </div>

            {/* Giảm giá thủ công */}
            <div className="flex gap-2 mb-3">
                <select
                    value={manualDiscount.type}
                    onChange={e => setManualDiscount({ type: e.target.value, value: 0 })}
                    className="border border-gray-200 rounded-lg px-2 py-2 text-sm"
                >
                    <option value="percent">%</option>
                    <option value="fixed">VNĐ</option>
                </select>
                <input
                    type="number"
                    min={0}
                    placeholder={manualDiscount.type === 'percent' ? 'Giảm %' : 'Giảm tiền'}
                    value={manualDiscount.value || ""}
                    onChange={e => setManualDiscount(d => ({ ...d, value: Number(e.target.value) }))}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
                />
            </div>

            {/* Tạm tính */}
            <div className="flex justify-between text-base mb-2">
                <span className="text-gray-600">Tạm tính:</span>
                <span className="font-semibold">{fmt(subtotal)}</span>
            </div>

            {/* Giảm giá */}
            {couponDiscount > 0 && (
                <div className="flex justify-between text-sm mb-2 text-green-600">
                    <span>Mã ({coupon.code}):</span>
                    <span>-{fmt(couponDiscount)}</span>
                </div>
            )}
            {manualDiscountAmount > 0 && (
                <div className="flex justify-between text-sm mb-2 text-green-600">
                    <span>Giảm tay:</span>
                    <span>-{fmt(manualDiscountAmount)}</span>
                </div>
            )}

            {/* Thuế */}
            {TAX_RATE > 0 && (
                <div className="flex justify-between text-base mb-3">
                    <span className="text-gray-600">VAT ({TAX_RATE * 100}%):</span>
                    <span className="font-semibold">{fmt(tax)}</span>
                </div>
            )}

            <div className="border-t border-gray-300 my-2"></div>

            {/* Tổng */}
            <div className="flex justify-between items-center mb-2">
                <span className="text-xl font-bold text-gray-800">Tổng cộng:</span>
                <span className="text-2xl font-bold text-green-600">{fmt(total)}</span>
            </div>

            {/* Thanh toán */}
            <button
                disabled={cartItems.length === 0}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-bold text-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-lg">
                Thanh toán
            </button>
        </div>
    )
}