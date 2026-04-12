import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../data/connectdata'
import { useAuth } from '../../context/AuthContext';
import { useShift } from '../../context/ShiftContext';
import { CloseShiftModal } from './shift/CloseShiftModal';
import { OpenShiftModal } from './shift/OpenShiftModal'
import { useState } from 'react';
import { ShiftDashboard } from './shift/ShiftDashboard';

export const Header = () => {

    const { user, role } = useAuth();
    const { currentShift } = useShift()
    const [showCloseShift, setShowCloseShift] = useState(false)
    const [showOpenShift, setShowOpenShift] = useState(false)
    const [showDashboard, setShowDashboard] = useState(false)

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
        <>
            <header className="bg-blue-500 shadow-lg select-none">
                <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center space-x-3">
                        <div>
                            <h1 className="cursor-pointer select-none text-xl font-bold text-white">Coffee A Đông</h1>
                            <p className="cursor-pointer select-none text-xs text-gray-300">Màn hình POS</p>
                        </div>
                        {currentShift && (
                            <button
                                onClick={() => setShowDashboard(true)}
                                className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition"
                            >
                                Doanh thu
                            </button>
                        )}
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <p className="cursor-pointer select-none text-sm font-medium text-white">{role === "admin" ? "Admin" : "Staff"}</p>
                            <p className="cursor-pointer select-none text-xs text-gray-300">{user?.email || "Chưa đăng nhập"}</p>
                        </div>
                        {/* Chưa có ca → nút Mở ca */}
                        {!currentShift && (
                            <button
                                onClick={() => setShowOpenShift(true)}
                                className="bg-green-400 text-gray-800 px-4 py-2 rounded-sm hover:bg-green-300 transition text-sm font-medium"
                            >
                                Mở ca
                            </button>
                        )}

                        {/* Nút đóng ca — chỉ hiện khi đang có ca */}
                        {currentShift && (
                            <button
                                onClick={() => setShowCloseShift(true)}
                                className="flex items-center space-x-2 bg-yellow-400 text-gray-800 px-4 py-2 rounded-sm hover:bg-yellow-300 transition"
                            >
                                <span className="text-sm font-medium">Đóng ca</span>
                            </button>
                        )}
                        <button onClick={handleLogout} className="flex items-center space-x-2 bg-white text-blue-500 px-4 py-2 rounded-sm hover:bg-gray-200 transition">
                            <span className="text-sm font-medium">Đăng xuất</span>
                        </button>
                    </div>
                </div>
            </header>
            {showOpenShift && (
                <OpenShiftModal onClose={() => setShowOpenShift(false)} />
            )}
            {/* Modal đóng ca */}
            {showCloseShift && (
                <CloseShiftModal onClose={() => setShowCloseShift(false)} />
            )}
            {/* Modal doanh thu */}
            {showDashboard && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={() => setShowDashboard(false)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-5"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-800">Doanh thu ca</h2>
                            <button
                                onClick={() => setShowDashboard(false)}
                                className="text-gray-400 hover:text-gray-600 text-xl"
                            >
                                ×
                            </button>
                        </div>
                        <ShiftDashboard />
                    </div>
                </div>
            )}
        </>
    )
}
