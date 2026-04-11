const fmt = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)

export const OrderedItem = ({ item }) => {
    return (
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 mb-2 opacity-80">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <p className="font-semibold text-gray-700 text-sm">{item.name}</p>
                    <p className="text-xs text-gray-400">
                        {item.size && `Size ${item.size}`}
                        {item.toppings?.length > 0 && ` · ${item.toppings.join(', ')}`}
                    </p>
                    {item.note && (
                        <p className="text-xs text-amber-600 italic">📝 {item.note}</p>
                    )}
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-500">x{item.quantity}</p>
                    <p className="text-sm font-bold text-blue-600">{fmt(item.subtotal)}</p>
                </div>
            </div>
        </div>
    )
}