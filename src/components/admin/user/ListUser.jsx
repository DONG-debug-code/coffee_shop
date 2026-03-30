import React from 'react'
import { UserItem } from './UserItem'
import { dulieu, secondaryAuth } from '../../../data/connectdata';
import { deleteDoc, doc } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';

export const ListUser = ({ user, setUser }) => {

    const ADMIN_EMAIL = "admin@gmail.com";
    const ADMIN_PASSWORD = "admin123";

    const handleDeleteForever = async (uid) => {
        if (!window.confirm("Xóa vĩnh viễn? Không thể khôi phục!")) return;

        try {
            // 1. login admin bằng secondaryAuth
            await signInWithEmailAndPassword(secondaryAuth, ADMIN_EMAIL, ADMIN_PASSWORD);

            // 2. lấy token
            const idToken = await secondaryAuth.currentUser.getIdToken();

            // 3. xóa user trong Firebase Auth bằng REST API
            await fetch(
                `https://identitytoolkit.googleapis.com/v1/accounts:delete?key=${import.meta.env.VITE_FIREBASE_API_KEY}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        localId: uid,
                        idToken
                    })
                }
            );

            // 4. xóa firestore
            await deleteDoc(doc(dulieu, "users", uid));

            // 5. update UI
            // setUser(prev => prev.filter(item => item.uid !== uid));

            alert("Đã xóa user khỏi Auth + Firestore!");

        } catch (error) {
            console.error("DELETE USER ERROR:", error);
            alert("Lỗi xóa user!");
        }
    };


    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 cursor-pointer select-none text-left text-xs font-medium text-gray-500 uppercase">STT</th>
                        <th className="px-6 py-3 cursor-pointer select-none text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 cursor-pointer select-none text-left text-xs font-medium text-gray-500 uppercase">Phân quyền</th>
                        <th className="px-6 py-3 cursor-pointer select-none text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                        <th className="px-6 py-3 cursor-pointer select-none text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 select-none">
                    {
                        user.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-6 text-gray-500">
                                    Danh sách người dùng trống!
                                </td>
                            </tr>

                        ) : (
                            user.map((item, index) => (
                                <UserItem
                                    index={index}
                                    key={item.uid}
                                    setUser={setUser}
                                    useritem={item}
                                    onDelete={()=>handleDeleteForever(item.uid)}
                                />
                            ))
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}
