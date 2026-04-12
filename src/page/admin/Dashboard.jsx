import { useState, useEffect } from 'react'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { dulieu } from '../../data/connectdata'

const fmt = (n) => new Intl.NumberFormat('vi-VN').format(n) + 'đ'

const METHOD_LABEL = {
    cash: 'Tiền mặt',
    transfer: 'Chuyển khoản',
    qr: 'QR / Ví điện tử',
    card: 'Thẻ',
}

export const Dashboard = () => {
    const [dateFrom, setDateFrom] = useState(() => {
        const d = new Date()
        d.setHours(0, 0, 0, 0)
        return d.toISOString().split('T')[0]
    })
    const [dateTo, setDateTo] = useState(() => {
        const d = new Date()
        d.setHours(23, 59, 59, 999)
        return d.toISOString().split('T')[0]
    })
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchOrders()
    }, [dateFrom, dateTo])

    const fetchOrders = async () => {
        setLoading(true)
        try {
            const from = new Date(dateFrom)
            from.setHours(0, 0, 0, 0)
            const to = new Date(dateTo)
            to.setHours(23, 59, 59, 999)

            const q = query(
                collection(dulieu, 'orders'),
                where('status', '==', 'paid'),
            )
            const snap = await getDocs(q)
            const all = snap.docs.map(d => ({ id: d.id, ...d.data() }))

            // Lọc theo ngày
            const filtered = all.filter(o => {
                const paidAt = o.paidAt?.toDate?.()
                return paidAt && paidAt >= from && paidAt <= to
            })

            setOrders(filtered)
        } finally {
            setLoading(false)
        }
    }

    // Tính toán
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0)
    const totalOrders = orders.length

    return (
        <div>
            <h2 className="text-2xl font-medium text-gray-800 mb-6">Doanh thu</h2>

            {/* Chọn ngày */}
            <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Từ:</label>
                    <input
                        type="date"
                        value={dateFrom}
                        onChange={e => setDateFrom(e.target.value)}
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Đến:</label>
                    <input
                        type="date"
                        value={dateTo}
                        onChange={e => setDateTo(e.target.value)}
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                    />
                </div>
                <button
                    onClick={fetchOrders}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                >
                    Xem
                </button>
            </div>

            {loading ? (
                <div className="text-gray-400 text-center py-10">Đang tải...</div>
            ) : (
                <>
                    {/* Thẻ tổng quan */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                            <p className="text-sm text-gray-500 mb-1">Tổng đơn</p>
                            <p className="text-3xl font-bold">{totalOrders}</p>
                        </div>
                        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                            <p className="text-sm text-gray-500 mb-1">Doanh thu</p>
                            <p className="text-3xl font-bold">{fmt(totalRevenue)}</p>
                        </div>
                        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                            <p className="text-sm text-gray-500 mb-1">TB / đơn</p>
                            <p className="text-3xl font-bold ">
                                {totalOrders > 0 ? fmt(Math.round(totalRevenue / totalOrders)) : '0đ'}
                            </p>
                        </div>
                    </div>

                    
                    {/* Danh sách đơn hàng */}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mt-4">
                        <h3 className="font-semibold text-gray-700 mb-4">
                            Đơn hàng ({totalOrders})
                        </h3>
                        {orders.length === 0 ? (
                            <p className="text-gray-400 text-sm text-center py-4">Chưa có đơn hàng</p>
                        ) : (
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-gray-400 border-b">
                                        <th className="pb-2">Mã đơn</th>
                                        <th className="pb-2">Bàn</th>
                                        <th className="pb-2">Thời gian</th>
                                        <th className="pb-2">Phương thức</th>
                                        <th className="pb-2 text-right">Tổng tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders
                                        .sort((a, b) => b.paidAt?.toDate?.() - a.paidAt?.toDate?.())
                                        .map(o => (
                                            <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50">
                                                <td className="py-2 font-mono text-xs">{o.id.slice(-8).toUpperCase()}</td>
                                                <td className="py-2">{o.tableName}</td>
                                                <td className="py-2 text-gray-500 text-xs">
                                                    {o.paidAt?.toDate?.()?.toLocaleString('vi-VN', {
                                                        hour: '2-digit', minute: '2-digit',
                                                        day: '2-digit', month: '2-digit'
                                                    })}
                                                </td>
                                                <td className="py-2">{METHOD_LABEL[o.paymentMethod] || o.paymentMethod}</td>
                                                <td className="py-2 text-right font-semibold text-green-600">{fmt(o.total)}</td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}