import React from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../../data/connectdata'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export const Header = () => {

    // Lấy thông tin user từ context
    const { user, role } = useAuth();

    // Chuyển hướng
    const navigate = useNavigate();

    // Hàm xử lý đăng xuất
    const handleLogout = async () => {
        const confirmLogout = window.confirm("Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?");
        if (!confirmLogout) return;

        try {
            await signOut(auth); // Đăng xuất khỏi Firebase Auth
            navigate("/login"); // Chuyển hướng về trang đăng nhập
        } catch (err) {
            console.error("Logout error:", err);
            alert("Đăng xuất thất bại!");

        }
    }

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-blue-500 shadow-lg select-none ">
            <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center space-x-3">
                    <div>
                        <h1 className="cursor-pointer select-none text-xl font-bold text-white">Coffee A Đông</h1>
                        <p className="cursor-pointer select-none text-xs text-gray-300">Hệ thống quản lý</p>
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
