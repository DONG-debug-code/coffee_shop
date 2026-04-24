export const getMonday = (date) => {
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