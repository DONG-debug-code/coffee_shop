import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, dulieu } from "../data/connectdata";
import { doc, getDoc } from "firebase/firestore";
import Loading from "../components/Loading";

const AuthContext = createContext(); //tạo một context để lưu trữ thông tin về người dùng và vai trò của họ, cũng như trạng thái loading khi đang kiểm tra trạng thái đăng nhập

export const AuthProvider = ({ children}) => { //nhận vào children để có thể bao bọc các component con
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async(firebaseUser) => {
            if(firebaseUser) {
                const ref = doc(dulieu, "users", firebaseUser.uid);
                const snap = await getDoc(ref);

                if(snap.exists()) {
                    const data = snap.data();
                    setUser(firebaseUser);
                    setRole(data.role);
                } else {
                    setUser(firebaseUser);
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

    if(loading) return <Loading/>
    return (
        <AuthContext.Provider value={{user, role, loading}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext); //tạo một custom hook để dễ dàng sử dụng context trong các component khác

