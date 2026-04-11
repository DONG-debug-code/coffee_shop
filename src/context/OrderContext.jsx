import { createContext, useContext, useState } from "react"
import { collection, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore"
import { dulieu } from "../data/connectdata"
import { useAuth } from "./AuthContext"

const OrderContext = createContext()

export function OrderProvider({ children }) {
    const [currentOrder, setCurrentOrder] = useState(null)
    const [selectedTable, setSelectedTable] = useState(null) // ← chỉ lưu local
    const { user } = useAuth()

    // Click bàn trống → chỉ lưu local, KHÔNG lưu Firestore
    const selectTable = (table) => {
        setSelectedTable(table)
    }

    // Mở lại order cũ (bàn đang serving)
    const openExistingOrder = (order, table) => {
        setCurrentOrder(order)
        setSelectedTable(table)
    }

    // Xác nhận order → lưu Firestore lần đầu
    const confirmItems = async (cartItems, summary) => {
        if (!selectedTable) return

        if (!currentOrder) {
            const items = cartItems.map(item => ({
                productId: item.product.id,
                name: item.product.name,
                size: item.size,
                toppings: item.toppings.map(t => t.name),
                note: item.note,
                unitPrice: item.unitPrice,
                quantity: item.quantity,
                subtotal: item.unitPrice * item.quantity,
            }))

            // ✅ Tính từ items thay vì summary
            const newSubtotal = items.reduce((sum, item) => sum + item.subtotal, 0)
            const newTotal = newSubtotal - (summary.totalDiscount || 0) + (summary.tax || 0)

            const orderData = {
                tableId: selectedTable.id,
                tableName: selectedTable.name,
                status: "open",
                items,
                subtotal: newSubtotal,   // ← sửa
                discount: summary.totalDiscount || 0,
                tax: summary.tax || 0,
                total: newTotal,         // ← sửa
                paymentMethod: null,
                couponCode: null,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                paidAt: null,
                createdBy: user?.uid || null,
            }

            const docRef = await addDoc(collection(dulieu, "orders"), orderData)

            await updateDoc(doc(dulieu, "tables", selectedTable.id), {
                status: "serving",
                currentOrderId: docRef.id,
            })

            setCurrentOrder({ id: docRef.id, ...orderData })

        } else {
            const existingItems = currentOrder.items || []
            const newItems = cartItems.map(item => ({
                productId: item.product.id,
                name: item.product.name,
                size: item.size,
                toppings: item.toppings.map(t => t.name),
                note: item.note,
                unitPrice: item.unitPrice,
                quantity: item.quantity,
                subtotal: item.unitPrice * item.quantity,
            }))

            const mergedItems = [...existingItems]
            newItems.forEach(newItem => {
                const existIdx = mergedItems.findIndex(e =>
                    e.productId === newItem.productId &&
                    e.size === newItem.size &&
                    e.toppings.join() === newItem.toppings.join() &&
                    e.note === newItem.note
                )
                if (existIdx >= 0) {
                    mergedItems[existIdx] = {
                        ...mergedItems[existIdx],
                        quantity: mergedItems[existIdx].quantity + newItem.quantity,
                        subtotal: (mergedItems[existIdx].quantity + newItem.quantity) * newItem.unitPrice,
                    }
                } else {
                    mergedItems.push(newItem)
                }
            })

            // ✅ Tính từ toàn bộ mergedItems
            const newSubtotal = mergedItems.reduce((sum, item) => sum + item.subtotal, 0)
            const newTotal = newSubtotal - (summary.totalDiscount || 0) + (summary.tax || 0)

            await updateDoc(doc(dulieu, "orders", currentOrder.id), {
                items: mergedItems,
                subtotal: newSubtotal,   // ← sửa
                discount: summary.totalDiscount || 0,
                tax: summary.tax || 0,
                total: newTotal,         // ← sửa
                updatedAt: serverTimestamp(),
            })

            setCurrentOrder(prev => ({
                ...prev,
                items: mergedItems,
                subtotal: newSubtotal,   // ← sửa
                total: newTotal,         // ← sửa
            }))
        }
    }

    //reset order + bàn
    const resetOrder = () => {
        setCurrentOrder(null)
        setSelectedTable(null)
    }

    // Thanh toán → update order + bàn về empty
    const payOrder = async ({ paymentMethod, couponCode }) => {
        if (!currentOrder) return

        await updateDoc(doc(dulieu, "orders", currentOrder.id), {
            status: "paid",
            paymentMethod,
            couponCode: couponCode || null,
            paidAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        })

        await updateDoc(doc(dulieu, "tables", currentOrder.tableId), {
            status: "empty",
            currentOrderId: null,
        })

        const paidOrder = { ...currentOrder, status: "paid", paymentMethod }
        setCurrentOrder(null)
        setSelectedTable(null)
        return paidOrder
    }

    // Huỷ order (chưa xác nhận lần nào → chỉ clear local)
    const cancelOrder = async () => {
        if (currentOrder) {
            // Đã có trên Firestore → update cancelled
            await updateDoc(doc(dulieu, "orders", currentOrder.id), {
                status: "cancelled",
                updatedAt: serverTimestamp(),
            })
            await updateDoc(doc(dulieu, "tables", currentOrder.tableId), {
                status: "empty",
                currentOrderId: null,
            })
        }
        setCurrentOrder(null)
        setSelectedTable(null)
    }

    return (
        <OrderContext.Provider value={{
            currentOrder,
            selectedTable,
            selectTable,
            openExistingOrder,
            confirmItems,
            payOrder,
            cancelOrder,
            resetOrder,
        }}>
            {children}
        </OrderContext.Provider>
    )
}

export const useOrder = () => useContext(OrderContext)