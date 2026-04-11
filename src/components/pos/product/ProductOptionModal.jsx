import { useState } from "react";
import { useCart } from "../../../context/CartContext";

const SIZES = [
    { label: "S", extra: 0 },
    { label: "M", extra: 5000 },
    { label: "L", extra: 10000 },
];

const TOPPINGS = [
    { id: 1, name: "Trân châu", price: 8000 },
    { id: 2, name: "Kem", price: 10000 },
    { id: 3, name: "Shot Espresso", price: 12000 },
    { id: 4, name: "Thạch trái cây", price: 8000 },
];

const fmt = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

export const ProductOptionModal = ({ product, onClose }) => {
    const { addToCart } = useCart();
    const category = product.categoryId?.toLowerCase(); // Chuẩn hoá category để dễ so sánh, tránh lỗi do viết hoa/thường. Nếu categoryId không tồn tại, coi như không có tuỳ chọn nào (size/topping) được áp dụng.

    // Quy tắc hiển thị theo category
    const hasSize = category === "tea" || category === "milktea";
    const hasTopping = category === "milktea";

    const [size, setSize] = useState(hasSize ? SIZES[1] : null);
    const [selectedToppings, setSelectedToppings] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [note, setNote] = useState("");

    // Hàm toggle cho việc chọn/bỏ chọn topping
    const toggleTopping = (topping) => { 
        setSelectedToppings(prev =>
            prev.find(t => t.id === topping.id)
                ? prev.filter(t => t.id !== topping.id)
                : [...prev, topping]
        );
    };

    const toppingTotal = selectedToppings.reduce((sum, t) => sum + t.price, 0);
    const sizeExtra = size?.extra ?? 0;
    const unitPrice = Number(product.price) + sizeExtra + toppingTotal;
    const total = unitPrice * quantity;

    // Hàm xử lý khi người dùng nhấn "Thêm vào giỏ"
    const handleAdd = () => {
        addToCart(product, {
            size: size?.label ?? null,
            toppings: selectedToppings,
            quantity,
            note,
        });
        onClose();
    };

    return (
        <div
            className="fixed inset-0 select-none bg-black/50 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex gap-4 mb-5">
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-20 h-20 rounded-xl object-cover"
                    />
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">{product.name}</h2>
                        <p className="text-blue-600 font-semibold">{fmt(product.price)}</p>
                    </div>
                </div>

                {/* Size — chỉ tea và milktea */}
                {hasSize && (
                    <div className="mb-4">
                        <p className="font-semibold text-gray-700 mb-2">Size</p>
                        <div className="flex gap-2">
                            {SIZES.map(s => (
                                <button
                                    key={s.label}
                                    onClick={() => setSize(s)}
                                    className={`flex-1 py-2 rounded-lg border font-medium text-sm transition
                                        ${size?.label === s.label
                                            ? "bg-blue-500 text-white border-blue-500"
                                            : "border-gray-300 text-gray-600 hover:border-blue-600"
                                        }`}
                                >
                                    {s.label}
                                    {s.extra > 0 && (
                                        <span className="text-xs block opacity-75">+{fmt(s.extra)}</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Topping — chỉ milktea */}
                {hasTopping && (
                    <div className="mb-4">
                        <p className="font-semibold text-gray-700 mb-2">Topping</p>
                        <div className="grid grid-cols-2 gap-2">
                            {TOPPINGS.map(t => {
                                const selected = selectedToppings.find(x => x.id === t.id);
                                return (
                                    <button
                                        key={t.id}
                                        onClick={() => toggleTopping(t)}
                                        className={`flex justify-between px-3 py-2 rounded-lg border text-sm transition
                                            ${selected
                                                ? "bg-blue-50 border-blue-500 text-blue-700"
                                                : "border-gray-200 text-gray-600 hover:border-blue-300"
                                            }`}
                                    >
                                        <span>{t.name}</span>
                                        <span>+{fmt(t.price)}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Số lượng */}
                <div className="mb-4">
                    <p className="font-semibold text-gray-700 mb-2">Số lượng</p>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                            className="w-9 h-9 bg-blue-200 rounded-full border border-transparent text-blue-700 flex items-center justify-center text-xl hover:bg-blue-300"
                        >
                            −
                        </button>
                        <span className="w-8 text-center font-bold text-lg">{quantity}</span>
                        <button
                            onClick={() => setQuantity(q => q + 1)}
                            className="w-9 h-9 bg-blue-500 rounded-full border border-transparent text-white flex items-center justify-center text-xl hover:bg-blue-400"
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Ghi chú */}
                <div className="mb-5">
                    <p className="font-semibold text-gray-700 mb-2">Ghi chú</p>
                    <input
                        type="text"
                        placeholder="Ít đá, ít đường, không đường..."
                        value={note}
                        onChange={e => setNote(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                    />
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50"
                    >
                        Huỷ
                    </button>
                    <button
                        onClick={handleAdd}
                        className="flex-1 py-3 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition"
                    >
                        Thêm {fmt(total)}
                    </button>
                </div>
            </div>
        </div>
    );
};