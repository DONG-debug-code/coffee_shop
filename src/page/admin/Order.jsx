// src/page/admin/Order.jsx
import { useState, useEffect } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { dulieu } from '../../data/connectdata'
import * as XLSX from 'xlsx'

const fmt = (n) => new Intl.NumberFormat('vi-VN').format(n) + 'đ'

const METHOD_LABEL = {
    cash: 'Tiền mặt', transfer: 'Chuyển khoản',
    qr: 'QR / Ví điện tử', card: 'Thẻ',
}

const STATUS_CONFIG = {
    paid:      { label: 'Đã thanh toán', color: 'bg-green-100 text-green-700' },
    open:      { label: 'Đang phục vụ',  color: 'bg-blue-100 text-blue-700' },
    cancelled: { label: 'Đã huỷ',        color: 'bg-red-100 text-red-700' },
}

export const Order = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(false)
    const [dateFrom, setDateFrom] = useState(() => new Date().toISOString().split('T')[0])
    const [dateTo, setDateTo] = useState(() => new Date().toISOString().split('T')[0])
    const [filterTable, setFilterTable] = useState("")
    const [expandedId, setExpandedId] = useState(null)

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        setLoading(true)
        try {
            const from = new Date(dateFrom); from.setHours(0, 0, 0, 0)
            const to = new Date(dateTo); to.setHours(23, 59, 59, 999)

            const snap = await getDocs(collection(dulieu, 'orders'))
            let all = snap.docs.map(d => ({ id: d.id, ...d.data() }))

            // Lọc theo ngày
            all = all.filter(o => {
                const createdAt = o.createdAt?.toDate?.()
                return createdAt && createdAt >= from && createdAt <= to
            })

            // Lọc theo bàn
            if (filterTable.trim()) {
                all = all.filter(o =>
                    o.tableName?.toLowerCase().includes(filterTable.toLowerCase())
                )
            }

            all.sort((a, b) =>
                (b.createdAt?.toDate?.() || 0) - (a.createdAt?.toDate?.() || 0)
            )

            setOrders(all)
        } finally {
            setLoading(false)
        }
    }

    const exportExcel = () => {
        const rows = []
        orders.forEach(o => {
            o.items?.forEach(item => {
                rows.push({
                    'Mã đơn': o.id.slice(-8).toUpperCase(),
                    'Bàn': o.tableName,
                    'Thời gian': o.createdAt?.toDate?.()?.toLocaleString('vi-VN') || '',
                    'Trạng thái': STATUS_CONFIG[o.status]?.label || o.status,
                    'Tên món': item.name,
                    'Size': item.size || '',
                    'Topping': item.toppings?.join(', ') || '',
                    'Số lượng': item.quantity,
                    'Đơn giá': item.unitPrice,
                    'Thành tiền': item.subtotal,
                    'Phương thức': METHOD_LABEL[o.paymentMethod] || '',
                    'Tổng đơn': o.total,
                    'Nhân viên': o.createdByName || '',
                })
            })
        })

        const ws = XLSX.utils.json_to_sheet(rows)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'Orders')
        XLSX.writeFile(wb, `DonHang_${dateFrom}_${dateTo}.xlsx`)
    }

    const formatTime = (timestamp) => {
        if (!timestamp) return ''
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
        return date.toLocaleString('vi-VN', {
            hour: '2-digit', minute: '2-digit',
            day: '2-digit', month: '2-digit', year: 'numeric'
        })
    }

    return (
        <div>
            <h2 className="text-2xl font-medium text-gray-800 mb-6">Quản lý đơn hàng</h2>

            {/* Bộ lọc */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
                <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600">Từ:</label>
                        <input
                            type="date" value={dateFrom}
                            onChange={e => setDateFrom(e.target.value)}
                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600">Đến:</label>
                        <input
                            type="date" value={dateTo}
                            onChange={e => setDateTo(e.target.value)}
                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600">Bàn:</label>
                        <input
                            type="text" placeholder="A1, B2..."
                            value={filterTable}
                            onChange={e => setFilterTable(e.target.value)}
                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-24"
                        />
                    </div>
                    <button
                        onClick={fetchOrders}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                    >
                        Tìm
                    </button>
                    <button
                        onClick={exportExcel}
                        disabled={orders.length === 0}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed ml-auto"
                    >
                         Xuất Excel
                    </button>
                </div>
            </div>

            {/* Tổng quan */}
            <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500">Tổng đơn</p>
                    <p className="text-2xl font-bold text-black-600">{orders.length}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500">Doanh thu</p>
                    <p className="text-2xl font-bold text-black-600">
                        {fmt(orders.filter(o => o.status === 'paid').reduce((s, o) => s + (o.total || 0), 0))}
                    </p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500">Đã huỷ</p>
                    <p className="text-2xl font-bold text-black-600">
                        {orders.filter(o => o.status === 'cancelled').length}
                    </p>
                </div>
            </div>

            {/* Bảng đơn hàng */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="text-center text-gray-400 py-10">Đang tải...</div>
                ) : orders.length === 0 ? (
                    <div className="text-center text-gray-400 py-10">Không có đơn hàng</div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left px-4 py-3 text-gray-500 font-medium">Mã đơn</th>
                                <th className="text-left px-4 py-3 text-gray-500 font-medium">Bàn</th>
                                <th className="text-left px-4 py-3 text-gray-500 font-medium">Thời gian</th>
                                <th className="text-left px-4 py-3 text-gray-500 font-medium">Trạng thái</th>
                                <th className="text-left px-4 py-3 text-gray-500 font-medium">Phương thức</th>
                                <th className="text-left px-4 py-3 text-gray-500 font-medium">Nhân viên</th>
                                <th className="text-right px-4 py-3 text-gray-500 font-medium">Tổng tiền</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <>
                                    <tr
                                        key={order.id}
                                        className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer"
                                        onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                                    >
                                        <td className="px-4 py-3 font-mono font-bold">
                                            #{order.id.slice(-8).toUpperCase()}
                                        </td>
                                        <td className="px-4 py-3">{order.tableName}</td>
                                        <td className="px-4 py-3 text-gray-500 text-xs">{formatTime(order.createdAt)}</td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_CONFIG[order.status]?.color}`}>
                                                {STATUS_CONFIG[order.status]?.label}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">{METHOD_LABEL[order.paymentMethod] || '—'}</td>
                                        <td className="px-4 py-3 text-gray-500">{order.createdByName || '—'}</td>
                                        <td className="px-4 py-3 text-right font-bold text-green-600">{fmt(order.total || 0)}</td>
                                        <td className="px-4 py-3 text-gray-400">
                                            {expandedId === order.id ? '▲' : '▼'}
                                        </td>
                                    </tr>

                                    {/* Chi tiết món — expand */}
                                    {expandedId === order.id && (
                                        <tr key={`${order.id}-detail`} className="bg-gray-50">
                                            <td colSpan={8} className="px-6 py-3">
                                                <p className="text-xs text-gray-400 mb-2">Chi tiết món:</p>
                                                <div className="space-y-1">
                                                    {order.items?.map((item, idx) => (
                                                        <div key={idx} className="flex justify-between text-sm">
                                                            <span className="text-gray-600">
                                                                {item.name}
                                                                {item.size && <span className="text-xs text-gray-400"> (Size {item.size})</span>}
                                                                {item.toppings?.length > 0 && <span className="text-xs text-gray-400"> · {item.toppings.join(', ')}</span>}
                                                                {' '}x{item.quantity}
                                                            </span>
                                                            <span className="font-medium">{fmt(item.subtotal)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}