"use client";

import React, { useState } from "react";
import { Check, User } from "lucide-react";

interface CheckInCardProps {
    id: string;
    name: string;
    rank: string;
    streak: number;
    onCheckIn: (id: string) => void;
}

export function CheckInCard({ id, name, rank, streak, onCheckIn }: CheckInCardProps) {
    const [checkedIn, setCheckedIn] = useState(false);

    const handleCheckIn = () => {
        if (!checkedIn) {
            setCheckedIn(true);
            onCheckIn(id);
        }
    };

    return (
        <div
            onClick={handleCheckIn}
            className={`relative p-6 border rounded-lg cursor-pointer transition-all duration-300 group
        ${checkedIn
                    ? 'bg-green-950/30 border-green-900 ring-1 ring-green-500/50'
                    : 'bg-zinc-950 border-zinc-900 hover:border-zinc-700 hover:bg-zinc-900'
                }`}
        >
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white 
                ${checkedIn ? 'bg-green-600' : 'bg-zinc-800 group-hover:bg-zinc-700 transition-colors'}`}>
                        {checkedIn ? <Check size={24} /> : <User size={24} />}
                    </div>
                    <div>
                        <h3 className={`font-bold text-lg ${checkedIn ? 'text-green-400' : 'text-white'}`}>
                            {name}
                        </h3>
                        <p className="text-sm text-zinc-500 uppercase tracking-wide">{rank}</p>
                    </div>
                </div>

                {checkedIn && (
                    <span className="text-xs font-bold uppercase tracking-widest text-green-500 animate-in fade-in slide-in-from-right-4">
                        Present
                    </span>
                )}
            </div>

            <div className="mt-4 pt-4 border-t border-zinc-900/50 flex justify-between items-center">
                <span className="text-xs text-zinc-600 uppercase tracking-widest">Current Streak</span>
                <span className={`text-sm font-bold ${checkedIn ? 'text-green-500' : 'text-zinc-400'}`}>
                    {checkedIn ? streak + 1 : streak} 🔥
                </span>
            </div>
        </div>
    );
}
