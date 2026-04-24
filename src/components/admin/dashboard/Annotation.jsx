import React from 'react'
import { SHIFT_CONFIG } from '../../../constants/shifts'

export const Annotation = () => {
    return (
        <div className="flex gap-3 mb-4">
            {Object.entries(SHIFT_CONFIG).map(([key, config]) => (
                <div key={key} className={`px-3 py-1 rounded-lg border text-xs font-medium ${config.color}`}>
                    {config.label} ({config.time})
                </div>
            ))}
        </div>
    )
}
