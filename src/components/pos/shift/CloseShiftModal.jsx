// src/components/pos/shift/CloseShiftModal.jsx
import { useState, useEffect } from "react"
import { useShift } from "../../../context/ShiftContext"

const fmt = (n) => new Intl.NumberFormat('vi-VN').format(n) + 'đ'

const METHOD_LABEL = {
    cash: 'Tiền mặt',
    transfer: 'Chuyển khoản',
    qr: 'QR / Ví điện tử',
    card: 'Thẻ',
}

export const CloseShiftModal = ({ onClose }) => {
    const { currentShift, closeShift, getShiftReport } = useShift()
    const [closingCash, setClosingCash] = useState("")
    const [report, setReport] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        loadReport()
    }, [])

    const loadReport = async () => {
        const r = await getShiftReport()
        setReport(r)
    }

    const handleClose = async () => {
        setLoading(true)
        await closeShift(closingCash || 0)
        setLoading(false)
        onClose()
    }

    const formatTime = (timestamp) => {
        if (!timestamp) return ''
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
        return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white select-none rounded-2xl p-6 w-full max-w-sm shadow-xl">
                <div className="text-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Đóng ca</h2>
                    <p className="text-gray-400 text-sm">
                        Ca bắt đầu: {formatTime(currentShift?.startTime)}
                    </p>
                </div>

                {/* Báo cáo ca */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-2">
                    <p className="font-semibold text-gray-700 mb-2">Tổng kết ca</p>

                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Tổng đơn:</span>
                        <span className="font-semibold">{report?.totalOrders || 0} đơn</span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Tổng doanh thu:</span>
                        <span className="font-bold text-green-600">{fmt(report?.totalRevenue || 0)}</span>
                    </div>

                    <div className="border-t border-gray-200 pt-2 mt-2">
                        <p className="text-xs text-gray-400 mb-1">Theo phương thức:</p>
                        {Object.entries(report?.revenueByMethod || {}).map(([method, amount]) =>
                            amount > 0 ? (
                                <div key={method} className="flex justify-between text-sm">
                                    <span className="text-gray-500">{METHOD_LABEL[method]}:</span>
                                    <span>{fmt(amount)}</span>
                                </div>
                            ) : null
                        )}
                    </div>

                    <div className="flex justify-between text-sm border-t border-gray-200 pt-2">
                        <span className="text-gray-500">Tiền đầu ca:</span>
                        <span>{fmt(currentShift?.openingCash || 0)}</span>
                    </div>
                </div>

                {/* Tiền thực tế */}
                <div className="mb-4">
                    <p className="font-semibold text-gray-700 mb-2">Tiền thực tế đếm được</p>
                    <input
                        type="number"
                        placeholder="0đ"
                        value={closingCash}
                        onChange={e => setClosingCash(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-blue-400"
                    />
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50"
                    >
                        Huỷ
                    </button>
                    <button
                        onClick={handleClose}
                        disabled={loading}
                        className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:bg-gray-300 transition"
                    >
                        {loading ? "Đang đóng..." : "Đóng ca"}
                    </button>
                </div>
            </div>
        </div>
    )
}