// src/components/pos/shift/OpenShiftModal.jsx
import { useState } from "react"
import { useShift } from "../../../context/ShiftContext"

const fmt = (n) => new Intl.NumberFormat('vi-VN').format(n) + 'đ'

export const OpenShiftModal = ({onClose }) => {
    const { openShift } = useShift()
    const [openingCash, setOpeningCash] = useState("")
    const [loading, setLoading] = useState(false)

    const handleOpen = async () => {
        setLoading(true)
        await openShift(openingCash || 0)
        setLoading(false)
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
                <div className="text-center mb-5">
                    <h2 className="text-xl font-bold text-gray-800">Mở ca làm việc</h2>
                    <p className="text-gray-400 text-sm mt-1">Nhập tiền đầu ca để bắt đầu</p>
                </div>

                <div className="mb-5">
                    <p className="font-semibold text-gray-700 mb-2">Tiền đầu ca</p>
                    <input
                        type="number"
                        placeholder="0đ"
                        value={openingCash}
                        onChange={e => setOpeningCash(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-blue-400"
                    />
                    <div className="flex gap-2 mt-2 flex-wrap">
                        {[200000, 500000, 1000000, 2000000].map(v => (
                            <button
                                key={v}
                                onClick={() => setOpeningCash(v)}
                                className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm"
                            >
                                {fmt(v)}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={handleOpen}
                    disabled={loading}
                    className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl text-lg disabled:bg-gray-300 transition"
                >
                    {loading ? "Đang mở ca..." : "Bắt đầu ca"}
                </button>
            </div>
        </div>
    )
}