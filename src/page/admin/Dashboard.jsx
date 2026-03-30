import React from 'react'
import { DashboardItem } from '../../components/admin/dashboard/DashboardItem'
import { Chart } from '../../components/admin/dashboard/Chart'

export const Dashboard = ({dl}) => {
    
    return (
        <div>
            <h2 className="text-2xl font-medium text-gray-800 mb-6">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <DashboardItem/>
            </div>
            <Chart/>
        </div>
    )
}
