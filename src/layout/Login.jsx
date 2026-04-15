import { doc, getDoc } from 'firebase/firestore';
import React, { useState } from 'react'
import { auth, dulieu } from '../data/connectdata';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    // Nếu đã đăng nhập rồi → redirect thẳng, không cần vào trang login
    if (loading) return null; // chờ Firebase restore session
    if (user) {
        if (user.role === "admin") return <Navigate to="/admin" replace />;
        if (user.role === "staff") return <Navigate to="/pos" replace />;
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            const res = await signInWithEmailAndPassword(auth, email, password); //đăng nhập với firebase auth
            const uid = res.user.uid; //lấy uid của user vừa đăng nhập

            const ref = doc(dulieu, "users", uid); //tham chiếu đến document user với uid vừa lấy
            const snap = await getDoc(ref); //lấy dữ liệu document

            if (!snap.exists()) { //nếu document k tồn tại
                alert("Tài khoản chưa được cấp quyền!");
                return;
            }

            const data = snap.data(); //lấy data từ document

            if (data.status !== true) { //kiểm tra trạng thái tài khoản
                setError("Tài khoản bị khóa!");
                await auth.signOut(); //đăng xuất nếu tài khoản bị khóa
                return;
            }

            // AuthContext's onAuthStateChanged sẽ tự cập nhật user
            // → ProtectedRoute / redirect ở trên sẽ xử lý điều hướng
            if (data.role === "admin") navigate("/admin"); //điều hướng theo role
            else if (data.role === "staff") navigate("/pos"); //điều hướng theo role
            else setError("Role k hợp lệ");
        } catch (err) { //nếu có lỗi trong quá trình đăng nhập
            setError("Bạn nhập sai email hoặc mật khẩu!");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-blue-300">
            <form
                onSubmit={handleLogin} autoComplete='off'
                className="bg-white p-8 rounded-xl shadow-lg w-[350px] select-none"
            >
                <h2 className="text-2xl font-medium text-center mb-6">Đăng nhập</h2>
                
                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Email
                    </label>
                    <input
                        type="text"
                        name="email"
                        autoComplete="off"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full mb-4 p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        autoComplete="new-password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full mb-4 p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="remember"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                            Ghi nhớ đăng nhập
                        </label>
                    </div>
                    <a
                        href="#"
                        className="text-sm text-blue-600 hover:text-blue-800 transition duration-200"
                    >
                        Quên mật khẩu?
                    </a>
                </div>


                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-6 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Đang đăng nhập..." : "Login"}
                </button>
            </form>
        </div>

    )
}

export default Login;