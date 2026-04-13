import { useShift } from '../../../context/ShiftContext'

const fmt = (n) => new Intl.NumberFormat('vi-VN').format(n) + 'đ'

const METHOD_LABEL = {
    cash: 'Tiền mặt',
    transfer: 'Chuyển khoản',
    qr: 'QR / Ví điện tử',
    card: 'Thẻ',
}

export const ShiftDashboard = () => {
    const { currentShift } = useShift()

    if (!currentShift) return null

    const formatTime = (timestamp) => {
        if (!timestamp) return ''
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
        return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    }

    return (
        <>
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-700">Ca làm việc</h3>
                <span className="text-xs text-gray-400">Bắt đầu: {formatTime(currentShift?.startTime)}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-xl p-3 shadow-sm">
                    <p className="text-xs text-gray-400 mb-1">Tổng đơn</p>
                    <p className="text-2xl font-bold text-blue-600">{currentShift.totalOrders || 0}</p>
                </div>
                <div className="bg-white rounded-xl p-3 shadow-sm">
                    <p className="text-xs text-gray-400 mb-1">Doanh thu</p>
                    <p className="text-xl font-bold text-green-600">{fmt(currentShift.totalRevenue || 0)}</p>
                </div>
            </div>

            {/* Theo phương thức */}
            {currentShift.revenueByMethod && Object.values(currentShift.revenueByMethod).some(v => v > 0) && (
                <div className="mt-3 bg-white rounded-xl p-3 shadow-sm">
                    <p className="text-xs text-gray-400 mb-2">Theo phương thức</p>
                    {Object.entries(currentShift.revenueByMethod).map(([method, amount]) =>
                        amount > 0 ? (
                            <div key={method} className="flex justify-between text-sm mb-1">
                                <span className="text-gray-500">{METHOD_LABEL[method]}:</span>
                                <span className="font-semibold">{fmt(amount)}</span>
                            </div>
                        ) : null
                    )}
                </div>
            )}
        </>
    )
}