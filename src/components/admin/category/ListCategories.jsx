import React from 'react'
import { CategoriesItem } from './CategoriesItem'

export const ListCategories = ({ categories }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 cursor-pointer select-none text-left text-xs font-medium text-gray-500 uppercase">ID Danh mục</th>
                        <th className="px-6 py-3 cursor-pointer select-none text-left text-xs font-medium text-gray-500 uppercase">Tên danh mục</th>
                        <th className="px-6 py-3 cursor-pointer select-none text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                        <th className="px-6 py-3 cursor-pointer select-none text-left text-xs font-medium text-gray-500 uppercase text-right">Thao tác</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    <CategoriesItem categories={categories}/>
                </tbody>
            </table>
        </div>
    )
}
