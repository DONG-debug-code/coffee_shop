import { createContext, useContext, useState } from "react"
import { collection, addDoc, updateDoc, doc, serverTimestamp, query, where, getDocs } from "firebase/firestore"
import { dulieu } from "../data/connectdata"
import { useAuth } from "./AuthContext"

const OrderContext = createContext()

export function OrderProvider({ children }) {
    const [currentOrder, setCurrentOrder] = useState(null) // order đang thao tác (mới tạo hoặc đã có sẵn)
    const [selectedTable, setSelectedTable] = useState(null) // ← chỉ lưu local
    const { user } = useAuth()

    // Click bàn trống → chỉ lưu local, KHÔNG lưu Firestore
    const selectTable = (table) => {
        setSelectedTable(table) // Lưu bàn đang chọn vào context để các component khác dùng
    }

    // Mở lại order cũ (bàn đang serving)
    const openExistingOrder = (order, table) => {
        setCurrentOrder(order) // Lưu order đang thao tác vào context để các component khác dùng
        setSelectedTable(table) // Đồng thời gán luôn bàn vào context để các component khác dùng, tránh lỗi mất bàn khi reload page hoặc chuyển view
    }

    // Xác nhận order → lưu Firestore lần đầu
    const confirmItems = async (cartItems, summary) => {
        if (!selectedTable) return // An toàn nếu lỡ gọi confirmItems mà chưa chọn bàn, tránh lỗi null reference

        if (!currentOrder) { // Chưa có order nào → tạo mới
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

            // Tính từ items thay vì summary
            const newSubtotal = items.reduce((sum, item) => sum + item.subtotal, 0)
            const newTotal = newSubtotal - (summary.totalDiscount || 0) + (summary.tax || 0)

            const orderData = { // Dữ liệu order mới
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
                createdByName: user?.displayName || user?.email || null, 
            }

            const docRef = await addDoc(collection(dulieu, "orders"), orderData) // Tạo order mới trên Firestore, lấy docRef để có ID

            await updateDoc(doc(dulieu, "tables", selectedTable.id), { // Cập nhật trạng thái bàn sang serving và lưu currentOrderId để dễ truy xuất sau này
                status: "serving",
                currentOrderId: docRef.id,
            })

            setCurrentOrder({ id: docRef.id, ...orderData }) // Lưu order đang thao tác vào context để các component khác dùng, có ID từ Firestore

        } else { // Đã có order → cập nhật items (gộp với items cũ nếu cùng sản phẩm + tuỳ chọn), subtotal, total
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

            // Tính từ toàn bộ mergedItems
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

    // Chuyển bàn: order hiện tại → bàn mới
    const transferTable = async (newTable) => {
        if (!currentOrder) return

        // Cập nhật order → tableId mới
        await updateDoc(doc(dulieu, "orders", currentOrder.id), {
            tableId: newTable.id,
            tableName: newTable.name,
            updatedAt: serverTimestamp(),
        })

        // Bàn cũ → empty
        await updateDoc(doc(dulieu, "tables", currentOrder.tableId), {
            status: "empty",
            currentOrderId: null,
        })

        // Bàn mới → serving
        await updateDoc(doc(dulieu, "tables", newTable.id), {
            status: "serving",
            currentOrderId: currentOrder.id,
        })

        setCurrentOrder(prev => ({
            ...prev,
            tableId: newTable.id,
            tableName: newTable.name,
        }))
        setSelectedTable(newTable)
    }

    // Gộp bàn: bàn hiện tại → gộp vào bàn đích
    const mergeTable = async (targetTable) => {
        if (!currentOrder) return

        // Lấy order của bàn đích
        const q = query(
            collection(dulieu, "orders"),
            where("tableId", "==", targetTable.id),
            where("status", "==", "open")
        )
        const snap = await getDocs(q)

        let mergedItems = [...(currentOrder.items || [])]
        let targetOrderId = null

        if (!snap.empty) {
            // Bàn đích đã có order → gộp món
            const targetOrder = snap.docs[0]
            targetOrderId = targetOrder.id
            const targetItems = targetOrder.data().items || []

            targetItems.forEach(targetItem => {
                const existIdx = mergedItems.findIndex(e =>
                    e.productId === targetItem.productId &&
                    e.size === targetItem.size &&
                    e.toppings.join() === targetItem.toppings.join() &&
                    e.note === targetItem.note
                )
                if (existIdx >= 0) {
                    mergedItems[existIdx] = {
                        ...mergedItems[existIdx],
                        quantity: mergedItems[existIdx].quantity + targetItem.quantity,
                        subtotal: (mergedItems[existIdx].quantity + targetItem.quantity) * mergedItems[existIdx].unitPrice,
                    }
                } else {
                    mergedItems.push(targetItem)
                }
            })

            // Tính lại tổng
            const newSubtotal = mergedItems.reduce((sum, i) => sum + i.subtotal, 0)

            // Cập nhật order bàn đích
            await updateDoc(doc(dulieu, "orders", targetOrderId), {
                items: mergedItems,
                subtotal: newSubtotal,
                total: newSubtotal,
                updatedAt: serverTimestamp(),
            })

            // Huỷ order bàn hiện tại
            await updateDoc(doc(dulieu, "orders", currentOrder.id), {
                status: "cancelled",
                updatedAt: serverTimestamp(),
            })
            alert(`Đã gộp bàn vào ${targetTable.name}`)
        } else {
            // Bàn đích chưa có order → tạo mới
            const newSubtotal = mergedItems.reduce((sum, i) => sum + i.subtotal, 0)
            const newOrderData = {
                ...currentOrder,
                tableId: targetTable.id,
                tableName: targetTable.name,
                subtotal: newSubtotal,
                total: newSubtotal,
                updatedAt: serverTimestamp(),
            }
            delete newOrderData.id
            const docRef = await addDoc(collection(dulieu, "orders"), newOrderData)
            targetOrderId = docRef.id

            // Huỷ order bàn hiện tại
            await updateDoc(doc(dulieu, "orders", currentOrder.id), {
                status: "cancelled",
                updatedAt: serverTimestamp(),
            })

            // Bàn đích → serving
            await updateDoc(doc(dulieu, "tables", targetTable.id), {
                status: "serving",
                currentOrderId: targetOrderId,
            })
        }

        // Bàn hiện tại → empty
        await updateDoc(doc(dulieu, "tables", currentOrder.tableId), {
            status: "empty",
            currentOrderId: null,
        })

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
            transferTable, mergeTable,
        }}>
            {children}
        </OrderContext.Provider>
    )
}

export const useOrder = () => useContext(OrderContext)