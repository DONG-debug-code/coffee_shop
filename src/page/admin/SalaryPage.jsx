// src/page/admin/SalaryPage.jsx
import { useState, useEffect } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { dulieu } from '../../data/connectdata'
import { useRealtimeCollection } from '../../data/useCollection'
import { SHIFT_CONFIG } from '../../constants/shifts'
import * as XLSX from 'xlsx'

const fmt = (n) => new Intl.NumberFormat('vi-VN').format(Math.round(n)) + 'đ'

export const SalaryPage = () => {
    const { data: staffList } = useRealtimeCollection("staffs")
    const [month, setMonth] = useState(() => {
        const d = new Date()
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    })
    const [salaryData, setSalaryData] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (staffList.length) calcSalary()
    }, [month, staffList])

    const calcSalary = async () => {
        setLoading(true)
        try {
            const [year, mon] = month.split('-').map(Number)
            const monthStart = new Date(year, mon - 1, 1).toISOString().split('T')[0]
            const monthEnd = new Date(year, mon, 0).toISOString().split('T')[0]

            // Lấy tất cả schedules trong tháng
            const snap = await getDocs(query(
                collection(dulieu, 'schedules'),
                where('weekStart', '>=', monthStart),
                where('weekStart', '<=', monthEnd)
            ))
            const schedules = snap.docs.map(d => d.data())

            const result = staffList.map(staff => {
                // Tìm tất cả schedules của nhân viên này trong tháng
                const staffSchedules = schedules.filter(s => s.staffId === staff.id)

                // Tính tổng giờ
                let totalHours = 0
                staffSchedules.forEach(sc => {
                    Object.values(sc.shifts || {}).forEach(dayShifts => {
                        dayShifts.forEach(shift => {
                            totalHours += SHIFT_CONFIG[shift]?.hours || 0
                        })
                    })
                })

                const hourlyRate = staff.salary || 0
                const totalSalary = totalHours * hourlyRate

                return {
                    ...staff,
                    totalHours,
                    hourlyRate,
                    totalSalary,
                }
            })

            setSalaryData(result)
        } finally {
            setLoading(false)
        }
    }

    const exportExcel = () => {
        const rows = [
            ['STT', 'Họ tên', 'Chức vụ', 'Lương/h', 'Tổng giờ', 'Tổng lương'],
            ...salaryData.map((s, i) => [
                i + 1, s.fullName, s.position,
                s.hourlyRate, s.totalHours, s.totalSalary
            ])
        ]
        const ws = XLSX.utils.aoa_to_sheet(rows)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, `Luong ${month}`)
        XLSX.writeFile(wb, `BangLuong_${month}.xlsx`)
    }

    return (
        <div>
            <h2 className="text-2xl font-medium text-gray-800 mb-6">Bảng lương tháng</h2>

            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <label className="text-sm text-gray-600">Tháng:</label>
                    <input
                        type="month" value={month}
                        onChange={e => setMonth(e.target.value)}
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                    />
                </div>
                <button
                    onClick={exportExcel}
                    disabled={salaryData.length === 0}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 disabled:bg-gray-300"
                >
                    Xuất Excel
                </button>
            </div>

            {loading ? (
                <div className="text-center text-gray-400 py-10">Đang tính lương...</div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="text-left px-4 py-3 text-gray-500 font-medium">STT</th>
                                <th className="text-left px-4 py-3 text-gray-500 font-medium">Họ tên</th>
                                <th className="text-left px-4 py-3 text-gray-500 font-medium">Chức vụ</th>
                                <th className="text-right px-4 py-3 text-gray-500 font-medium">Lương/h</th>
                                <th className="text-right px-4 py-3 text-gray-500 font-medium">Tổng giờ</th>
                                <th className="text-right px-4 py-3 text-gray-500 font-medium">Tổng lương</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {salaryData.map((staff, idx) => (
                                <tr key={staff.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-gray-500">{idx + 1}</td>
                                    <td className="px-4 py-3 font-semibold">{staff.fullName}</td>
                                    <td className="px-4 py-3 text-gray-500">{staff.position}</td>
                                    <td className="px-4 py-3 text-right">{fmt(staff.hourlyRate)}</td>
                                    <td className="px-4 py-3 text-right font-semibold text-blue-600">{staff.totalHours}h</td>
                                    <td className="px-4 py-3 text-right font-bold text-green-600">{fmt(staff.totalSalary)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="border-t-2 border-gray-200 bg-gray-50">
                            <tr>
                                <td colSpan={4} className="px-4 py-3 font-bold text-gray-700">Tổng cộng</td>
                                <td className="px-4 py-3 text-right font-bold text-blue-600">
                                    {salaryData.reduce((s, d) => s + d.totalHours, 0)}h
                                </td>
                                <td className="px-4 py-3 text-right font-bold text-green-600">
                                    {fmt(salaryData.reduce((s, d) => s + d.totalSalary, 0))}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}
        </div>
    )
}