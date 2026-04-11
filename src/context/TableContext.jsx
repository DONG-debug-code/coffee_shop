import { createContext, useContext, useState } from "react"
import { doc, updateDoc } from "firebase/firestore"
import { dulieu } from "../data/connectdata"

const TableContext = createContext()

export function TableProvider({ children }) {
    const [selectedTable, setSelectedTable] = useState(null) // bàn đang chọn

    // Cập nhật trạng thái bàn
    const updateTableStatus = async (tableId, status, orderId = null) => {
        await updateDoc(doc(dulieu, "tables", tableId), {
            status, // "empty" hoặc "serving"
            currentOrderId: orderId, // lưu orderId nếu đang phục vụ, null nếu trống
        })
    }

    // Chọn bàn → gán vào order
    const selectTable = (table) => {
        setSelectedTable(table) // Lưu bàn đang chọn vào context để các component khác dùng
    }

    // Clear bàn đã chọn (khi hủy order hoặc thanh toán xong)
    const clearSelectedTable = () => {
        setSelectedTable(null) // Xóa bàn đang chọn khỏi context, trả về trạng thái ban đầu để chọn bàn mới
    }

    return (
        <TableContext.Provider value={{ // Expose selectedTable và các hàm liên quan để các component khác dùng
            selectedTable,
            selectTable,
            clearSelectedTable,
            updateTableStatus,
        }}>
            {children}
        </TableContext.Provider>
    )
}

export const useTable = () => useContext(TableContext)