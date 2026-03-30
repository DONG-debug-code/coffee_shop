import { doc, updateDoc } from 'firebase/firestore'
import React, { useState } from 'react'
import { dulieu } from '../../../data/connectdata'
import { Timestamp } from 'firebase/firestore';
export const EditStaff = ({ setStaff, staffEdit, changeEditStatusFalse }) => {


  //hàm chuyển timestamp thành chuỗi ngày tháng (YYYY-MM-DD) để hiển thị trong input date
  const convertTimestampToDate = (ts) => {
    if (!ts) return "";
    if (ts.seconds) {
      const d = new Date(ts.seconds * 1000);
      return d.toISOString().slice(0, 10); //trả về chuỗi định dạng YYYY-MM-DD
    }
    // nếu lỡ còn string cũ trong DB
    if (typeof ts === "string") {
      // nếu đã đúng YYYY-MM-DD
      if (ts.includes("-")) return ts;

      // nếu là DD/MM/YYYY
      if (ts.includes("/")) {
        const [d, m, y] = ts.split("/");
        return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
      }
    }
    return "";
  };

  //state chứa dữ liệu staff đang được chọn để sửa từ useritem gởi lên
  const [form, setForm] = useState({
    ...staffEdit,
    birthday: convertTimestampToDate(staffEdit?.birthday),
    startDate: convertTimestampToDate(staffEdit?.startDate),
  });

  //hàm sự kiện nhập
  const handleChange = (e) => {
    const { name, value } = e.target; //biến tên trường và giá trị
    setForm(prev => ({ //cập nhật state form (prev = form cũ)
      ...prev, //giữ nguyên tất cả các trường cũ, tránh mất dữ liệu
      [name]: value //cập nhật giá trị vào trường đang nhập
    }));
  };

  //hàm cập nhật dữ liệu
  const handleUpdate = async () => {
    const docRef = doc(dulieu, "staffs", form.id); //tham chiếu đếm id nhân viên cần sửa

    await updateDoc(docRef, { //cập nhật document trong firestore
      birthday: form.birthday ? Timestamp.fromDate(new Date(form.birthday)) : null,
      fullName: form.fullName,
      gender: form.gender,
      phone: form.phone,
      position: form.position,
      salary: form.salary,
      startDate: form.startDate ? Timestamp.fromDate(new Date(form.startDate)) : null,
    });

    setStaff(prev => //cập nhật danh sách
      prev.map(item => //duyệt từng item (nhân viên)
        item.id === form.id //kiểm tra có phải nhân viên vừa sửa hay k
          ? {
            ...item,
            ...form,
            birthday: form.birthday ? Timestamp.fromDate(new Date(form.birthday)) : null,
            startDate: form.startDate ? Timestamp.fromDate(new Date(form.startDate)) : null
          } //nếu đúng ghi đè dữ liệu
          : item //ngược lại giữ nguyên
      )
    );
    alert("Cập nhật thành công!");
    changeEditStatusFalse();
  }



  return (
    <>
      <div className="fixed inset-0 bg-transparent flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl border border-gray-300 shadow-2xl max-h-[90vh] overflow-y-auto">
          <form className="p-6 space-y-4 w-200 m-auto">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  name='fullName'
                  value={form.fullName}
                  onChange={handleChange}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-visible:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chức vụ <span className="text-red-500">*</span>
                </label>
                <select
                  name='position'
                  value={form.position}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-visible:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Chọn chức vụ</option>
                  <option value="Quản lý">Quản lý</option>
                  <option value="Pha chế">Pha chế</option>
                  <option value="Phục vụ">Phục vụ</option>
                  <option value="Thu ngân">Thu ngân</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  name='phone'
                  value={form.phone}
                  onChange={handleChange}
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-visible:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày sinh
                </label>
                <input
                  name='birthday'
                  value={form.birthday}
                  onChange={handleChange}
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-visible:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giới tính
                </label>
                <select
                  name='gender'
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-visible:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Chọn giới tính</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày vào làm
                </label>
                <input
                  name='startDate'
                  value={form.startDate}
                  onChange={handleChange}
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-visible:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lương
                </label>
                <input
                  name='salary'
                  value={form.salary}
                  onChange={handleChange}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-visible:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
              <button onClick={changeEditStatusFalse}
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
          <div />
        </div>
      </div>
    </>
  )
}
