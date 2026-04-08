
//hàm định dạng tiền Việt
const fmt = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)

// Modal hiển thị khi đơn hàng được thanh toán thành công, cho phép xem lại tổng tiền, tiền khách đưa (nếu có), và tiền thối (nếu có). Có nút "Đơn mới" để quay lại
export const OrderSuccessModal = ({ order, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center">
                <h2 className="text-xl font-bold text-blue-600 mb-1">Thanh toán thành công!</h2>
                <p className="text-gray-400 text-sm mb-4">{order.orderCode}</p>

                <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2 mb-5">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Tổng tiền:</span>
                        <span className="font-bold">{fmt(order.total)}</span>
                    </div>
                    {order.paymentMethod === "cash" && (
                        <>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Khách đưa:</span>
                                <span>{fmt(order.amountPaid)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Tiền thối:</span>
                                <span className="text-blue-600 font-semibold">{fmt(order.change)}</span>
                            </div>
                        </>
                    )}
                </div>

                <button
                    onClick={onClose}
                    className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700"
                >
                    Đơn mới
                </button>
            </div>
        </div>
    )
}