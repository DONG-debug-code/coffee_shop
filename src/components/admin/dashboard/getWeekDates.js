export const getWeekDates = (weekStart) => {
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