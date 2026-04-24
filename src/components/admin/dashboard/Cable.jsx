import React from 'react'
import { DAYS_OF_WEEK, SHIFT_CONFIG } from '../../../constants/shifts'

export const Cable = ({ weekDates, staffList, schedule, toggleShift, calcTotalHours }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                    <tr>
                        <th className="text-left px-4 py-3 text-gray-500 font-medium min-w-40">Nhân viên</th>
                        {weekDates.map((date, i) => (
                            <th key={date} className="px-3 py-3 text-gray-500 font-medium text-center min-w-32">
                                <div>{DAYS_OF_WEEK[i]}</div>
                                <div className="text-xs font-normal text-gray-400">{date.slice(5)}</div>
                            </th>
                        ))}
                        <th className="px-4 py-3 text-gray-500 font-medium text-center">Tổng giờ</th>
                        <th className="px-4 py-3 text-gray-500 font-medium text-right">Tổng lương</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {staffList.map(staff => (
                        <tr key={staff.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                                <p className="font-semibold text-gray-800">{staff.fullName}</p>
                                <p className="text-xs text-gray-400">{staff.position}</p>
                                <p className="text-xs text-gray-400">{(staff.salary || 0).toLocaleString('vi-VN')}đ/h</p>
                            </td>
                            {weekDates.map(date => {
                                const shifts = schedule[staff.id]?.[date] || []
                                return (
                                    <td key={date} className="px-2 py-2">
                                        <div className="flex flex-col gap-1">
                                            {Object.entries(SHIFT_CONFIG).map(([key, config]) => (
                                                <button
                                                    key={key}
                                                    onClick={() => toggleShift(staff.id, date, key)}
                                                    className={`px-2 py-1 rounded border text-xs font-medium transition
                                                            ${shifts.includes(key)
                                                            ? config.color
                                                            : 'bg-gray-50 border-gray-200 text-gray-300 hover:border-gray-400'
                                                        }`}
                                                >
                                                    {config.label}
                                                </button>
                                            ))}
                                        </div>
                                    </td>
                                )
                            })}
                            <td className="px-4 py-3 text-center font-bold text-blue-600">
                                {calcTotalHours(staff.id)}h
                            </td>
                            <td className="px-4 py-3 text-right font-bold text-green-600">
                                {(calcTotalHours(staff.id) * (staff.salary || 0)).toLocaleString('vi-VN')}đ
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
