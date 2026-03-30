import { addDoc, collection } from 'firebase/firestore';
import React, { useState } from 'react'
import { dulieu } from '../../../data/connectdata';

export const AddCategories = ({ changeAddCategoriesStatusFalse}) => {

    //state chứa dl
    const [categoryId, setCategoryId] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [categoryStatus, setCategoryStatus] = useState("");

    const handleAddCategories = async (e) => {
        e.preventDefault();

        if (!categoryId.trim() || !categoryName.trim() || !categoryStatus.trim()) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        const newCategories = {
            categoryId,
            categoryName,
            categoryStatus
        }

        await addDoc(collection(dulieu, "categories"), newCategories);
        alert("Thêm danh mục mới thành công!");
        
        setCategoryId("");
        setCategoryName("");
        setCategoryStatus("");
        changeAddCategoriesStatusFalse();
    }

    return (
        <form className="p-6 space-y-4 w-200 m-auto">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID Danh Mục <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-visible:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Trạng Thái <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={categoryStatus}
                        onChange={(e) => setCategoryStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-visible:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Chọn trạng thái</option>
                        <option value="true">Active</option>
                        <option value="false">Fail</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tên Danh Mục <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-visible:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={changeAddCategoriesStatusFalse}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >Hủy
                </button>
                <button
                    onClick={handleAddCategories}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
                >Thêm
                </button>
            </div>
        </form>
    )
}
