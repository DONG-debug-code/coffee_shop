// src/page/pos/POSOrdersPage.jsx
import { useState, useEffect } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { dulieu } from '../../data/connectdata'
import { useAuth } from '../../context/AuthContext'
import { Receipt } from '../../components/pos/payment/Receipt'

const fmt = (n) => new Intl.NumberFormat('vi-VN').format(n) + 'đ'

const STATUS_CONFIG = {
    paid: { label: 'Đã thanh toán', color: 'bg-green-100 text-green-700' },
    open: { label: 'Đang phục vụ', color: 'bg-blue-100 text-blue-700' },
    cancelled: { label: 'Đã huỷ', color: 'bg-red-100 text-red-700' },
}

const METHOD_LABEL = {
    cash: 'Tiền mặt', transfer: 'Chuyển khoản',
    qr: 'QR', card: 'Thẻ',
}

export const POSOrdersPage = () => {
    const { user } = useAuth()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [showReceipt, setShowReceipt] = useState(false)

    useEffect(() => {
        fetchTodayOrders()
    }, [])

    const fetchTodayOrders = async () => {
        setLoading(true)
        try {
            const today = new Date()
            today.setHours(0, 0, 0, 0)

            const q = query(
                collection(dulieu, 'orders'),
                where('createdBy', '==', user.uid),
            )
            const snap = await getDocs(q)
            const all = snap.docs.map(d => ({ id: d.id, ...d.data() }))

            // Lọc hôm nay
            const todayOrders = all.filter(o => {
                const createdAt = o.createdAt?.toDate?.()
                return createdAt && createdAt >= today
            })

            // Sắp xếp mới nhất trước
            todayOrders.sort((a, b) =>
                (b.createdAt?.toDate?.() || 0) - (a.createdAt?.toDate?.() || 0)
            )

            setOrders(todayOrders)
        } finally {
            setLoading(false)
        }
    }

    const formatTime = (timestamp) => {
        if (!timestamp) return ''
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
        return date.toLocaleString('vi-VN', {
            hour: '2-digit', minute: '2-digit',
            day: '2-digit', month: '2-digit'
        })
    }

    return (
        <div className="flex-1 overflow-y-auto bg-gray-100 p-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Đơn hàng hôm nay</h2>
                <button
                    onClick={fetchTodayOrders}
                    className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                >
                    🔄 Làm mới
                </button>
            </div>

            {loading ? (
                <div className="text-center text-gray-400 py-10">Đang tải...</div>
            ) : orders.length === 0 ? (
                <div className="text-center text-gray-400 py-10">Chưa có đơn hàng hôm nay</div>
            ) : (
                <div className="space-y-3">
                    {orders.map(order => (
                        <div
                            key={order.id}
                            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                        >
                            {/* Header đơn */}
                            <div className='flex justify-between'>
                                <div className="flex items-center mb-3 gap-10">
                                    <div className="flex items-center gap-6">
                                        <span className="font-mono font-bold text-gray-700">
                                            #{order.id.slice(-8).toUpperCase()}
                                        </span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_CONFIG[order.status]?.color}`}>
                                            {STATUS_CONFIG[order.status]?.label}
                                        </span>
                                    </div>
                                    {/* Info */}
                                    <div className="flex gap-10 text-sm mb-3">
                                        <div>
                                            <p className="text-gray-400 text-xs">Bàn</p>
                                            <p className="font-semibold">{order.tableName}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-xs">Phương thức</p>
                                            <p className="font-semibold">{METHOD_LABEL[order.paymentMethod] || '—'}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-xs">Tổng tiền</p>
                                            <p className="font-bold text-green-600">{fmt(order.total || 0)}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-xs">Thời gian</p>
                                            <span className="text-xs text-gray-400">
                                                {formatTime(order.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {/* Nút xuất hoá đơn */}
                                {order.status === 'paid' && (
                                    <button
                                        onClick={() => { setSelectedOrder(order); setShowReceipt(true) }}
                                        className="w-auto p-2 h-10 border border-blue-300 text-blue-600 rounded-lg text-sm hover:bg-blue-50 transition"
                                    >
                                        Xuất lại hoá đơn
                                    </button>
                                )}
                            </div>

                            {/* Danh sách món */}
                            <div className="border-t border-gray-100 pt-2 mb-3">
                                <p className="text-xs text-gray-400 mb-1">Món đã order:</p>
                                <div className="space-y-1">
                                    {order.items?.map((item, idx) => (
                                        <div key={idx} className="flex justify-between text-sm">
                                            <span className="text-gray-600">
                                                {item.name}
                                                {item.size && <span className="text-xs text-gray-400"> (Size {item.size})</span>}
                                                {' '}x{item.quantity}
                                            </span>
                                            <span className="font-medium">{fmt(item.subtotal)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>


                        </div>
                    ))}
                </div>
            )}

            {/* Modal hoá đơn */}
            {showReceipt && selectedOrder && (
                <Receipt
                    order={selectedOrder}   
                    onClose={() => { setShowReceipt(false); setSelectedOrder(null) }}
                />
            )}
        </div>
    )
}