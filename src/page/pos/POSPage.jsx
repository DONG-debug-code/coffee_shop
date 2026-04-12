import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { Product } from '../../components/pos/product/Product'
import { Cart } from '../../components/pos/cart/Cart'
import { useOrder } from '../../context/OrderContext'
import { TablePage } from './TablePage'
import { useTable } from '../../context/TableContext'
import { useRealtimeCollection } from '../../data/useCollection'
import { useShift } from '../../context/ShiftContext'

export const POSPage = () => {
    const { currentOrder, selectedTable: orderTable, resetOrder, transferTable, mergeTable } = useOrder()
    const { selectedTable, selectTable } = useTable()
    const { data: tables } = useRealtimeCollection("tables")
    const [view, setView] = useState("table")
    const [showTransfer, setShowTransfer] = useState(false)
    const [showMerge, setShowMerge] = useState(false)
    const { currentShift, loadingShift } = useShift()

    //ref để track currentShift mới nhất
    const currentShiftRef = useRef(currentShift)
    useEffect(() => {
        currentShiftRef.current = currentShift
    }, [currentShift])

    const handleSelectTable = useCallback((table) => {
        // ← chặn nếu chưa mở ca
        if (!currentShiftRef.current) {
            alert("Vui lòng mở ca trước khi order!")
            return
        }
        selectTable(table)
        setView("order")
    }, [selectTable])

    const handleBackToTable = useCallback(() => {
        setView("table")
        resetOrder()
        setShowTransfer(false)
        setShowMerge(false)
    }, [resetOrder])

    const tableInfo = useMemo(() => ({
        name: selectedTable?.name || orderTable?.name || "Chưa chọn",
        floor: selectedTable?.floor || orderTable?.floor || ""
    }), [selectedTable, orderTable])

    // Bàn cùng tầng đang trống (để chuyển bàn)
    const emptyTablesInFloor = tables.filter(t =>
        t.floor === tableInfo.floor &&
        t.status === "empty" &&
        t.id !== (currentOrder?.tableId || selectedTable?.id)
    )

    // Bàn cùng tầng đang serving (để gộp bàn)
    const servingTablesInFloor = tables.filter(t =>
        t.floor === tableInfo.floor &&
        t.status === "serving" &&
        t.id !== (currentOrder?.tableId || selectedTable?.id)
    )

    const handleTransfer = async (newTable) => {
        await transferTable(newTable)
        alert(`Đã chuyển bàn sang ${newTable.name}`)
        setShowTransfer(false)
        // Cập nhật selectedTable local
        selectTable(newTable)
    }

    const handleMerge = async (targetTable) => {
        await mergeTable(targetTable)
        setShowMerge(false)
        handleBackToTable()
    }

    if (loadingShift) return (
        <div className="flex-1 flex items-center justify-center text-gray-400">
            Đang tải...
        </div>
    )

    return (
        <>
            {view === "table" ? (
                <div className="flex-1 overflow-y-auto bg-gray-100 select-none">
                    <div className="p-2 pl-4 bg-amber-50 border-b border-amber-200">
                        <h2 className="text-xl font-bold text-amber-700 uppercase">Chọn bàn</h2>
                    </div>
                    <TablePage onSelectTable={handleSelectTable} />
                </div>

            ) : (
                <>
                    <div className="flex-1 overflow-y-auto bg-gray-100">
                        {/* Thanh thông tin bàn */}
                        <div className="sticky top-0 select-none z-10 bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-between">
                            <span className="font-semibold text-amber-700">
                                Bàn: {tableInfo.name} — {tableInfo.floor}
                            </span>

                            <div className="flex items-center gap-2">
                                {/* Gộp bàn */}
                                <div className="relative">
                                    <button
                                        onClick={() => { setShowMerge(!showMerge); setShowTransfer(false) }}
                                        className="text-sm px-3 py-1 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 transition font-medium"
                                    >
                                        🔀 Gộp bàn
                                    </button>
                                    {showMerge && (
                                        <div className="absolute right-0 top-9 bg-white border border-gray-200 rounded-xl shadow-lg z-20 min-w-36 overflow-hidden">
                                            <p className="px-3 py-2 text-xs text-gray-400 border-b">Chọn bàn để gộp vào</p>
                                            {servingTablesInFloor.length === 0 ? (
                                                <p className="px-4 py-3 text-sm text-gray-400">Không có bàn để gộp</p>
                                            ) : (
                                                servingTablesInFloor.map(t => (
                                                    <button
                                                        key={t.id}
                                                        onClick={() => handleMerge(t)}
                                                        className="w-full text-left px-4 py-2 text-sm hover:bg-purple-50 text-gray-700 transition"
                                                    >
                                                        {t.name}
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Chuyển bàn */}
                                <div className="relative">
                                    <button
                                        onClick={() => { setShowTransfer(!showTransfer); setShowMerge(false) }}
                                        className="text-sm px-3 py-1 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition font-medium"
                                    >
                                        🔄 Chuyển bàn
                                    </button>
                                    {showTransfer && (
                                        <div className="absolute right-0 top-9 bg-white border border-gray-200 rounded-xl shadow-lg z-20 min-w-36 overflow-hidden">
                                            <p className="px-3 py-2 text-xs text-gray-400 border-b">Chọn bàn trống</p>
                                            {emptyTablesInFloor.length === 0 ? (
                                                <p className="px-4 py-3 text-sm text-gray-400">Không có bàn trống</p>
                                            ) : (
                                                emptyTablesInFloor.map(t => (
                                                    <button
                                                        key={t.id}
                                                        onClick={() => handleTransfer(t)}
                                                        className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 text-gray-700 transition"
                                                    >
                                                        {t.name}
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Thoát bàn */}
                                <button
                                    onClick={handleBackToTable}
                                    className="text-sm uppercase font-bold text-amber-600 hover:underline"
                                >
                                    ← Thoát Bàn
                                </button>
                            </div>
                        </div>

                        <Product />
                    </div>

                    <div className="border-l border-gray-300 w-96 bg-white flex flex-col shadow-xl">
                        <Cart onConfirmed={handleBackToTable} />
                    </div>
                </>
            )}
        </>
    )
}