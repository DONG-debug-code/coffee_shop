import React, { useState } from 'react'
import { ListUser } from '../../components/admin/user/ListUser'
import { AddUser } from '../../components/admin/user/AddUser';
import { useRealtimeCollection } from '../../data/useCollection';

export const User = () => {
    //khai báo state chứa dl
    const { data: user, setData: setUser, loading: userLoading } = useRealtimeCollection("users");

    //state hiển thị form thêm user
    const [addUserForm, setAddUserForm] = useState(false);

    //hàm đóng/mở form thêm user
    const addForm =() => {
        if(addUserForm ===true) return <AddUser
        setUser={setUser}
        changeAddUserFormStatusFalse = {changeAddUserFormStatusFalse}
        />
    }

    //hàm chuyển trậng thái hiển thị form thêm
    const changeAddUserFormStatus =() => {
        setAddUserForm(true);
    }

    //hàm chuyển trạng thái đóng form thêm
    const changeAddUserFormStatusFalse =() => {
        setAddUserForm(false);
    }

    if(userLoading) {
        return <div>Loading...</div>;
    }
    return (
        <div className='select-none'>
            <h2 className="text-2xl font-medium text-gray-800 mb-6">Quản lý User</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <button onClick={changeAddUserFormStatus} className="bg-blue-500 text-white px-4 py-2 rounded-sm hover:bg-blue-700">
                        + Thêm User mới
                    </button>
                </div>
                {addForm()}
                <ListUser user={user} setUser={setUser}/>
            </div>
        </div>
    )
}
