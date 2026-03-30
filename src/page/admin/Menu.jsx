import React, { useState } from 'react'
import { MenuList } from '../../components/admin/menu/MenuList';
import AddMenu from '../../components/admin/menu/AddMenu';
import { ListCategories } from '../../components/admin/category/ListCategories';
import { AddCategories } from '../../components/admin/category/AddCategories';
import { useRealtimeCollection } from '../../data/useCollection';

export const Menu = () => {

  //state nút thêm menu
  const [addMenu, setAddMenu] = useState(false);

  //state nút thêm categories
  const [addCategories, setAddCategories] = useState(false);

  //state chứa dl categories
  // const [categories, setCategories] = useState([]);

  //state chứa dl menus
  // const [menus, setMenus] = useState([]);

  const changeAddMenuStatus = () => {
    setAddMenu(true);
  }

  const changeAddMenuStatusFalse = () => {
    setAddMenu(false);
  }

  const changeAddCategoriesStatus = () => {
    setAddCategories(true);
  }

  const changeAddCategoriesStatusFalse = () => {
    setAddCategories(false);
  }

  const { data: menus, setData: setMenus, loading: menuLoading } = useRealtimeCollection("products"); //sử dụng custom hook
  const { data: categories, loading: cateLoading } = useRealtimeCollection("categories");

  
  if (menuLoading || cateLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='select-none'>
      <h2 className="text-2xl font-medium text-gray-800 mb-6">Quản lý Menu</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden mb-4">
        <div className="p-6 border-b border-gray-200">
          <button onClick={changeAddCategoriesStatus} className="bg-blue-500 text-white px-4 py-2 rounded-sm hover:bg-blue-700">+ Thêm danh mục mới
          </button>
        </div>
        {addCategories && (
          <AddCategories
            changeAddCategoriesStatusFalse={changeAddCategoriesStatusFalse}
          />
        )}
        <ListCategories categories={categories} />

      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <button onClick={changeAddMenuStatus} className="bg-blue-500 text-white px-4 py-2 rounded-sm hover:bg-blue-700">+ Thêm món mới
          </button>
        </div>
        <MenuList menus={menus} setMenus={setMenus} categories={categories} />
        {addMenu && (
          <AddMenu
            categories={categories}
            changeAddMenuStatusFalse={changeAddMenuStatusFalse}
          />
        )}
      </div>
    </div>
  )
}
