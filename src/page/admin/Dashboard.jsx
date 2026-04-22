import { useState, useEffect } from 'react'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { dulieu } from '../../data/connectdata'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

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
    const [chartData, setChartData] = useState([])

    useEffect(() => {
        fetchChartData()  // chỉ chạy 1 lần
    }, [])

    useEffect(() => {
        fetchOrders()     // chạy lại khi đổi ngày
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

    const fetchChartData = async () => {
        const today = new Date(); today.setHours(23, 59, 59, 999)
        const from = new Date(); from.setDate(from.getDate() - 29); from.setHours(0, 0, 0, 0)

        const snap = await getDocs(query(collection(dulieu, 'orders'), where('status', '==', 'paid')))
        const all = snap.docs.map(d => ({ id: d.id, ...d.data() }))

        console.log("Tổng orders paid:", all.length) // ← thêm
        console.log("Sample order paidAt:", all[0]?.paidAt)
        // Tạo map 30 ngày
        const dayMap = {}
        for (let i = 0; i < 30; i++) {
            const d = new Date()
            d.setDate(d.getDate() - (29 - i))
            const key = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
            dayMap[key] = 0
        }

        // Điền doanh thu vào từng ngày
        all.forEach(o => {
            const paidAt = o.paidAt?.toDate?.()
            if (!paidAt || paidAt < from || paidAt > today) return
            const key = paidAt.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
            if (dayMap[key] !== undefined) {
                dayMap[key] += o.total || 0
            }
        })

        console.log("chartData:", Object.entries(dayMap)) // ← thêm trước setChartData
        setChartData(Object.entries(dayMap).map(([date, revenue]) => ({ date, revenue })))
    }

    // Tính toán
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0)
    const totalOrders = orders.length

    const revenueByMethod = orders.reduce((acc, o) => {
        const m = o.paymentMethod || 'cash'
        acc[m] = (acc[m] || 0) + (o.total || 0)
        return acc
    }, {})
    const productMap = {}
    orders.forEach(o => {
        o.items?.forEach(item => {
            if (!productMap[item.name]) productMap[item.name] = { name: item.name, quantity: 0, revenue: 0 }
            productMap[item.name].quantity += item.quantity
            productMap[item.name].revenue += item.subtotal
        })
    })
    const topProducts = Object.values(productMap).sort((a, b) => b.quantity - a.quantity).slice(0, 5)

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload?.length) {
            return (
                <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg text-sm">
                    <p className="font-semibold text-gray-700">{label}</p>
                    <p className="text-green-600 font-bold">{fmt(payload[0].value)}</p>
                </div>
            )
        }
        return null
    }

    return (
        <div>
            <h2 className="text-2xl font-medium text-gray-800 mb-6">Doanh thu</h2>

            {/* Biểu đồ doanh thu */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
                <h3 className="font-semibold text-gray-700 mb-4">Doanh thu 30 ngày gần nhất</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 10 }}
                            interval={4}
                            stroke="#9ca3af"
                        />
                        <YAxis
                            tick={{ fontSize: 10 }}
                            stroke="#9ca3af"
                            tickFormatter={v => v === 0 ? '0' : (v / 1000) + 'k'}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            dot={{ r: 3, fill: '#3b82f6' }}
                            activeDot={{ r: 5 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

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