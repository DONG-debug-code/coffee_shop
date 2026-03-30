import React from 'react'
import { Outlet } from 'react-router-dom';
import { Header } from '../page/admin/Header';
import { SideBar } from '../components/admin/SideBar';

export const AdminLayout = () => {
  
  return (
      <>
        <div>
          <Header />
          <div className="flex pt-19">
            <div className="w-64 bg-white min-h-screen p-3 border-r border-gray-300 select-none">
              <SideBar/>
            </div>

            <div className="flex-1 bg-gray-100 p-8">
              <Outlet />
            </div>
          </div>
        </div>
      </>
  )
}
