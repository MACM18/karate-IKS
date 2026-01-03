"use client";

import { Check } from "lucide-react";

export function AttendanceCalendar() {
    const daysInMonth = 31;
    const attendedDays = [2, 5, 9, 12, 16, 19, 23, 26, 30]; // Mock data
    const monthName = "October";
    const year = 2025;

    // Generate grid for calendar (simple implementation)
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const startingDayOffset = 2; // Starts on Wednesday (mock)

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-heading uppercase text-white tracking-widest">
                    {monthName} {year}
                </h3>
                <div className="flex gap-2">
                    <span className="text-xs text-zinc-500 uppercase font-bold tracking-widest">
                        {attendedDays.length} Classes Attended
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2 text-center">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="text-xs text-zinc-600 font-bold uppercase">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: startingDayOffset }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {days.map(day => {
                    const isAttended = attendedDays.includes(day);
                    const isToday = day === 15; // Mock 'today'

                    return (
                        <div
                            key={day}
                            className={`aspect-square rounded flex items-center justify-center text-sm font-bold relative group
                    ${isAttended
                                    ? 'bg-green-900/40 text-green-500 border border-green-900/50'
                                    : 'bg-zinc-950 text-zinc-700 border border-zinc-900'
                                }
                    ${isToday ? 'ring-1 ring-white' : ''}
                    `}
                        >
                            {day}
                            {isAttended && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Check size={16} className="text-green-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
