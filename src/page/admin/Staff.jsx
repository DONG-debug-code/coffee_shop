import React, { useState } from 'react'
import { ListStaff } from '../../components/admin/staff/ListStaff'
import { AddStaff } from '../../components/admin/staff/AddStaff'
import { useRealtimeCollection } from '../../data/useCollection'
import { useNavigate } from 'react-router-dom'

export const Staff = () => {

    const navigate = useNavigate();

    // state hiển thị form thêm nhân viên
    const [addStaffForm, setAddStaffForm] = useState(false);

    const { data: staff, setData: setStaff, loading: staffLoading } = useRealtimeCollection("staffs");

    //form thêm nhân viên
    const addForm = () => {
        if (addStaffForm === true) return <AddStaff
            staff={staff} //truyền props để cập nhật danh sách nhân viên sau khi thêm mới
            changeEditStatusFalse={changeEditStatusFalse} />
    }

    //chuyển trạng thái thêm nhân viên
    const changeEditStatus = () => {
        setAddStaffForm(true);
    }

    //chuyển trạng thái đóng form thêm nhân viên
    const changeEditStatusFalse = () => {
        setAddStaffForm(false);
    }

    if (staffLoading) {
        return <div>Loading...</div>;
    }



    return (
        <div className="select-none">

            <h2 className="select-none text-2xl font-medium text-gray-800 mb-6">Quản lý Nhân viên</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <button onClick={changeEditStatus} className="select-none bg-blue-500 text-white px-4 py-2 rounded-sm hover:bg-blue-700">+ Thêm nhân viên mới
                    </button>
                </div>
                {addForm()}
                <ListStaff
                    staff={staff} setStaff={setStaff}
                />
            </div>
        </div>
    )
}
