import React from 'react'
// import { RiDeleteBin6Line } from "react-icons/ri";

export const CartItem = () => {
   return (
        <div className="space-y-3 mb-3">
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                {/* Item Info */}
                <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                        <p className="font-semibold text-gray-800">Cà phê sữa</p>
                        <p className="text-sm text-gray-600">100.000đ</p>
                    </div>
                    <button
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded">
                        {/* <RiDeleteBin6Line className='w-6 h-6'/> */}
                    </button>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-300 p-1">
                        <button
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded transition-colors font-black">-
                        </button>
                        <span className="w-10 text-center font-bold text-lg">1</span>
                        <button
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded transition-colors font-black">+
                        </button>
                    </div>
                    <p className="font-bold text-green-600 text-lg">500.000đ</p>
                </div>
            </div>
        </div>
    )
}
