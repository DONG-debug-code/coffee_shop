import React from 'react'
import { MenuItem } from './MenuItem';

export const MenuList = ({ menus, setMenus }) => {
    return (
        <div className="bg-gray-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-3">
            {menus.map(item => (
                <MenuItem 
                    key={item.id} 
                    item={item} 
                    setMenus={setMenus}
                />
            ))}
        </div>
    )
}
