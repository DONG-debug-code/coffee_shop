import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../data/connectdata'
import { useAuth } from '../../context/AuthContext';

export const Header = () => {

    const {user, role} = useAuth();

    const navigate = useNavigate();

    const handleLogout = async () => {
        const confirmLogout = window.confirm("Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?");
        if (!confirmLogout) return;
        try {
            await signOut(auth);
            navigate("/login");
        } catch (err) {
            console.error("Logout error:", err);
            alert("Đăng xuất thất bại!");

        }
    }

    return (
        <header className="bg-blue-500 shadow-lg select-none">
            <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center space-x-3">
                    <div>
                        <h1 className="cursor-pointer select-none text-xl font-bold text-white">Coffee A Đông</h1>
                        <p className="cursor-pointer select-none text-xs text-gray-300">Màn hình POS</p>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="text-right">
                        <p className="cursor-pointer select-none text-sm font-medium text-white">{role === "admin" ? "Admin" : "Staff"}</p>
                        <p className="cursor-pointer select-none text-xs text-gray-300">{user?.email || "Chưa đăng nhập"}</p>
                    </div>
                    <button onClick={handleLogout} className="flex items-center space-x-2 bg-white text-blue-500 px-4 py-2 rounded-sm hover:bg-gray-200 transition">
                        <span className="text-sm font-medium">Đăng xuất</span>
                    </button>
                </div>
            </div>
        </header>
    )
}
