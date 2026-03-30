import { StaffItem } from './StaffItem'
import { dulieu } from '../../../data/connectdata';
import { deleteDoc, doc } from 'firebase/firestore';

export const ListStaff = ({ staff, setStaff }) => {

    const handleDeleteForever = async (id) => {
        if (!window.confirm("Xóa vĩnh viễn? Không thể khôi phục!")) return;
        await deleteDoc(doc(dulieu, "staffs", id));

        setStaff(prev => prev.filter(item => item.id !== id));
        alert("Đã xóa vĩnh viễn!");
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 cursor-pointer select-none py-3 text-left text-xs font-medium text-gray-500 uppercase">STT</th>
                        <th className="px-6 cursor-pointer select-none py-3 text-left text-xs font-medium text-gray-500 uppercase">Họ tên</th>
                        <th className="px-6 cursor-pointer select-none py-3 text-left text-xs font-medium text-gray-500 uppercase">Giới tính</th>
                        <th className="px-6 cursor-pointer select-none py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày sinh</th>
                        <th className="px-6 cursor-pointer select-none py-3 text-left text-xs font-medium text-gray-500 uppercase">SĐT</th>
                        <th className="px-6 cursor-pointer select-none py-3 text-left text-xs font-medium text-gray-500 uppercase">Chức vụ</th>
                        <th className="px-6 cursor-pointer select-none py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày vào làm</th>
                        <th className="px-6 cursor-pointer select-none py-3 text-left text-xs font-medium text-gray-500 uppercase">Lương/H</th>
                        <th className="px-6 cursor-pointer select-none py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                    </tr>
                </thead>
                <tbody className="divide-y select-none divide-gray-200">
                    {
                        staff.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="text-center py-6 text-gray-500">
                                    Danh sách nhân viên trống!
                                </td>
                            </tr>
                        ) : (
                            staff.map((item, index) => (
                                <StaffItem
                                    index = {index}
                                    setStaff={setStaff}
                                    key={item.id}
                                    staffitem={item} //truyền dữ liệu của item cho component item
                                    onDelete={handleDeleteForever} //truyền hàm xóa dữ liệu item cho cpmponent item
                                />
                            ))
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}
