import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { dulieu } from "../../../data/connectdata";
export const CategoriesItem = ({ categories }) => {

    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState("");
    const [editStatus, setEditStatus] = useState(false);

    const handleDeleteCategory = async (id) => {
        const confirmDelete = window.confirm("Bạn có chắc muốn xóa danh mục này?");
        if (!confirmDelete) return;

        try {

            await deleteDoc(doc(dulieu, "categories", id));

            // cập nhật UI ngay
            // setCategories((prev) => prev.filter((item) => item.id !== id));

            alert("Xóa thành công!");
        } catch (error) {
            console.error(error);
            alert("Xóa thất bại!");
        }
    };

    //hàm bấm nút sửa
    const handleEdit = (item) => {
        setEditId(item.id);
        setEditName(item.name);
        setEditStatus(item.status);
    }

    //hàm cập nhật(gọi khi bấm nút cập nhật)
    const handleUpdate = async (id) => {
        console.log("UPDATE ID:", id);

        if (!editName.trim()) {
            alert("Tên danh mục không được để trống");
            return;
        }
        // const db = getFirestore(dl);
        try {
            const docRef = doc(dulieu, "categories", id);

            await updateDoc(docRef, {
                name: editName.trim(),
                status: editStatus,
            });
            alert("Cập nhật thành công!");

            // // cập nhật UI
            // setCategories(prev =>
            //     prev.map(item =>
            //         item.id === id
            //             ? { ...item, name: editName.trim(), status: editStatus }
            //             : item
            //     )
            // );
            setEditId(null);
        } catch (error) {
            console.error("Update Failed: ", error);
            alert("Cập nhật thất bại!");
        }

    };




    return (
        <>
            {categories.map((item) => (
                <tr key={item.id}>
                    {/* Tên + trạng thái */}
                    <td className="px-6 py-4 cursor-pointer select-none w-[165px]">
                        {item.categoryId}
                    </td>

                    <td className="px-6 py-4 cursor-pointer select-none w-[350px]">
                        {editId === item.id
                            ? (<>
                                <input onChange={(e) => setEditName(e.target.value)} value={editName}
                                    className="border px-2 py-1 rounded w-32"></input>
                            </>)
                            : (item.name)
                        }
                    </td>

                    <td className="px-6 py-4 cursor-pointer select-none w-[230px]">
                        {editId === item.id ? (
                            <input
                                type="checkbox"
                                checked={editStatus}
                                onChange={(e) => setEditStatus(e.target.checked)}
                            />
                        ) : (
                            <span
                                className={`text-xs px-2 py-1 rounded-sm text-white ${item.status ? "bg-green-500" : "bg-gray-400"
                                    }`}
                            >
                                {item.status ? "Còn" : "Hết"}
                            </span>
                        )}
                    </td>
                    {/* px-6 py-4 cursor-pointer select-none */}

                    {/* Thao tác */}
                    <td className="px-6 py-4 cursor-pointer select-none text-right">
                        <div className="flex justify-end gap-2">
                            {
                                editId === item.id ?
                                    (
                                        <>
                                            <button onClick={() => handleUpdate(item.id)} className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                                                cập nhật
                                            </button>
                                            <button onClick={() => setEditId(null)} className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600">
                                                Hủy
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => handleEdit(item)} className="text-white rounded-sm bg-blue-500 px-2 py-1 hover:bg-blue-700">
                                                Sửa
                                            </button>
                                            <button onClick={() => handleDeleteCategory(item.id)}
                                                className="text-white rounded-sm bg-red-500 px-2 py-1 hover:bg-red-700">
                                                Xóa
                                            </button>
                                        </>
                                    )
                            }
                            {/* <button className="text-white rounded-sm bg-blue-500 px-2 py-1 hover:bg-blue-700">
                                Sửa
                            </button>
                            <button onClick={() => handleDeleteCategory(cat.id)}
                             className="text-white rounded-sm bg-red-500 px-2 py-1 hover:bg-red-700">
                                Xóa
                            </button> */}
                        </div>
                    </td>

                </tr>
            ))}
        </>
    );
};
