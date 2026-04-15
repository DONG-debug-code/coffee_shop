import { onAuthStateChanged, signOut } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, dulieu } from "../data/connectdata";
import { doc, getDoc } from "firebase/firestore";
import Loading from "../components/Loading";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const ref = doc(dulieu, "users", firebaseUser.uid);
                    const snap = await getDoc(ref);

                    if (snap.exists()) {
                        const data = snap.data();

                        // Kiểm tra tài khoản bị khóa
                        if (data.status !== true) {
                            await signOut(auth);
                            setUser(null);
                            setRole(null);
                        } else {
                            setUser(firebaseUser);
                            setRole(data.role ?? null);
                        }
                    } else {
                        // Document không tồn tại → chưa được cấp quyền
                        await signOut(auth);
                        setUser(null);
                        setRole(null);
                    }
                } catch {
                    // Lỗi mạng / Firestore → logout cho an toàn
                    setUser(null);
                    setRole(null);
                }
            } else {
                setUser(null);
                setRole(null);
            }

            setLoading(false);
        });

        return () => unsub();
    }, []);

    // Expose logout để các component dùng, không cần import auth/signOut ở nơi khác
    const logout = () => signOut(auth);

    // Loading xử lý 1 nơi duy nhất tại đây — các Route không cần check lại
    if (loading) return <Loading />;

    return (
        <AuthContext.Provider value={{ user, role, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);