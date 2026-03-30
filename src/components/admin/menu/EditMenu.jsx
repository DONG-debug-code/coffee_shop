import React, { useState } from 'react'
import { dulieu } from '../../../data/connectdata';
import { doc, updateDoc } from 'firebase/firestore';
import { CLOUDINARY_UPLOAD_URL, CLOUDINARY_UPLOAD_PRESET } from '../../../data/cloudinaryConfig';

export const EditMenu = ({ changeEditStatusFalse, menuEditData, setMenus }) => {

    // state để preview và lưu ảnh mới
    const [previewImage, setPreviewImage] = useState(menuEditData?.imageUrl || "");
    const [newImage, setNewImage] = useState(null);

    const [form, setForm] = useState({
        ...menuEditData,
    })

    // hàm xử lý khi chọn ảnh mới
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setNewImage(file);
        setPreviewImage(URL.createObjectURL(file)); // preview ảnh mới
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const uploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        const res = await fetch(CLOUDINARY_UPLOAD_URL, {
            method: "POST",
            body: formData
        });

        const data = await res.json();
        if(!data.secure_url) {
            throw new Error("Upload Cloudinary thất bại");
        }
        return data.secure_url; // link ảnh cloudinary
    };

    const handleUpdate = async () => {
        const docRef = doc(dulieu, "products", form.id);

        let imageUrl = form.imageUrl; // giữ nguyên url ảnh cũ

        // nếu có chọn ảnh mới
        if (newImage) {
            imageUrl = await uploadToCloudinary(newImage);
        }

        await updateDoc(docRef, {
            name: form.name,
            price: form.price,
            categoryId: form.categoryId,
            imageUrl: imageUrl
        });

        setMenus(prev =>
            prev.map(item =>
                item.id === form.id
                    ? {
                        ...item,
                        ...form,
                        imageUrl: imageUrl // cập nhật lại url ảnh nếu có thay đổi
                    }
                    : item
            )
        );
        alert("Cập nhật món thành công!");
        changeEditStatusFalse();
    }



    return (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center p-4 z-50">
            {/* Modal Content  */}
            <div className="bg-white rounded-xl border border-gray-300 shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-medium text-gray-800">Sửa món</h2>
                    <button className="text-gray-500 hover:text-gray-700">
                        <svg onClick={changeEditStatusFalse} className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form className="p-6 space-y-4">
                    {/* Tên món */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Tên món <span className="text-red-500">*</span>
                        </label>
                        <input
                            name='name'
                            type="text"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            placeholder="Nhập tên món"
                        />
                    </div>

                    {/* Giá */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Giá (VNĐ) <span className="text-red-500">*</span>
                        </label>
                        <input
                            name='price'
                            value={form.price}
                            onChange={handleChange}
                            type='number'
                            className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            placeholder="50000"
                        />
                    </div>

                    {/* Danh mục */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Danh mục <span className="text-red-500">*</span>
                        </label>
                        <select
                            name='categoryId'
                            value={form.categoryId}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-visible:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">Chọn danh mục</option>
                            <option value="coffee">Cà phê</option>
                            <option value="tea">Trà</option>
                            <option value="milktea">Trà Sữa</option>
                            <option value="drink">Nước Ngọt</option>
                        </select>
                    </div>



                    {/* Hình ảnh */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Hình ảnh
                        </label>

                        {/* Preview */}
                        {previewImage && (
                            <div className="mb-3">
                                <img
                                    src={previewImage}
                                    alt="preview"
                                    className="w-full h-48 object-cover rounded-lg border"
                                />
                            </div>
                        )}

                        <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-sm cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                            <span className="text-gray-600 font-medium">
                                Chọn hình ảnh mới
                            </span>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={changeEditStatusFalse}
                            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="button"
                            onClick={handleUpdate}
                            className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                        > Cập nhật
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
