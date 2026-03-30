import React, { useState } from 'react'
import { EditStaff } from './EditStaff';

export const StaffItem = ({ setStaff, staffitem, index, onDelete }) => {

    //nhận các dữ liệu của item
    const { id, fullName, gender, birthday, phone, position, salary, startDate } = staffitem;

    //state trạng thái nút edit để ẩn hiện form
    const [editForm, setEditForm] = useState(false);

    //state chứa dữ liệu của item được sửa
    const [staffEdit, setStaffEdit] = useState(null);


    const changeEditStatusFalse = () => {
        setEditForm(false);
    }
    //hàm nhấn nút sửa (lấy dữ liệu của item và mở form)
    const handleEdit = () => {
        setStaffEdit(staffitem); //set dữ liệu vào state staffEdit
        setEditForm(true); //mở form edit
    };


    return (
        <>
            {
                editForm && staffEdit && (
                    <EditStaff
                        setStaff={setStaff}
                        changeEditStatusFalse={changeEditStatusFalse}
                        staffEdit={staffEdit}
                    />
                )
            }
            <tr>
                <td className="px-6 py-4 cursor-pointer select-none text-sm text-gray-900">
                    {index + 1}
                </td>
                <td className="px-6 py-4 cursor-pointer select-none text-sm text-gray-900">
                    {fullName || ''}
                </td>
                <td className="px-6 py-4 cursor-pointer select-none text-sm text-gray-900">{gender || ''}</td>

                {/* Xử lý birthday nếu là Timestamp */}
                <td className="px-6 py-4 cursor-pointer select-none text-sm text-gray-900">
                    {birthday?.toDate ? birthday.toDate().toLocaleDateString('vi-VN') : (birthday || '')}
                </td>

                <td className="px-6 py-4 cursor-pointer select-none text-sm text-gray-900">{phone || ''}</td>
                <td className="px-6 py-4 cursor-pointer select-none text-sm text-gray-900">{position || ''}</td>
                {/* Xử lý startDate nếu là Timestamp */}
                <td className="px-6 py-4 cursor-pointer select-none text-sm text-gray-900">
                    {startDate?.toDate ? startDate.toDate().toLocaleDateString('vi-VN') : (startDate || '')}
                </td>

                {/* Xử lý salary - format tiền tệ */}
                <td className="px-6 py-4 cursor-pointer select-none text-sm text-gray-900">
                    {salary ? (typeof salary === 'number' ? salary.toLocaleString('vi-VN') + '₫' : salary) : ''}
                </td>

                <td className="px-6 py-4 cursor-pointer select-none text-sm">
                    <button onClick={handleEdit} className="text-white rounded-sm bg-blue-500 px-2 py-1 hover:bg-blue-700 mr-3">Sửa</button>
                    <button onClick={() => onDelete(id)} className="text-white rounded-sm bg-red-500 px-2 py-1 hover:bg-red-700">Xóa</button>
                </td>
            </tr>
        </>
    )
}