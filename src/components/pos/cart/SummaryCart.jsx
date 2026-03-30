import React from 'react'

export const SummaryCart = () => {
    return (
        <div className="px-4 py-4 border-t border-gray-300 bg-gray-50 flex-shrink-0">
            {/* Clear Cart Button */}
            <button
                className="w-full text-red-600 hover:bg-red-50 py-2 rounded-lg font-medium transition-colors">
                Xóa tất cả
            </button>

            {/* Subtotal */}
            <div className="flex justify-between text-base mb-2">
                <span className="text-gray-600">Tạm tính:</span>
                <span className="font-semibold">1.000.000đ</span>
            </div>

            {/* Tax */}
            <div className="flex justify-between text-base mb-3">
                <span className="text-gray-600">VAT (10%):</span>
                <span className="font-semibold">80.000đ</span>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-300 my-2"></div>

            {/* Total */}
            <div className="flex justify-between items-center mb-2">
                <span className="text-xl font-bold text-gray-800">Tổng cộng:</span>
                <span className="text-2xl font-bold text-green-600">1.080.000đ</span>
            </div>

            {/* Checkout Button */}
            <button
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-bold text-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-lg">Thanh toán
            </button>
        </div>
    )
}
