import React, { useState } from 'react'
import { useCart } from '../../../context/CartContext'
import { CheckoutModal } from '../payment/CheckoutModal'
import { OrderSuccessModal } from '../payment/OrderSuccessModal'

const fmt = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)

// Component hiển thị phần tóm tắt giỏ hàng, bao gồm tổng tiền, mã giảm giá, giảm giá thủ công, thuế, và nút thanh toán. 
// Cho phép xoá tất cả, áp dụng mã giảm giá, và nhập giảm giá thủ công. Khi nhấn thanh toán sẽ mở modal CheckoutModal, và sau khi thanh toán thành công sẽ hiển thị OrderSuccessModal.
export const SummaryCart = () => {
    const { // Lấy các thông tin cần thiết từ context giỏ hàng
        cartItems,
        subtotal, total, TAX_RATE,
        coupon, couponError, applyCoupon, removeCoupon, couponDiscount,
        manualDiscount, setManualDiscount, manualDiscountAmount, clearCart,
    } = useCart()

    const [couponInput, setCouponInput] = useState("")

    const [showCheckout, setShowCheckout] = useState(false)      
    const [completedOrder, setCompletedOrder] = useState(null)   

    // Hàm xử lý khi đơn hàng được thanh toán thành công, sẽ đóng modal thanh toán và mở modal hiển thị đơn hàng đã hoàn thành
    const handleSuccess = (order) => {                          
        setShowCheckout(false)
        setCompletedOrder(order)
    }

    return (
        <div className="px-4 py-4 border-t border-gray-300 bg-gray-50 flex-shrink-0">

            {/* Xoá tất cả */}
            <button
                onClick={clearCart}
                className="w-full mb-3 text-red-600 hover:bg-red-50 py-2 rounded-lg font-medium transition-colors">
                Xóa tất cả
            </button>

            {/* Mã giảm giá */}
            {/* <div className="mb-3">
                {coupon ? (
                    <div className="flex items-center justify-between bg-green-50 border border-green-300 rounded-lg px-3 py-2 text-sm">
                        <span className="text-green-700 font-medium">{coupon.code}</span>
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
                            className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                        >
                            Áp dụng
                        </button>
                    </div>
                )}
                {couponError && <p className="text-red-500 text-xs mt-1">{couponError}</p>}
            </div> */}

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
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                />
            </div>

            {/* Tạm tính */}
            <div className="flex justify-between text-base mb-2">
                <span className="text-gray-600">Tạm tính:</span>
                <span className="font-semibold">{fmt(subtotal)}</span>
            </div>

            {/* Giảm giá */}
            {/* {couponDiscount > 0 && (
                <div className="flex justify-between text-sm mb-2 text-green-600">
                    <span>Mã ({coupon.code}):</span>
                    <span>-{fmt(couponDiscount)}</span>
                </div>
            )} */}
            {manualDiscountAmount > 0 && (
                <div className="flex justify-between text-sm mb-2 text-green-600">
                    <span>Giảm tay:</span>
                    <span>-{fmt(manualDiscountAmount)}</span>
                </div>
            )}

            {/* Thuế */}
            {/* {TAX_RATE > 0 && (
                <div className="flex justify-between text-base mb-3">
                    <span className="text-gray-600">VAT ({TAX_RATE * 100}%):</span>
                    <span className="font-semibold">{fmt(tax)}</span>
                </div>
            )} */}

            <div className="border-t border-gray-300 my-2"></div>

            {/* Tổng */}
            <div className="flex justify-between items-center mb-2">
                <span className="text-xl font-bold text-gray-800">Tổng cộng:</span>
                <span className="text-2xl font-bold text-blue-600">{fmt(total)}</span>
            </div>

            {/* Thanh toán */}
            <button
                onClick={() => setShowCheckout(true)}
                disabled={cartItems.length === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-bold text-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-lg">
                Thanh toán
            </button>

            {showCheckout && (
                <CheckoutModal
                    onClose={() => setShowCheckout(false)}
                    onSuccess={handleSuccess}
                />
            )}
            {completedOrder && (
                <OrderSuccessModal
                    order={completedOrder}
                    onClose={() => setCompletedOrder(null)}
                />
            )}
        </div>
    )
}