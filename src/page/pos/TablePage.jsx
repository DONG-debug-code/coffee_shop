import { useTable } from "../../context/TableContext";
import { useRealtimeCollection } from "../../data/useCollection";

const STATUS_CONFIG = {
    empty:   { label: "Trống",          color: "bg-green-100 border-green-400 text-green-700" },
    serving: { label: "Đang phục vụ",   color: "bg-red-100 border-red-400 text-red-700" },
    paid:    { label: "Đã thanh toán",  color: "bg-blue-100 border-blue-400 text-blue-700" },
}

export const TablePage = ({ onSelectTable }) => {
    const { data: tables, loading } = useRealtimeCollection("tables");
    const { selectedTable } = useTable();

    // Nhóm bàn theo tầng
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
                                const isSelected = selectedTable?.id === table.id
                                return (
                                    <button
                                        key={table.id}
                                        onClick={() => onSelectTable(table)}
                                        className={`
                                            p-4 rounded-xl border-2 font-semibold transition
                                            ${config.color}
                                            ${isSelected ? "ring-2 ring-blue-400 ring-offset-1" : ""}
                                            ${table.status === "serving" ? "cursor-pointer" : ""}
                                        `}
                                    >
                                        <p className="text-lg">{table.name}</p>
                                        <p className="text-xs mt-1">{config.label}</p>
                                        <p className="text-xs opacity-60">{table.capacity}</p>
                                    </button>
                                )
                            })}
                    </div>
                </div>
            ))}
        </div>
    )
}