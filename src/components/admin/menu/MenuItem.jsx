import React, { useState } from 'react'
import { dulieu } from '../../../data/connectdata';
import { deleteDoc, doc } from 'firebase/firestore';
import { EditMenu } from './EditMenu';

export const MenuItem = ({ item, setMenus }) => {

    const [editMenu, setEditMenu] = useState(false);
    const [menuEditData, setMenuEditData] = useState(null);

    const changeEditStatusFalse = () => {
        setEditMenu(false);
    }

    const handleEdit = () => {
        setEditMenu(true);
        setMenuEditData(item);
    }

    const handleDeleteForever = async (id) => {
        if (!window.confirm("Xóa vĩnh viễn? Không thể khôi phục!")) return;

        // const db = getFirestore(dl);
        await deleteDoc(doc(dulieu, "products", id));
    };

    //hàm định dạng tiền
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    return (
        <>
        { editMenu && (
            <EditMenu
                changeEditStatusFalse={changeEditStatusFalse}
                setMenus = { setMenus }
                menuEditData = { menuEditData }
            />
        )}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gray-200">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>

                <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="cursor-pointer select-none text-l font-bold text-gray-800">
                            {item.name}
                        </h3>
                    </div>

                    <div className="flex justify-between items-start mb-2">
                        <p className="cursor-pointer select-none text-sm text-gray-500 mb-2">
                            {item.categoryId}
                        </p>
                        <span className="cursor-pointer select-none text-green-600 font-bold">
                            {formatPrice(item.price)}
                        </span>
                    </div>

                    <div className="flex gap-2">
                        <button onClick={handleEdit} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-sm">
                            Sửa
                        </button>

                        <button
                            onClick={() => handleDeleteForever(item.id)}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-sm"
                        >
                            Xóa
                        </button>
                    </div>
                </div>
            </div>
        </>

    )
}
