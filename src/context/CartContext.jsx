import { createContext, useContext, useState } from "react";

const CartContext = createContext();

const VALID_COUPONS = {
  CAFE10: { type: "percent", value: 10 },
  GIAM50K: { type: "fixed", value: 50000 },
};

const TAX_RATE = 0; // 8% thuế — đặt 0 nếu không tính thuế

const clearCart = () => setCartItems([]);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [coupon, setCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [manualDiscount, setManualDiscount] = useState({ type: "percent", value: 0 });

  // Thêm sản phẩm (với options)
  const addToCart = (product, options) => {
    const id = `${product.id}_${options.size}_${options.toppings.join(",")}_${Date.now()}`;
    setCartItems((prev) => [
      ...prev,
      {
        cartId: id,
        product,
        size: options.size,
        toppings: options.toppings,
        quantity: options.quantity,
        note: options.note,
        unitPrice: calcUnitPrice(product.price, options),
      },
    ]);
  };

  const calcUnitPrice = (basePrice, options) => {
    const sizeExtra = { S: 0, M: 5000, L: 10000 };
    const toppingExtra = options.toppings.reduce((sum, t) => sum + t.price, 0);
    return basePrice + (sizeExtra[options.size] || 0) + toppingExtra;
  };

  // Tăng/giảm số lượng
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

  // Xoá món
  const removeItem = (cartId) => {
    setCartItems((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  // Áp mã giảm giá
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

  const removeCoupon = () => {
    setCoupon(null);
    setCouponError("");
  };

  // Tính toán
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  const couponDiscount = (() => {
    if (!coupon) return 0;
    if (coupon.type === "percent") return (subtotal * coupon.value) / 100;
    return Math.min(coupon.value, subtotal);
  })();

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

  return (
    <CartContext.Provider
      value={{
        cartItems, addToCart, updateQuantity, removeItem,
        coupon, couponError, applyCoupon, removeCoupon,
        manualDiscount, setManualDiscount,
        subtotal, couponDiscount, manualDiscountAmount,
        totalDiscount, tax, total, TAX_RATE, clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);