// src/context/ShiftContext.jsx
import { createContext, useContext, useState, useEffect } from "react"
import {
    collection, addDoc, updateDoc, doc,
    serverTimestamp, query, where, getDocs, orderBy, limit
} from "firebase/firestore"
import { dulieu } from "../data/connectdata"
import { useAuth } from "./AuthContext"

const ShiftContext = createContext()

export function ShiftProvider({ children }) {
    const [currentShift, setCurrentShift] = useState(null)
    const [loadingShift, setLoadingShift] = useState(true)
    const { user } = useAuth()

    // Kiểm tra ca đang mở khi load
    useEffect(() => {
        if (!user) {
            setLoadingShift(false)
            return
        }
        checkOpenShift()
    }, [user])

    const checkOpenShift = async () => {
        setLoadingShift(true)
        try {
            const q = query(
                collection(dulieu, "shifts"),
                where("staffId", "==", user.uid),
                where("status", "==", "open"),
                limit(1)
            )
            const snap = await getDocs(q)
            if (!snap.empty) {
                setCurrentShift({ id: snap.docs[0].id, ...snap.docs[0].data() })
            } else {
                setCurrentShift(null)
            }
        } finally {
            setLoadingShift(false)
        }
    }

    // Mở ca
    const openShift = async (openingCash) => {
        const now = Date.now()
        const shiftData = {
            staffId: user.uid,
            staffName: user.displayName || user.email,
            status: "open",
            openingCash: Number(openingCash),
            closingCash: null,
            totalOrders: 0,
            totalRevenue: 0,
            revenueByMethod: { cash: 0, transfer: 0, qr: 0, card: 0 },
            startTime: serverTimestamp(),
            startTimeMs: now,
            endTime: null,
        }
        const docRef = await addDoc(collection(dulieu, "shifts"), shiftData)
        setCurrentShift({ id: docRef.id, ...shiftData })
    }

    // Cập nhật ca khi có đơn mới thanh toán
    const updateShiftOnOrder = async (order) => {
        if (!currentShift) return
        const method = order.paymentMethod || "cash"
        const revenue = order.total || 0

        await updateDoc(doc(dulieu, "shifts", currentShift.id), {
            totalOrders: (currentShift.totalOrders || 0) + 1,
            totalRevenue: (currentShift.totalRevenue || 0) + revenue,
            [`revenueByMethod.${method}`]: (currentShift.revenueByMethod?.[method] || 0) + revenue,
        })

        setCurrentShift(prev => ({
            ...prev,
            totalOrders: (prev.totalOrders || 0) + 1,
            totalRevenue: (prev.totalRevenue || 0) + revenue,
            revenueByMethod: {
                ...prev.revenueByMethod,
                [method]: (prev.revenueByMethod?.[method] || 0) + revenue,
            }
        }))
    }

    // Tính báo cáo ca từ Firestore orders
    const getShiftReport = async () => {
        if (!currentShift) return null
        const shiftStartMs = currentShift.startTimeMs || 0
        const q = query(
            collection(dulieu, "orders"),
            where("createdBy", "==", user.uid),
            where("status", "==", "paid"),
        )
        const snap = await getDocs(q)
        const orders = snap.docs.map(d => ({ id: d.id, ...d.data() }))

        // Lọc đơn trong ca hiện tại
        const shiftOrders = orders.filter(o => {
            const paidAt = o.paidAt?.toDate?.()?.getTime()
            return paidAt && paidAt >= shiftStartMs
        })

        const totalRevenue = shiftOrders.reduce((sum, o) => sum + (o.total || 0), 0)
        const revenueByMethod = shiftOrders.reduce((acc, o) => {
            const m = o.paymentMethod || "cash"
            acc[m] = (acc[m] || 0) + (o.total || 0)
            return acc
        }, {})

        return {
            totalOrders: shiftOrders.length,
            totalRevenue,
            revenueByMethod,
            orders: shiftOrders,
        }
    }

    // Đóng ca
    const closeShift = async (closingCash) => {
        if (!currentShift) return
        const report = await getShiftReport()

        await updateDoc(doc(dulieu, "shifts", currentShift.id), {
            status: "closed",
            closingCash: Number(closingCash),
            totalOrders: report.totalOrders,
            totalRevenue: report.totalRevenue,
            revenueByMethod: report.revenueByMethod,
            endTime: serverTimestamp(),
        })

        setCurrentShift(null)
        return report
    }

    return (
        <ShiftContext.Provider value={{
            currentShift,
            loadingShift,
            openShift,
            closeShift,
            updateShiftOnOrder,
            getShiftReport,
        }}>
            {children}
        </ShiftContext.Provider>
    )
}

export const useShift = () => useContext(ShiftContext)