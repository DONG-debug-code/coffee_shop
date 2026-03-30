import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Map role → trang mặc định của role đó
const ROLE_HOME = {
    admin: "/admin",
    staff: "/pos",
};

/**
 * ProtectedRoute — bảo vệ route theo role
 *
 * Dùng:
 *   <ProtectedRoute allowedRole="admin"><AdminPage /></ProtectedRoute>
 *   <ProtectedRoute allowedRole="staff"><PosPage /></ProtectedRoute>
 *
 * Không cần xử lý loading ở đây vì AuthContext đã block render cho đến khi xong.
 */
const ProtectedRoute = ({ children, allowedRole }) => {
    const { user, role } = useAuth();

    // Chưa đăng nhập
    if (!user) return <Navigate to="/login" replace />;

    // Đã đăng nhập nhưng sai role
    // redirect về trang đúng của role hiện tại, không phải /login
    if (role !== allowedRole) {
        const home = ROLE_HOME[role];
        return <Navigate to={home ?? "/login"} replace />;
    }

    return children;
};

export default ProtectedRoute;


// Named exports tiện dùng nếu muốn 
export const AdminRoute = ({ children }) => (
    <ProtectedRoute allowedRole="admin">{children}</ProtectedRoute>
);

export const StaffRoute = ({ children }) => (
    <ProtectedRoute allowedRole="staff">{children}</ProtectedRoute>
);