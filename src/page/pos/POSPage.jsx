
import { useState } from 'react'
import { Product } from '../../components/pos/product/Product'
import { Cart } from '../../components/pos/cart/Cart'
import { useTable } from '../../context/TableContext'
import { TablePage } from './TablePage'

export const POSPage = () => {
    const { selectedTable, selectTable } = useTable()
    const [view, setView] = useState("table") // "table" | "order"

    const handleSelectTable = (table) => {
        selectTable(table)
        setView("order") // sau khi chọn bàn → vào màn order
    }

    return (
        <>
            {view === "table" ? (
                // Màn chọn bàn
                <div className="flex-1 overflow-y-auto bg-gray-100">
                    <div className="p-4 bg-white border-b">
                        <h2 className="text-xl font-bold">Chọn bàn</h2>
                    </div>
                    <TablePage onSelectTable={handleSelectTable} />
                </div>
            ) : (
                // Màn order (có bàn đã chọn)
                <>
                    <div className="flex-1 overflow-y-auto bg-gray-100">
                        {/* Thanh hiển thị bàn đang chọn */}
                        <div className="sticky top-0 z-10 bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-between">
                            <span className="font-semibold text-amber-700">
                                🪑 {selectedTable?.name} — {selectedTable?.floor}
                            </span>
                            <button
                                onClick={() => setView("table")}
                                className="text-sm text-amber-600 hover:underline"
                            >
                                Thoát bàn
                            </button>
                        </div>
                        <Product />
                    </div>
                    <div className="border-l border-gray-300 w-96 bg-white flex flex-col shadow-xl">
                        <Cart />
                    </div>
                </>
            )}
        </>
    )
}