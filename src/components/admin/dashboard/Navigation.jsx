import React, { useState } from 'react'
import { useRealtimeCollection } from '../../../data/useCollection'
import { SHIFT_CONFIG } from '../../../constants/shifts'
import { getMonday } from './getMonday'
import { getWeekDates } from './getWeekDates'
import { dulieu } from '../../../data/connectdata'

export const Navigation = ({saving,schedule, staffList, weekStart, handleSave, handleExportExcel, prevWeek, nextWeek, weekEnd}) => {

    return (
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
                <button onClick={prevWeek} className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">←</button>
                <span className="font-semibold text-gray-700">
                    Tuần: {weekStart} → {weekEnd}
                </span>
                <button onClick={nextWeek} className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">→</button>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={handleExportExcel}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
                >
                    Xuất Excel
                </button>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 disabled:bg-gray-300"
                >
                    {saving ? "Đang lưu..." : "Lưu bảng ca"}
                </button>
            </div>
        </div>
    )
}
