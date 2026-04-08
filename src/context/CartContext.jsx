import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { dulieu } from "../data/connectdata";
import { useTable } from "./TableContext";

const CartContext = createContext();

//Mã giảm giá hợp lệ (mở rộng sau này)
const VALID_COUPONS = {
  CAFE10: { type: "percent", value: 10 },
  GIAM50K: { type: "fixed", value: 50000 },
};

// Thuế VAT (nếu có)
const TAX_RATE = 0;

//CartProvider quản lý trạng thái giỏ hàng, mã giảm giá, và xử lý thanh toán
export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [coupon, setCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [manualDiscount, setManualDiscount] = useState({ type: "percent", value: 0 });
  const { user } = useAuth();
  const { selectedTable, updateTableStatus, clearSelectedTable } = useTable();

  // Lọc size và topping theo categoryId
  const normalizeOptions = (categoryId, options) => { // Nếu category là drink/coffee thì bỏ qua size/topping dù có chọn
    const cat = categoryId?.toLowerCase(); // Chuẩn hoá để tránh lỗi do viết hoa/thường
    if (cat === "drink" || cat === "coffee") {
      return { ...options, size: null, toppings: [] };
    }
    if (cat === "tea") {
      return { ...options, toppings: [] };
    }
    // milktea: giữ nguyên
    return options;
  };

  // Thêm sản phẩm vào giỏ hàng với các tuỳ chọn
  const addToCart = (product, options) => {
    const normalized = normalizeOptions(product.categoryId, options); // Chuẩn hoá tuỳ chọn theo category
    const id = `${product.id}_${normalized.size}_${normalized.toppings.join(",")}_${Date.now()}`; // Tạo cartId duy nhất dựa trên productId, tuỳ chọn và timestamp
    setCartItems((prev) => [
      ...prev,
      {
        cartId: id,
        product,
        size: normalized.size,
        toppings: normalized.toppings,
        quantity: normalized.quantity,
        note: normalized.note,
        unitPrice: calcUnitPrice(product.price, normalized),
      },
    ]);
  };

  // Hàm tính giá đơn vị dựa trên giá gốc và tuỳ chọn
  const calcUnitPrice = (basePrice, options) => {
    const sizeExtra = { S: 0, M: 5000, L: 10000 };
    const toppingExtra = (options.toppings || []).reduce((sum, t) => sum + t.price, 0);
    return Number(basePrice) + (options.size ? sizeExtra[options.size] || 0 : 0) + toppingExtra;
  };

  // Cập nhật số lượng sản phẩm trong giỏ
  const updateQuantity = (cartId, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.cartId === cartId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Xoá sản phẩm khỏi giỏ
  const removeItem = (cartId) => {
    setCartItems((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  //clearCart nằm trong CartProvider
  const clearCart = () => {
    setCartItems([]);
    setCoupon(null);
    setCouponError("");
    setManualDiscount({ type: "percent", value: 0 });
  };

  // Áp dụng mã giảm giá
  const applyCoupon = (code) => {
    const found = VALID_COUPONS[code.toUpperCase()];
    if (found) {
      setCoupon({ code: code.toUpperCase(), ...found });
      setCouponError("");
    } else {
      setCoupon(null);
      setCouponError("Mã không hợp lệ!");
    }
  };

  // Xoá mã giảm giá
  const removeCoupon = () => {
    setCoupon(null);
    setCouponError("");
  };

  // Tính toán
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity, 0
  );

  // Tính giảm giá từ mã và giảm giá thủ công
  const couponDiscount = (() => {
    if (!coupon) return 0;
    if (coupon.type === "percent") return (subtotal * coupon.value) / 100;
    return Math.min(coupon.value, subtotal);
  })();


  // Giảm giá thủ công (theo % hoặc số tiền)
  const manualDiscountAmount = (() => {
    if (!manualDiscount.value) return 0;
    if (manualDiscount.type === "percent")
      return (subtotal * manualDiscount.value) / 100;
    return Math.min(manualDiscount.value, subtotal);
  })();

  const totalDiscount = couponDiscount + manualDiscountAmount;
  const afterDiscount = Math.max(subtotal - totalDiscount, 0);
  const tax = afterDiscount * TAX_RATE;
  const total = afterDiscount + tax;

  //Checkout — lưu đơn hàng vào Firestore
  const checkout = async ({ paymentMethod, amountPaid }) => { // paymentMethod: "cash" hoặc "card", amountPaid chỉ cần nếu cash
    const orderData = {
      orderCode: `ORD-${Date.now()}`,
      status: "paid",
      paymentMethod,
      items: cartItems.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        size: item.size,
        toppings: item.toppings.map((t) => t.name),
        note: item.note,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        subtotal: item.unitPrice * item.quantity,
      })),
      subtotal,
      discount: couponDiscount + manualDiscountAmount,
      total,
      amountPaid: paymentMethod === "cash" ? amountPaid : total, // Nếu thanh toán bằng thẻ, coi như khách đã trả đủ
      change: paymentMethod === "cash" ? amountPaid - total : 0, // Tiền thối nếu thanh toán bằng tiền mặt
      couponCode: coupon?.code || null, // Lưu lại mã giảm giá đã áp dụng (nếu có)
      createdAt: serverTimestamp(),
      createdBy: user?.uid || null, // Lưu lại UID người tạo đơn (nếu đã đăng nhập) để tiện quản lý
      tableId: selectedTable?.id || null,
      tableName: selectedTable?.name || null,
    };

    const docRef = await addDoc(collection(dulieu, "orders"), orderData); // Lưu đơn hàng vào Firestore
    // Cập nhật trạng thái bàn → paid
    if (selectedTable) {
      await updateTableStatus(selectedTable.id, "paid", null)
      clearSelectedTable()
    }

    clearCart();
    return { id: docRef.id, ...orderData };
  };

  return (
    <CartContext.Provider
      value={{ // Các state và hàm liên quan đến giỏ hàng sẽ được expose ở đây để các component khác sử dụng
        cartItems, addToCart, updateQuantity, removeItem, clearCart,
        coupon, couponError, applyCoupon, removeCoupon,
        manualDiscount, setManualDiscount,
        subtotal, couponDiscount, manualDiscountAmount,
        totalDiscount, total, TAX_RATE, checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);