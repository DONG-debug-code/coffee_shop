import { addDoc } from 'firebase/firestore';
import React, { useState } from 'react'
import axios from 'axios';
import { productsCollection } from '../../../data/connectdata';
import { CLOUDINARY_UPLOAD_URL, CLOUDINARY_UPLOAD_PRESET } from '../../../data/cloudinaryConfig';

const AddMenu = ({ changeAddMenuStatusFalse, categories }) => {

    //state chứa dl từ form
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    //hàm upload ảnh lên cloudinary
    const handleUploadImage = async () => {
        if (!image) return null;
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        try {
            const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData);
            return response.data.secure_url; // URL ảnh từ Cloudinary
        } catch (error) {
            console.error("Lỗi khi upload ảnh:", error);
            return null;
        }
    };


    const handleAddMenu = async (e) => {
        e.preventDefault();

        // 1. KIỂM TRA VALIDATION TRƯỚC
        if (!name.trim() || !price.trim() || !categoryId.trim()) {
            alert("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        if (!image) {
            alert("Vui lòng chọn ảnh");
            return;
        }

        setLoading(true);

        try {
            // 2. Upload ảnh
            const imageUrl = await handleUploadImage();

            if (!imageUrl) {
                alert("Lỗi khi tải ảnh. Vui lòng thử lại.");
                setLoading(false);
                return;
            }

            // 3. Thêm vào Firestore
            await addDoc(productsCollection, {
                name,
                price: Number(price),
                categoryId,
                imageUrl,
            });

            // 4. Reset form và đóng modal
            setName("");
            setPrice("");
            setCategoryId("");
            setImage(null);
            changeAddMenuStatusFalse(); // Đóng form
            alert("Đã thêm sản phẩm mới!");
        } catch (err) {
            console.error(err);
            alert("Lỗi khi thêm món. Vui lòng thử lại.");
        } finally {
            setLoading(false); // Luôn tắt loading
        }
    };

    return (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center p-4 z-50">
            {/* Modal Content  */}
            <div className="bg-white rounded-xl border border-gray-300 shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-medium text-gray-800">Thêm món</h2>
                    <button className="text-gray-500 hover:text-gray-700">
                        <svg onClick={changeAddMenuStatusFalse} className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleAddMenu} className="p-6 space-y-4">
                    {/* Tên món */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Tên món <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
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
                            type='number'
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
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
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-visible:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">Chọn danh mục</option>
                            {categories.map((category) => (
                                <option>
                                    {category.categoryId}
                                </option>
                            ))}
                        </select>
                    </div>



                    {/* Hình ảnh */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Hình ảnh
                        </label>
                        <div className="space-y-3">
                            <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-sm cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                                {!image ? (
                                    <span className="text-gray-600 font-medium">Chọn hình ảnh</span>

                                ) : (
                                    <span className="text-gray-600 font-medium">{image.name}</span>
                                )}

                                <input
                                    onChange={(e) => setImage(e.target.files[0])}
                                    required
                                    type="file"
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={changeAddMenuStatusFalse}
                            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            disabled={loading}
                            type="submit"
                            className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                        >{loading ? "Đang tải..." : "Thêm món"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddMenu;
