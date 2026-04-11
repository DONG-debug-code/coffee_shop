
import { collection, query, where, getDocs } from "firebase/firestore"
import { useRealtimeCollection } from "../../data/useCollection"
import { useOrder } from "../../context/OrderContext"
import { dulieu } from "../../data/connectdata"

const STATUS_CONFIG = {
    empty: { label: "Trống", color: "bg-green-100 border-green-400 text-green-700" },
    serving: { label: "Đang phục vụ", color: "bg-red-100 border-red-400 text-red-700" },
}

export const TablePage = ({ onSelectTable, onCleanTable }) => {
    const { data: tables, loading } = useRealtimeCollection("tables")
    const { selectTable, openExistingOrder } = useOrder()

    const handleClickTable = async (table) => {
        if (table.status === "empty") {
            //Chỉ lưu local, không động Firestore
            selectTable(table)
            onSelectTable(table)

        } else if (table.status === "serving") {
            // Lấy order đang mở
            const q = query(
                collection(dulieu, "orders"),
                where("tableId", "==", table.id),
                where("status", "==", "open")
            )
            const snap = await getDocs(q)
            console.log("Số order tìm được:", snap.size)

            if (!snap.empty) {
                const orderDoc = snap.docs[0]
                console.log("Order data:", orderDoc.data()) 
                openExistingOrder({ id: orderDoc.id, ...orderDoc.data() }, table)
                onSelectTable(table)
            } else {
                console.log("Không tìm thấy order nào!") 
            }
        }
    }

    const floors = [...new Set(tables.map(t => t.floor))].sort()

    if (loading) return <div className="p-4 text-gray-400">Đang tải...</div>

    return (
        <div className="p-4">
            {floors.map(floor => (
                <div key={floor} className="mb-6">
                    <h3 className="font-bold text-gray-600 mb-3">{floor}</h3>
                    <div className="grid grid-cols-6 gap-6">
                        {tables
                            .filter(t => t.floor === floor)
                            .map(table => {
                                const config = STATUS_CONFIG[table.status] || STATUS_CONFIG.empty
                                return (
                                    <button
                                        key={table.id}
                                        onClick={() => handleClickTable(table)}
                                        className={`p-4 h-35 rounded-xl border-2 font-semibold transition hover:opacity-80 ${config.color}`}
                                    >
                                        <p className="text-lg">{table.name}</p>
                                        <p className="text-xs mt-1">{config.label}</p>
                                    </button>
                                )
                            })}
                    </div>
                </div>
            ))}
        </div>
    )
}