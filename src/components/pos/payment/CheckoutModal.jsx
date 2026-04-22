import { useState } from "react"
import { useCart } from "../../../context/CartContext"
import { useOrder } from "../../../context/OrderContext"
import { useShift } from "../../../context/ShiftContext"
import { serverTimestamp } from "firebase/firestore"

const fmt = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)

const PAYMENT_METHODS = [
    { id: "cash", label: "Tiền mặt", icon: "💵" },
    { id: "transfer", label: "Chuyển khoản", icon: "🏦" },
    { id: "qr", label: "QR / Ví điện tử", icon: "📱" },
    { id: "card", label: "Thẻ", icon: "💳" },
]

export const CheckoutModal = ({ onClose, onSuccess }) => {
    const { total: cartTotal, clearCart, coupon } = useCart()
    const { currentOrder, payOrder } = useOrder()   // ← dùng payOrder từ OrderContext
    const [method, setMethod] = useState("cash")
    const [amountPaid, setAmountPaid] = useState("")
    const [loading, setLoading] = useState(false)
    const { updateShiftOnOrder } = useShift()

    const total = (currentOrder?.total || 0) + cartTotal

    const change = method === "cash" && amountPaid
        ? Number(amountPaid) - total
        : 0

    const handleCheckout = async () => {
        if (method === "cash" && Number(amountPaid) < total) return
        setLoading(true)
        try {
            const paid = method === "cash" ? Number(amountPaid) : total
            const changeAmount = method === "cash" ? Number(amountPaid) - total : 0
            // Thanh toán → update order + bàn về empty
            const paidOrder = await payOrder({
                paymentMethod: method,
                couponCode: coupon?.code || null,
                amountPaid: paid,
                change: changeAmount,
            })

            // Cập nhật doanh thu ca
            await updateShiftOnOrder({
                ...paidOrder,
                total,
                amountPaid: paid,
                change: changeAmount,
                paymentMethod: method,
                paidAt: serverTimestamp(),
            })

            clearCart()
            onSuccess({
                ...paidOrder,
                total,
                amountPaid: method === "cash" ? Number(amountPaid) : total,
                change: method === "cash" ? Number(amountPaid) - total : 0,
                paymentMethod: method,
            })
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
                onClick={e => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold mb-5">Thanh toán</h2>

                <p className="font-semibold text-gray-700 mb-2">Phương thức</p>
                <div className="grid grid-cols-2 gap-2 mb-5">
                    {PAYMENT_METHODS.map(m => (
                        <button
                            key={m.id}
                            onClick={() => setMethod(m.id)}
                            className={`flex items-center gap-2 px-4 py-3 rounded-xl border font-medium transition
                                ${method === m.id
                                    ? "bg-blue-50 border-blue-500 text-blue-700"
                                    : "border-gray-200 text-gray-600 hover:border-blue-300"
                                }`}
                        >
                            <span>{m.icon}</span>
                            <span className="text-sm">{m.label}</span>
                        </button>
                    ))}
                </div>

                {method === "cash" && (
                    <div className="mb-4">
                        <p className="font-semibold text-gray-700 mb-2">Tiền khách đưa</p>
                        <input
                            type="number"
                            placeholder="Nhập số tiền..."
                            value={amountPaid}
                            onChange={e => setAmountPaid(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-blue-400"
                        />
                        <div className="flex gap-2 mt-2 flex-wrap">
                            {[50000, 100000, 200000, 500000].map(v => (
                                <button
                                    key={v}
                                    onClick={() => setAmountPaid(v)}
                                    className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm"
                                >
                                    {fmt(v)}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-2">
                    <div className="flex justify-between text-gray-600">
                        <span>Tổng tiền:</span>
                        <span className="font-bold text-lg text-blue-600">{fmt(total)}</span>
                    </div>
                    {method === "cash" && amountPaid && (
                        <>
                            <div className="flex justify-between text-gray-600">
                                <span>Khách đưa:</span>
                                <span className="font-semibold">{fmt(Number(amountPaid))}</span>
                            </div>
                            <div className={`flex justify-between font-bold ${change < 0 ? "text-red-500" : "text-blue-600"}`}>
                                <span>Tiền thối:</span>
                                <span>{change < 0 ? "Thiếu " + fmt(Math.abs(change)) : fmt(change)}</span>
                            </div>
                        </>
                    )}
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50"
                    >
                        Huỷ
                    </button>
                    <button
                        onClick={handleCheckout}
                        disabled={loading || (method === "cash" && (!amountPaid || change < 0))}
                        className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                    >
                        {loading ? "Đang xử lý..." : "Xác nhận"}
                    </button>
                </div>
            </div>
        </div>
    )
}