import { useState, useCallback, useMemo } from 'react'
import { Product } from '../../components/pos/product/Product'
import { Cart } from '../../components/pos/cart/Cart'
import { useOrder } from '../../context/OrderContext'
import { TablePage } from './TablePage'
import { useTable } from '../../context/TableContext'

/**
 * POSPage - Trang chính của hệ thống POS (Point of Sale)
 * Quản lý 2 view: chọn bàn và danh sách sản phẩm/giỏ hàng
 */
export const POSPage = () => {
    const { resetOrder } = useOrder()
    const [view, setView] = useState("table") // "table" hoặc "order"
    const { selectedTable, selectTable } = useTable()

    /**
     * handleSelectTable - Xử lý khi người dùng chọn một bàn
     * @param {Object} table - Object bàn được chọn
     * Chuyển sang view "order" để hiển thị sản phẩm
     */
    const handleSelectTable = useCallback((table) => {
        selectTable(table) // Cập nhật bàn được chọn vào context
        setView("order") // Chuyển sang view danh sách sản phẩm
    }, [selectTable])

    /**
     * handleBackToTable - Xử lý khi người dùng quay lại chọn bàn
     * Reset đơn hàng hiện tại và quay lại view chọn bàn
     */
    const handleBackToTable = useCallback(() => {
        setView("table") // Chuyển về view chọn bàn
        resetOrder() // Xóa đơn hàng hiện tại
    }, [resetOrder])

    /**
     * tableInfo - Thông tin bàn với fallback values
     * Tránh lỗi khi selectedTable chưa được khởi tạo
     */
    const tableInfo = useMemo(() => ({
        name: selectedTable?.name || "Chưa chọn",
        floor: selectedTable?.floor || ""
    }), [selectedTable])

    return (
        <>
            {view === "table" ? (
                // VIEW 1: Hiển thị danh sách bàn để chọn
                <div className="flex-1 overflow-y-auto bg-gray-100 select-none">
                    <div className="p-2 pl-4 bg-amber-50 border-b border-amber-200">
                        <h2 className="text-xl font-bold text-amber-700 uppercase">Chọn bàn</h2>
                    </div>
                    <TablePage onSelectTable={handleSelectTable} />
                </div>

            ) : (
                // VIEW 2: Hiển thị sản phẩm và giỏ hàng khi đã chọn bàn
                <>
                    {/* Khu vực chính: hiển thị danh sách sản phẩm */}
                    <div className="flex-1 overflow-y-auto bg-gray-100">
                        {/* Header: Hiển thị thông tin bàn được chọn */}
                        <div className="sticky top-0 select-none z-10 bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-between">
                            <span className="font-semibold text-amber-700">
                                Bàn: {tableInfo.name} — {tableInfo.floor}
                            </span>
                            {/* Button quay lại để chọn bàn khác */}
                            <button
                                onClick={handleBackToTable}
                                className="text-sm uppercase font-bold text-amber-600 hover:underline"
                                aria-label="Quay lại chọn bàn"
                            >
                                ← Thoát Bàn
                            </button>
                        </div>
                        {/* Danh sách sản phẩm */}
                        <Product />
                    </div>
                    {/* Sidebar phải: giỏ hàng */}
                    <div className="border-l border-gray-300 w-96 bg-white flex flex-col shadow-xl">
                        <Cart onConfirmed={handleBackToTable} />
                    </div>
                </>
            )}
        </>
    )
}