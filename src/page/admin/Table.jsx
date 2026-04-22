// src/page/admin/Table.jsx
import { useState } from 'react'
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'
import { dulieu } from '../../data/connectdata'
import { useRealtimeCollection } from '../../data/useCollection'

const STATUS_CONFIG = {
    empty:   { label: 'Trống',        color: 'bg-green-100 text-green-700' },
    serving: { label: 'Đang phục vụ', color: 'bg-red-100 text-red-700' },
}

const FLOORS = ['Tầng 1', 'Tầng 2', 'Tầng 3']

const defaultForm = { name: '', floor: 'Tầng 1' }

export const Table = () => {
    const { data: tables, loading } = useRealtimeCollection('tables')
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState(defaultForm)
    const [editId, setEditId] = useState(null)
    const [saving, setSaving] = useState(false)

    // Nhóm theo tầng
    const floors = [...new Set(tables.map(t => t.floor))].sort()

    const handleOpenAdd = () => {
        setForm(defaultForm)
        setEditId(null)
        setShowForm(true)
    }

    const handleOpenEdit = (table) => {
        setForm({ name: table.name, floor: table.floor })
        setEditId(table.id)
        setShowForm(true)
    }

    const handleSave = async () => {
        if (!form.name.trim()) return alert('Vui lòng nhập tên bàn!')
        setSaving(true)
        try {
            if (editId) {
                await updateDoc(doc(dulieu, 'tables', editId), {
                    name: form.name.trim(),
                    floor: form.floor,
                })
            } else {
                await addDoc(collection(dulieu, 'tables'), {
                    name: form.name.trim(),
                    floor: form.floor,
                    status: 'empty',
                    currentOrderId: null,
                    createdAt: serverTimestamp(),
                })
            }
            setShowForm(false)
            setForm(defaultForm)
            setEditId(null)
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (table) => {
        if (table.status === 'serving') {
            alert('Không thể xoá bàn đang phục vụ!')
            return
        }
        if (!window.confirm(`Xoá bàn ${table.name}?`)) return
        await deleteDoc(doc(dulieu, 'tables', table.id))
    }

    if (loading) return <div className="text-gray-400">Đang tải...</div>

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-medium text-gray-800">Quản lý bàn</h2>
                <button
                    onClick={handleOpenAdd}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm font-medium"
                >
                    + Thêm bàn
                </button>
            </div>

            {/* Form thêm/sửa */}
            {showForm && (
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
                    <h3 className="font-semibold text-gray-700 mb-4">
                        {editId ? 'Sửa bàn' : 'Thêm bàn mới'}
                    </h3>
                    <div className="flex gap-4 items-end">
                        <div>
                            <label className="text-sm text-gray-600 mb-1 block">Tên bàn</label>
                            <input
                                type="text"
                                placeholder="VD: A1, B2..."
                                value={form.name}
                                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-40"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600 mb-1 block">Tầng</label>
                            <select
                                value={form.floor}
                                onChange={e => setForm(f => ({ ...f, floor: e.target.value }))}
                                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                            >
                                {FLOORS.map(f => (
                                    <option key={f} value={f}>{f}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 disabled:bg-gray-300"
                            >
                                {saving ? 'Đang lưu...' : editId ? 'Cập nhật' : 'Thêm'}
                            </button>
                            <button
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50"
                            >
                                Huỷ
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Danh sách bàn theo tầng */}
            {floors.map(floor => (
                <div key={floor} className="mb-6">
                    <h3 className="font-semibold text-gray-600 mb-3 flex items-center gap-2">
                        {floor}
                        <span className="text-xs text-gray-400 font-normal">
                            ({tables.filter(t => t.floor === floor).length} bàn)
                        </span>
                    </h3>
                    <div className="grid grid-cols-4 gap-3">
                        {tables
                            .filter(t => t.floor === floor)
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map(table => {
                                const config = STATUS_CONFIG[table.status] || STATUS_CONFIG.empty
                                return (
                                    <div
                                        key={table.id}
                                        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-lg font-bold text-gray-800">{table.name}</span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.color}`}>
                                                {config.label}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-400 mb-3">{table.floor}</p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleOpenEdit(table)}
                                                className="flex-1 py-1 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                onClick={() => handleDelete(table)}
                                                disabled={table.status === 'serving'}
                                                className="flex-1 py-1 text-xs bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
                                            >
                                                Xoá
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                    </div>
                </div>
            ))}

            {tables.length === 0 && (
                <div className="text-center text-gray-400 py-10">
                    Chưa có bàn nào. Bấm "Thêm bàn" để tạo mới.
                </div>
            )}
        </div>
    )
}