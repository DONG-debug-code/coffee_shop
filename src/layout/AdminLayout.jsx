import React from 'react'

import { Routes, Route } from 'react-router-dom';
import {Link} from 'react-router-dom'
import { Header } from '../page/admin/Header';
import { Dashboard } from '../page/admin/Dashboard';
import { Staff } from '../page/admin/Staff';
import { User } from '../page/admin/User';
import { Menu } from '../page/admin/Menu';
import { Order } from '../page/admin/Order';
import { Table } from '../page/admin/Table';
import { HiUserGroup } from "react-icons/hi";
import { FaRegCircleUser } from "react-icons/fa6";
import { LuSquareMenu } from "react-icons/lu";
import { BsCartCheckFill } from "react-icons/bs";
import { SiAirtable } from "react-icons/si";
import { Report } from '../page/admin/Report';
import { TbReportMoney } from "react-icons/tb";
import { RxDashboard } from "react-icons/rx";

export const AdminLayout = () => {
  
  return (
      <>
        <div>
          <Header />
          <div className="flex pt-[76px]">
            <div className="w-64 bg-white min-h-screen p-3 border-r border-gray-300 select-none">
              <nav className='py-6 flex flex-col'>
                <Link to="/admin" className='nav-link justify-between text-gray-700 text-start font-medium btn mb-2 p-3 hover:cursor-pointer hover:bg-gray-100 rounded-lg flex items-center'>Dashboard <RxDashboard className='text-lg'/></Link>
                <Link to="/admin/staff" className='nav-link justify-between text-gray-700 text-start font-medium btn mb-2 p-3 hover:cursor-pointer hover:bg-gray-100 rounded-lg flex items-center'>Quản lý nhân viên <HiUserGroup className='text-lg'/></Link>
                <Link to="/admin/user" className='nav-link justify-between text-gray-700 text-start font-medium btn mb-2 p-3 hover:cursor-pointer hover:bg-gray-100 rounded-lg flex items-center'>Quản lý user <FaRegCircleUser className='text-lg'/></Link>
                <Link to="/admin/menu" className='nav-link justify-between text-gray-700 text-start font-medium btn mb-2 p-3 hover:cursor-pointer hover:bg-gray-100 rounded-lg flex items-center'>Quản lý menu <LuSquareMenu className='text-lg'/></Link>
                <Link to="/admin/order" className='nav-link justify-between text-gray-700 text-start font-medium btn mb-2 p-3 hover:cursor-pointer hover:bg-gray-100 rounded-lg flex items-center'>Quản lý đơn hàng <BsCartCheckFill className='text-lg'/></Link>
                <Link to="/admin/table" className='nav-link justify-between text-gray-700 text-start font-medium btn mb-2 p-3 hover:cursor-pointer hover:bg-gray-100 rounded-lg flex items-center'>Quản lý bàn <SiAirtable className='text-lg'/></Link>
                <Link to="/admin/report" className='nav-link justify-between text-gray-700 text-start font-medium btn mb-2 p-3 hover:cursor-pointer hover:bg-gray-100 rounded-lg flex items-center'>Báo cáo <TbReportMoney className='text-lg'/></Link>
              </nav>
            </div>

            <div className="flex-1 bg-gray-100 p-8">
              <Routes>
                <Route index element={<Dashboard/>} />
                <Route path='staff' element={<Staff/>} />
                <Route path='user' element={<User/>} />
                <Route path='menu' element={<Menu/>} />
                <Route path='order' element={<Order/>} />
                <Route path='table' element={<Table/>} />
                <Route path='report' element={<Report/>} />
              </Routes>
            </div>
          </div>
        </div>
      </>
  )
}
