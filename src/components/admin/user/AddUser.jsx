import { addDoc, collection, doc, getFirestore, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { useState } from 'react'
import { auth, dulieu } from '../../../data/connectdata';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { secondaryAuth } from '../../../data/connectdata';


export const AddUser = ({ setUser, changeAddUserFormStatusFalse }) => {


    //state chứa dl trên form
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("staff");
    const [status, setStatus] = useState("");

    //hàm thêm
    const handAddUser = async (e) => {
        e.preventDefault();
        if (!email.trim() || !password.trim() || !role.trim()) {
            alert("Vui lòng nhập đủ thông tin!");
            return;
        }

        try {
            //tạo tk auth
            const res = await createUserWithEmailAndPassword(secondaryAuth, email, password); //tạo user với auth phụ
            const uid = res.user.uid; //lấy uid của user mới tạo

            const newUser = { //tạo object user mới
                uid, //id user
                email, //mail
                role,
                status: status === "true",
                createdAt: new Date()
            };

            //tạo document firestore
            await setDoc(doc(dulieu, "users", uid), newUser); //tạo document với id là uid trong collection users

            // setUser(prev => [...prev, newUser]); //cập nhật UI ngay lập tức
            setEmail("");
            setPassword("");
            setRole("staff");
            setStatus("");

            alert("Tạo user mới thành công!");
            changeAddUserFormStatusFalse();


        } catch (err) {
            console.error(err);
            alert("Lỗi tạo user mới!");
        }


    }


    return (
        <form className="p-6 space-y-4 w-200 m-auto">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        placeholder="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-visible:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        password <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-visible:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phân quyền
                    </label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-visible:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="admin">admin</option>
                        <option value="staff">staff</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Trạng thái
                    </label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-visible:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Chọn trạng thái</option>
                        <option value="true">Active</option>
                        <option value="false">Fail</option>
                    </select>
                </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button onClick={() => changeAddUserFormStatusFalse()}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >Hủy
                </button>
                <button
                    onClick={handAddUser}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
                >Thêm
                </button>
            </div>
        </form>
    )
}
