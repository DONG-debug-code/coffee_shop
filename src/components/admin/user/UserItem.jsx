import React, { useState } from 'react';
import { EditUser } from './EditUser';
export const UserItem = ({ useritem, setUser, index, onDelete }) => {
    const { id, email, password, role, status } = useritem;

    console.log(status);
    

    //state trạng thái nút edit để ẩn hiện form
    const [editForm, setEditForm] = useState(false);

    //state chứa dữ liệu user được sửa
    const [userEdit, setUserEdit] = useState(null);

    //hàm đổi giá trị state nút sửa
    const changeEditStatusFalse = () => {
        setEditForm(false);
    }

    //hàm hiển thị form edit
    const handleEditForm = () => {
        if (editForm === true) {
            return <EditUser
                userEdit={userEdit}
                setUser={setUser}
                changeEditStatusFalse={changeEditStatusFalse} />;
        }
    }

    //hàm nhấn nút sửa 
    const handleEdit = () => {
        setUserEdit(useritem);
        setEditForm(true);
    }

    return (
        <>
            <tr>
                <td className="px-6 py-4 cursor-pointer select-none text-sm text-gray-900">{index + 1}</td>
                <td className="px-6 py-4 cursor-pointer select-none text-sm text-gray-900">{email}</td>
                <td className="px-6 py-4 cursor-pointer select-none text-sm text-gray-900">{role}</td>
                <td className="px-6 py-4 cursor-pointer select-none">
                    <span className={`px-2 py-1 text-sm rounded-full ${status ? "bg-green-400 text-white" : "bg-gray-100 text-gray-800"}`}>{status ? "Active" : "Fail"}</span>
                </td>
                <td className="px-6 py-4 cursor-pointer select-none text-sm">
                    <button onClick={handleEdit} className="text-white rounded-sm bg-blue-500 px-2 py-1 hover:bg-blue-700 mr-3">Sửa</button>
                    <button onClick={() => onDelete(useritem.uid)} className="text-white rounded-sm bg-red-500 px-2 py-1 hover:bg-red-700">Xóa</button>
                </td>
            </tr>
            {handleEditForm()}
        </>
    )
}
