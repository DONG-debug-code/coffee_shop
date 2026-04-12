import { useRef } from 'react'
import jsPDF from 'jspdf'
import { useReactToPrint } from 'react-to-print'

const fmt = (n) => new Intl.NumberFormat('vi-VN').format(n) + 'd'

const formatTime = (timestamp) => {
    if (!timestamp) return ''
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    })
}

export const Receipt = ({ order, onClose }) => {
    const receiptRef = useRef()

    // In ra máy in
    const handlePrint = useReactToPrint({
        content: () => receiptRef.current,
        pageStyle: `
            @page { size: 80mm auto; margin: 0; }
            @media print { body { margin: 0; } }
        `,
    })

    // Xuất PDF bằng jsPDF thuần (không dùng html2canvas)
    const handleExportPDF = () => {
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: [80, 297],
        })

        const lineHeight = 5
        const pageWidth = 80
        const marginX = 5
        let y = 8

        const center = (text) => {
            const textWidth = doc.getTextWidth(text)
            return (pageWidth - textWidth) / 2
        }

        const line = (dashed = false) => {
            if (dashed) {
                doc.setLineDashPattern([1, 1], 0)
            } else {
                doc.setLineDashPattern([], 0)
            }
            doc.line(marginX, y, pageWidth - marginX, y)
            y += 4
        }

        const row = (left, right, bold = false) => {
            doc.setFont('helvetica', bold ? 'bold' : 'normal')
            doc.text(left, marginX, y)
            doc.text(right, pageWidth - marginX, y, { align: 'right' })
            y += lineHeight
        }

        const text = (content, align = 'left', bold = false, size = 10) => {
            doc.setFontSize(size)
            doc.setFont('helvetica', bold ? 'bold' : 'normal')
            const x = align === 'center' ? center(content) : align === 'right' ? pageWidth - marginX : marginX
            doc.text(content, x, y, align === 'center' ? { align: 'center' } : {})
            y += lineHeight
        }

        // Header
        doc.setFontSize(14)
        text('COFFEE A DONG', 'center', true, 14)
        doc.setFontSize(10)
        text('SDT: 0797306295', 'center')
        text('HOA DON THANH TOAN', 'center', true)
        y += 2
        line(true)

        // Thông tin order
        doc.setFontSize(9)
        row('Ban:', order.tableName || '')
        row('Ma don:', order.id?.slice(-8).toUpperCase() || '')
        row('Thoi gian:', formatTime(order.paidAt || order.createdAt))
        row('Thu ngan:', order.createdByName || order.createdBy?.split('@')[0] || 'Staff')
        y += 1
        line(true)

        // Danh sách món
        doc.setFontSize(9)
        row('Mon', 'Thanh tien', true)
        line(true)

        order.items?.forEach(item => {
            const nameText = `${item.name} x${item.quantity}`
            doc.setFont('helvetica', 'normal')
            doc.text(nameText, marginX, y)
            doc.text(fmt(item.subtotal), pageWidth - marginX, y, { align: 'right' })
            y += lineHeight

            if (item.size) {
                doc.setFontSize(8)
                doc.setTextColor(100)
                doc.text(`  Size ${item.size}${item.toppings?.length > 0 ? ' - ' + item.toppings.join(', ') : ''}`, marginX, y)
                y += lineHeight - 1
                doc.setFontSize(9)
                doc.setTextColor(0)
            }
            if (item.note) {
                doc.setFontSize(8)
                doc.setTextColor(100)
                doc.text(`  Note: ${item.note}`, marginX, y)
                y += lineHeight - 1
                doc.setFontSize(9)
                doc.setTextColor(0)
            }
        })

        y += 1
        line(true)

        // Tổng tiền
        row('Tam tinh:', fmt(order.subtotal || 0))
        if (order.discount > 0) row('Giam gia:', `-${fmt(order.discount)}`)
        if (order.tax > 0) row('Thue:', fmt(order.tax))
        y += 1
        line(false)
        row('TONG CONG:', fmt(order.total || 0), true)
        y += 1
        line(true)

        // Thanh toán
        const methodLabel = {
            cash: 'Tien mat',
            transfer: 'Chuyen khoan',
            qr: 'QR / Vi dien tu',
            card: 'The',
        }[order.paymentMethod] || order.paymentMethod || ''

        row('Phuong thuc:', methodLabel)
        if (order.paymentMethod === 'cash') {
            row('Khach dua:', fmt(order.amountPaid || 0))
            row('Tien thoi:', fmt(order.change || 0))
        }
        y += 1
        line(true)

        // Footer
        y += 2
        text('Cam on quy khach!', 'center')
        text('Hen gap lai lan sau', 'center')

        doc.save(`HoaDon_${order.tableName}_${Date.now()}.pdf`)
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-4 max-h-screen overflow-y-auto">

                {/* Preview hoá đơn */}
                <div
                    ref={receiptRef}
                    style={{
                        width: '302px',
                        fontFamily: 'monospace',
                        backgroundColor: '#ffffff',
                        padding: '12px',
                        fontSize: '12px',
                        color: '#000000',
                    }}
                    className="mx-auto border border-gray-200 rounded"
                >
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                        <p style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>COFFEE A ĐÔNG</p>
                        <p style={{ margin: '2px 0' }}>SĐT: 0797306295</p>
                        <p style={{ fontWeight: 'bold', margin: '4px 0 0' }}>HOÁ ĐƠN THANH TOÁN</p>
                    </div>

                    <div style={{ borderTop: '1px dashed #000', margin: '8px 0' }} />

                    {/* Thông tin */}
                    {[
                        ['Bàn:', order.tableName],
                        ['Mã đơn:', order.id?.slice(-8).toUpperCase()],
                        ['Thời gian:', formatTime(order.paidAt || order.createdAt)],
                        ['Thu ngân:', order.createdByName || order.createdBy?.split('@')[0] || 'Staff'],
                    ].map(([label, value]) => (
                        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                            <span>{label}</span>
                            <span style={{ fontWeight: 'bold' }}>{value}</span>
                        </div>
                    ))}

                    <div style={{ borderTop: '1px dashed #000', margin: '8px 0' }} />

                    {/* Món */}
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '8px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px dashed #000' }}>
                                <th style={{ textAlign: 'left', paddingBottom: '4px' }}>Món</th>
                                <th style={{ textAlign: 'center', paddingBottom: '4px' }}>SL</th>
                                <th style={{ textAlign: 'right', paddingBottom: '4px' }}>T.Tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items?.map((item, idx) => (
                                <tr key={idx}>
                                    <td style={{ padding: '2px 4px 2px 0' }}>
                                        <div>{item.name}</div>
                                        {item.size && <div style={{ fontSize: '10px', color: '#666' }}>Size {item.size}{item.toppings?.length > 0 && ` · ${item.toppings.join(', ')}`}</div>}
                                        {item.note && <div style={{ fontSize: '10px', color: '#666', fontStyle: 'italic' }}>📝 {item.note}</div>}
                                    </td>
                                    <td style={{ textAlign: 'center' }}>x{item.quantity}</td>
                                    <td style={{ textAlign: 'right' }}>{fmt(item.subtotal)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div style={{ borderTop: '1px dashed #000', margin: '8px 0' }} />

                    {/* Tổng */}
                    {[
                        ['Tạm tính:', fmt(order.subtotal || 0)],
                        ...(order.discount > 0 ? [['Giảm giá:', `-${fmt(order.discount)}`]] : []),
                        ...(order.tax > 0 ? [['Thuế:', fmt(order.tax)]] : []),
                    ].map(([label, value]) => (
                        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                            <span>{label}</span><span>{value}</span>
                        </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '14px', borderTop: '1px solid #000', paddingTop: '4px', marginTop: '4px' }}>
                        <span>TỔNG CỘNG:</span><span>{fmt(order.total || 0)}</span>
                    </div>

                    <div style={{ borderTop: '1px dashed #000', margin: '8px 0' }} />

                    {/* Thanh toán */}
                    {[
                        ['Phương thức:', { cash: 'Tiền mặt', transfer: 'Chuyển khoản', qr: 'QR / Ví điện tử', card: 'Thẻ' }[order.paymentMethod] || ''],
                        ...(order.paymentMethod === 'cash' ? [
                            ['Khách đưa:', fmt(order.amountPaid || 0)],
                            ['Tiền thối:', fmt(order.change || 0)],
                        ] : []),
                    ].map(([label, value]) => (
                        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                            <span>{label}</span><span style={{ fontWeight: 'bold' }}>{value}</span>
                        </div>
                    ))}

                    <div style={{ borderTop: '1px dashed #000', margin: '8px 0' }} />

                    <div style={{ textAlign: 'center', marginTop: '8px' }}>
                        <p style={{ margin: '2px 0' }}>Cảm ơn quý khách!</p>
                        <p style={{ margin: '2px 0' }}>Hẹn gặp lại lần sau 😊</p>
                    </div>
                </div>

                {/* Nút */}
                <div className="flex gap-3 mt-4">
                    <button onClick={onClose} className="flex-1 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50">
                        Đóng
                    </button>
                    <button onClick={handlePrint} className="flex-1 py-2 rounded-xl border border-blue-300 text-blue-600 font-semibold hover:bg-blue-50">
                        In
                    </button>
                    <button onClick={handleExportPDF} className="flex-1 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700">
                        PDF
                    </button>
                </div>
            </div>
        </div>
    )
}