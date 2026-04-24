// src/page/admin/SchedulePage.jsx
import { useState, useEffect } from 'react'
import { collection, getDocs, query, where, setDoc, doc } from 'firebase/firestore'
import { dulieu } from '../../data/connectdata'
import { useRealtimeCollection } from '../../data/useCollection'
import { SHIFT_CONFIG, DAYS_OF_WEEK } from '../../constants/shifts'
import * as XLSX from 'xlsx'
import { Navigation } from '../../components/admin/dashboard/Navigation'
import { Annotation } from '../../components/admin/dashboard/Annotation'
import { Cable } from '../../components/admin/dashboard/Cable'

const getWeekDates = (weekStart) => {
    const dates = []
    const [yyyy, mm, dd] = weekStart.split('-').map(Number)
    const start = new Date(yyyy, mm - 1, dd) // ← dùng local constructor
    for (let i = 0; i < 7; i++) {
        const d = new Date(start)
        d.setDate(start.getDate() + i)
        const y = d.getFullYear()
        const m = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        dates.push(`${y}-${m}-${day}`)
    }
    return dates
}

const getMonday = (date) => {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    const day = d.getDay() // 0=CN, 1=T2, ..., 6=T7
    const diff = day === 0 ? -6 : 1 - day
    d.setDate(d.getDate() + diff)
    //Dùng local date thay vì toISOString()
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
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

            {/*điều hướng */}
            <Navigation 
                schedule={schedule}
                staffList={staffList}
                weekStart={weekStart}
                handleSave={handleSave}
                handleExportExcel={handleExportExcel}
                saving={saving}
                prevWeek={prevWeek}
                nextWeek={nextWeek}
                weekEnd={weekEnd}
            />

            {/* Chú thích ca */}
            <Annotation 
                
            />

            {/* Bảng ca */}
           <Cable 
                weekDates={weekDates}
                staffList={staffList}
                schedule={schedule}
                toggleShift={toggleShift}
                calcTotalHours={calcTotalHours}
           />

        </div>
    )
}