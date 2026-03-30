import React from 'react'

export const DashboardItem = () => {
    return (
        <div className="bg-white rounded-sm shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm">Doanh thu hôm nay</p>
                    <p className="text-2xl font-bold text-black-500 mt-2"></p>
                </div>
            </div>
        </div>
    )
}
