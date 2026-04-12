import { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'

const fmt = (n) => new Intl.NumberFormat('vi-VN').format(n) + 'đ'

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

    const handlePrint = useReactToPrint({
        contentRef: receiptRef,  // ← dùng contentRef thay vì content
        documentTitle: `HoaDon_${order.tableName}_${Date.now()}`,
        pageStyle: `
            @page { size: 80mm auto; margin: 0; }
            @media print { body { margin: 0; } }
        `,
    })

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-4 max-h-screen overflow-y-auto">

                {/* Preview */}
                <div
                    ref={receiptRef}
                    style={{
                        width: '100%',
                        maxWidth: '302px',
                        margin: '0 auto',
                        fontFamily: '"Courier New", Courier, monospace',
                        fontSize: '12px',
                        color: '#000',
                        backgroundColor: '#fff',
                        padding: '12px',
                        boxSizing: 'border-box',
                    }}
                >
                    {/* Header */}
                    <p style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '15px', margin: '0 0 2px' }}>COFFEE A ĐÔNG</p>
                    <p style={{ textAlign: 'center', margin: '0 0 2px' }}>SĐT: 0797306295</p>
                    <p style={{ textAlign: 'center', fontWeight: 'bold', margin: '0 0 8px' }}>HOÁ ĐƠN THANH TOÁN</p>

                    <div style={{ borderTop: '1px dashed #000', margin: '6px 0' }} />

                    {/* Thông tin */}
                    {[
                        ['Bàn:', order.tableName],
                        ['Mã đơn:', order.id?.slice(-8).toUpperCase()],
                        ['Thời gian:', formatTime(order.paidAt || order.createdAt)],
                        ['Thu ngân:', order.createdByName || order.createdBy?.split('@')[0] || 'Staff'],
                    ].map(([label, value]) => (
                        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                            <span>{label}</span>
                            <span style={{ fontWeight: 'bold', textAlign: 'right', marginLeft: '8px' }}>{value}</span>
                        </div>
                    ))}

                    <div style={{ borderTop: '1px dashed #000', margin: '6px 0' }} />

                    {/* Món */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: '4px', borderBottom: '1px dashed #000', paddingBottom: '4px' }}>
                        <span>Món</span>
                        <span>Thành tiền</span>
                    </div>

                    {order.items?.map((item, idx) => (
                        <div key={idx} style={{ marginBottom: '4px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ flex: 1, marginRight: '8px' }}>{item.name} x{item.quantity}</span>
                                <span style={{ whiteSpace: 'nowrap' }}>{fmt(item.subtotal)}</span>
                            </div>
                            {item.size && (
                                <div style={{ fontSize: '10px', color: '#666', paddingLeft: '8px' }}>
                                    Size {item.size}{item.toppings?.length > 0 ? ` · ${item.toppings.join(', ')}` : ''}
                                </div>
                            )}
                            {item.note && (
                                <div style={{ fontSize: '10px', color: '#666', paddingLeft: '8px', fontStyle: 'italic' }}>
                                    📝 {item.note}
                                </div>
                            )}
                        </div>
                    ))}

                    <div style={{ borderTop: '1px dashed #000', margin: '6px 0' }} />

                    {/* Tổng */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                        <span>Tạm tính:</span>
                        <span>{fmt(order.subtotal || 0)}</span>
                    </div>
                    {order.discount > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                            <span>Giảm giá:</span>
                            <span>-{fmt(order.discount)}</span>
                        </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '14px', borderTop: '1px solid #000', paddingTop: '4px', marginTop: '4px' }}>
                        <span>TỔNG CỘNG:</span>
                        <span>{fmt(order.total || 0)}</span>
                    </div>

                    <div style={{ borderTop: '1px dashed #000', margin: '6px 0' }} />

                    {/* Thanh toán */}
                    {[
                        ['Phương thức:', { cash: 'Tiền mặt', transfer: 'Chuyển khoản', qr: 'QR / Ví điện tử', card: 'Thẻ' }[order.paymentMethod] || ''],
                        ...(order.paymentMethod === 'cash' ? [
                            ['Khách đưa:', fmt(order.amountPaid || 0)],
                            ['Tiền thối:', fmt(order.change || 0)],
                        ] : []),
                    ].map(([label, value]) => (
                        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                            <span>{label}</span>
                            <span style={{ fontWeight: 'bold' }}>{value}</span>
                        </div>
                    ))}

                    <div style={{ borderTop: '1px dashed #000', margin: '6px 0' }} />

                    {/* Footer */}
                    <p style={{ textAlign: 'center', margin: '4px 0 2px' }}>Cảm ơn quý khách!</p>
                    <p style={{ textAlign: 'center', margin: '0' }}>Hẹn gặp lại lần sau 😊</p>
                </div>

                {/* Nút */}
                <div className="flex gap-3 mt-4">
                    <button onClick={onClose} className="flex-1 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50">
                        Đóng
                    </button>
                    <button
                        onClick={handlePrint}
                        className="flex-1 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700"
                    >
                        In / Xuất PDF
                    </button>
                </div>
            </div>
        </div>
    )
}