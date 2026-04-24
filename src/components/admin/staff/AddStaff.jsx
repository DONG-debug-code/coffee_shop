import React, { useState } from 'react';
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { dulieu } from '../../../data/connectdata';

export const AddStaff = ({ changeEditStatusFalse }) => {

    //khai báo state chứa dl từ form
    const [birthday, setBirthday] = useState("");
    const [fullName, setFullName] = useState("");
    const [gender, setGender] = useState("");
    const [phone, setPhone] = useState("");
    const [position, setPosition] = useState("");
    const [salary, setSalary] = useState("");
    const [startDate, setStartDate] = useState("");

    //thêm mới
    const handleAddStaff = async (e) => {
        e.preventDefault();
        if (!fullName.trim() || !phone.trim() || !position.trim()) {
            alert("Vui lòng nhập đầy đủ thông tin");
            return;
        }
        const newStaff = {
            birthday: birthday ? Timestamp.fromDate(new Date(birthday)) : null,
            fullName,
            gender,
            phone,
            position,
            salary: Number(salary) || 0,
            startDate: startDate ? Timestamp.fromDate(new Date(startDate)) : null
        };

        await addDoc(collection(dulieu, "staffs"), newStaff);
        alert("Thêm thành công!")
        setBirthday("");
        setFullName("");
        setGender("");
        setPhone("");
        setPosition("");
        setSalary("");
        setStartDate("");
        changeEditStatusFalse();
    };


    return (
        <form className="p-6 space-y-4 w-200 m-auto">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Nguyễn Văn A"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-visible:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chức vụ <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
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
                        type="tel"
                        placeholder="0901234567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-visible:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày sinh
                    </label>
                    <input
                        type="date"
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}
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
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
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
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-visible:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lương cơ bản/h
                    </label>
                    <input
                        type="number"
                        placeholder="VD: 30.000"
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-visible:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>


            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button onClick={() => changeEditStatusFalse()}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >Hủy
                </button>
                <button
                    onClick={handleAddStaff}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
                >Thêm
                </button>
            </div>
        </form>
    )
}