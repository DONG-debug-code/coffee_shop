import { createContext, useContext, useState } from "react"
import { doc, updateDoc } from "firebase/firestore"
import { dulieu } from "../data/connectdata"

const TableContext = createContext()

export function TableProvider({ children }) {
    const [selectedTable, setSelectedTable] = useState(null) // bàn đang chọn

    // Cập nhật trạng thái bàn
    const updateTableStatus = async (tableId, status, orderId = null) => {
        await updateDoc(doc(dulieu, "tables", tableId), {
            status,
            currentOrderId: orderId,
        })
    }

    // Chọn bàn → gán vào order
    const selectTable = (table) => {
        setSelectedTable(table)
    }

    const clearSelectedTable = () => {
        setSelectedTable(null)
    }

    return (
        <TableContext.Provider value={{
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