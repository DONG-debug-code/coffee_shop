import React, { useEffect, useState } from 'react'
import { dulieu } from '../../../data/connectdata';
import { doc, updateDoc } from 'firebase/firestore';

export const EditUser = ({ changeEditStatusFalse, userEdit, setUser }) => {

  const [form, setForm] = useState({ ...userEdit });

  //hàm sự kiện nhập (onchange)
  const handleChange = (e) => {
    const { name, value } = e.target; //biến tên trường và giá trị
    let newvalue = value; //giá trị mặc định

    if (name === "status") {
      newvalue = value === "true" ? true : false; //chuyển chuỗi thành boolean
    }

    setForm(prev => ({ //cập nhật state form (prev = form cũ)
      ...prev,
      [name]: newvalue
    }));
  }

  //hàm cập nhật dữ liệu
  const handleUpdate = async () => {
    const docRef = doc(dulieu, "users", form.id); //tham chiếu đếm id nhân viên cần sửa
    if (!form.id) {
      alert(" k tìm thấy ID user!")
      return;
    }

    await updateDoc(docRef, { //cập nhật document trong firestore
      role: form.role,
      status: form.status,
    });

    setUser(prev => //cập nhật danh sách
      prev.map(item => //duyệt từng item (nhân viên)
        item.id === form.id //kiểm tra có phải nhân viên vừa sửa hay k
          ? { ...item, ...form } //nếu đúng ghi đè dữ liệu
          : item //ngược lại giữ nguyên
      )
    );
    alert("Cập nhật thành công!");
    changeEditStatusFalse();
  }


  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl border border-gray-300 shadow-2xl max-h-[90vh] overflow-y-auto">
        <form className="p-6 space-y-4 w-200 m-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phân quyền
              </label>
              <select
                name='role'
                value={form.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-visible:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                name='status'
                value={form.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-visible:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="true">Active</option>
                <option value="false">Fail</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type='button'
              onClick={changeEditStatusFalse}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >Hủy
            </button>
            <button
              type='button'
              onClick={handleUpdate}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
            >Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>


  )
}
