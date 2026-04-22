// src/page/admin/SchedulePage.jsx
import { useState, useEffect } from 'react'
import { collection, getDocs, query, where, setDoc, doc } from 'firebase/firestore'
import { dulieu } from '../../data/connectdata'
import { useRealtimeCollection } from '../../data/useCollection'
import { SHIFT_CONFIG, DAYS_OF_WEEK } from '../../constants/shifts'
import * as XLSX from 'xlsx'

const getWeekDates = (weekStart) => {
    const dates = []
    const start = new Date(weekStart)
    for (let i = 0; i < 7; i++) {
        const d = new Date(start)
        d.setDate(start.getDate() + i)
        dates.push(d.toISOString().split('T')[0])
    }
    return dates
}

const getMonday = (date) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    d.setDate(diff)
    return d.toISOString().split('T')[0]
}

export const SchedulePage = () => {
    const { data: staffList } = useRealtimeCollection("staffs")
    const [weekStart, setWeekStart] = useState(() => getMonday(new Date()))
    const [schedule, setSchedule] = useState({}) // { staffId: { date: [shifts] } }
    const [saving, setSaving] = useState(false)

    const weekDates = getWeekDates(weekStart)
    const weekEnd = weekDates[6]

    useEffect(() => {
        fetchSchedule()
    }, [weekStart, staffList])

    const fetchSchedule = async () => {
        if (!staffList.length) return
        const q = query(
            collection(dulieu, 'schedules'),
            where('weekStart', '==', weekStart)
        )
        const snap = await getDocs(q)
        const result = {}
        snap.docs.forEach(d => {
            const data = d.data()
            result[data.staffId] = data.shifts || {}
        })
        // Khởi tạo nhân viên chưa có lịch
        staffList.forEach(s => {
            if (!result[s.id]) {
                result[s.id] = {}
                weekDates.forEach(date => { result[s.id][date] = [] })
            }
        })
        setSchedule(result)
    }

    const toggleShift = (staffId, date, shift) => {
        setSchedule(prev => {
            const current = prev[staffId]?.[date] || []
            const updated = current.includes(shift)
                ? current.filter(s => s !== shift)
                : [...current, shift]
            return {
                ...prev,
                [staffId]: { ...prev[staffId], [date]: updated }
            }
        })
    }

    const calcTotalHours = (staffId) => {
        const staffSchedule = schedule[staffId] || {}
        return Object.values(staffSchedule).reduce((total, shifts) => {
            return total + shifts.reduce((sum, s) => sum + (SHIFT_CONFIG[s]?.hours || 0), 0)
        }, 0)
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            for (const staff of staffList) {
                const staffSchedule = schedule[staff.id] || {}
                const totalHours = calcTotalHours(staff.id)
                const docId = `${staff.id}_${weekStart}`
                await setDoc(doc(dulieu, 'schedules', docId), {
                    staffId: staff.id,
                    staffName: staff.fullName,
                    weekStart,
                    weekEnd,
                    shifts: staffSchedule,
                    totalHours,
                    updatedAt: new Date(),
                })
            }
            alert("Đã lưu bảng ca!")
        } finally {
            setSaving(false)
        }
    }

    const handleExportExcel = () => {
        const rows = []

        // Header row
        const header = ['Nhân viên', 'Lương/h', ...weekDates.map((d, i) => `${DAYS_OF_WEEK[i]} (${d.slice(5)})`), 'Tổng giờ', 'Tổng lương']
        rows.push(header)

        staffList.forEach(staff => {
            const row = [staff.fullName, staff.salary || 0]
            weekDates.forEach(date => {
                const shifts = schedule[staff.id]?.[date] || []
                row.push(shifts.map(s => SHIFT_CONFIG[s]?.label).join(', ') || 'Nghỉ')
            })
            const totalHours = calcTotalHours(staff.id)
            row.push(totalHours)
            row.push(totalHours * (staff.salary || 0))
            rows.push(row)
        })

        const ws = XLSX.utils.aoa_to_sheet(rows)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, `Ca làm ${weekStart}`)
        XLSX.writeFile(wb, `BangCa_${weekStart}.xlsx`)
    }

    const prevWeek = () => {
        const d = new Date(weekStart)
        d.setDate(d.getDate() - 7)
        setWeekStart(d.toISOString().split('T')[0])
    }

    const nextWeek = () => {
        const d = new Date(weekStart)
        d.setDate(d.getDate() + 7)
        setWeekStart(d.toISOString().split('T')[0])
    }

    return (
        <div>
            <h2 className="text-2xl font-medium text-gray-800 mb-6">Bảng ca làm việc</h2>

            {/* Điều hướng tuần */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <button onClick={prevWeek} className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">←</button>
                    <span className="font-semibold text-gray-700">
                        Tuần: {weekStart} → {weekEnd}
                    </span>
                    <button onClick={nextWeek} className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">→</button>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleExportExcel}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
                    >
                        Xuất Excel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 disabled:bg-gray-300"
                    >
                        {saving ? "Đang lưu..." : "Lưu bảng ca"}
                    </button>
                </div>
            </div>

            {/* Chú thích ca */}
            <div className="flex gap-3 mb-4">
                {Object.entries(SHIFT_CONFIG).map(([key, config]) => (
                    <div key={key} className={`px-3 py-1 rounded-lg border text-xs font-medium ${config.color}`}>
                        {config.label} ({config.time})
                    </div>
                ))}
            </div>

            {/* Bảng ca */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="text-left px-4 py-3 text-gray-500 font-medium min-w-40">Nhân viên</th>
                            {weekDates.map((date, i) => (
                                <th key={date} className="px-3 py-3 text-gray-500 font-medium text-center min-w-32">
                                    <div>{DAYS_OF_WEEK[i]}</div>
                                    <div className="text-xs font-normal text-gray-400">{date.slice(5)}</div>
                                </th>
                            ))}
                            <th className="px-4 py-3 text-gray-500 font-medium text-center">Tổng giờ</th>
                            <th className="px-4 py-3 text-gray-500 font-medium text-right">Tổng lương</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {staffList.map(staff => (
                            <tr key={staff.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    <p className="font-semibold text-gray-800">{staff.fullName}</p>
                                    <p className="text-xs text-gray-400">{staff.position}</p>
                                    <p className="text-xs text-gray-400">{(staff.salary || 0).toLocaleString('vi-VN')}đ/h</p>
                                </td>
                                {weekDates.map(date => {
                                    const shifts = schedule[staff.id]?.[date] || []
                                    return (
                                        <td key={date} className="px-2 py-2">
                                            <div className="flex flex-col gap-1">
                                                {Object.entries(SHIFT_CONFIG).map(([key, config]) => (
                                                    <button
                                                        key={key}
                                                        onClick={() => toggleShift(staff.id, date, key)}
                                                        className={`px-2 py-1 rounded border text-xs font-medium transition
                                                            ${shifts.includes(key)
                                                                ? config.color
                                                                : 'bg-gray-50 border-gray-200 text-gray-300 hover:border-gray-400'
                                                            }`}
                                                    >
                                                        {config.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </td>
                                    )
                                })}
                                <td className="px-4 py-3 text-center font-bold text-blue-600">
                                    {calcTotalHours(staff.id)}h
                                </td>
                                <td className="px-4 py-3 text-right font-bold text-green-600">
                                    {(calcTotalHours(staff.id) * (staff.salary || 0)).toLocaleString('vi-VN')}đ
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}