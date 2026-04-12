import React from 'react'
import { RxDashboard } from "react-icons/rx";
import { HiUserGroup } from "react-icons/hi";
import { FaRegCircleUser } from "react-icons/fa6";
import { LuSquareMenu } from "react-icons/lu";
import { BsCartCheckFill } from "react-icons/bs";
import { SiAirtable } from "react-icons/si";
import { Link } from 'react-router-dom';

export const SideBar = () => {
    return (
            <nav className='py-6 flex flex-col'>
                <Link to="/admin" className='nav-link justify-between text-gray-700 text-start font-medium btn mb-2 p-3 hover:cursor-pointer hover:bg-gray-100 rounded-lg flex items-center'>Dashboard <RxDashboard className='text-lg' /></Link>
                <Link to="/admin/staff" className='nav-link justify-between text-gray-700 text-start font-medium btn mb-2 p-3 hover:cursor-pointer hover:bg-gray-100 rounded-lg flex items-center'>Quản lý nhân viên <HiUserGroup className='text-lg' /></Link>
                <Link to="/admin/user" className='nav-link justify-between text-gray-700 text-start font-medium btn mb-2 p-3 hover:cursor-pointer hover:bg-gray-100 rounded-lg flex items-center'>Quản lý user <FaRegCircleUser className='text-lg' /></Link>
                <Link to="/admin/menu" className='nav-link justify-between text-gray-700 text-start font-medium btn mb-2 p-3 hover:cursor-pointer hover:bg-gray-100 rounded-lg flex items-center'>Quản lý menu <LuSquareMenu className='text-lg' /></Link>
                <Link to="/admin/order" className='nav-link justify-between text-gray-700 text-start font-medium btn mb-2 p-3 hover:cursor-pointer hover:bg-gray-100 rounded-lg flex items-center'>Quản lý đơn hàng <BsCartCheckFill className='text-lg' /></Link>
                <Link to="/admin/table" className='nav-link justify-between text-gray-700 text-start font-medium btn mb-2 p-3 hover:cursor-pointer hover:bg-gray-100 rounded-lg flex items-center'>Quản lý bàn <SiAirtable className='text-lg' /></Link>
            </nav>
    )
}
