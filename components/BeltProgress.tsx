"use client";

import React from "react";

interface BeltProgressProps {
    currentBelt: string;
    nextBelt: string;
    progress: number; // Percentage 0-100
    color: string; // Hex or tailwind class for the current belt
}

export function BeltProgress({ currentBelt, nextBelt, progress, color }: BeltProgressProps) {
    // Map belt names to colors if needed, or pass explicitly. 
    // For now, we use the passed color for the accent.

    return (
        <div className="w-full bg-zinc-900 p-6 border border-zinc-800 rounded-lg">
            <div className="flex justify-between items-end mb-4">
                <div>
                    <h3 className="text-gray-400 text-sm uppercase tracking-widest mb-1">Current Rank</h3>
                    <p className="text-3xl font-heading uppercase text-white">{currentBelt}</p>
                </div>
                <div className="text-right">
                    <h3 className="text-gray-400 text-sm uppercase tracking-widest mb-1">Next Rank</h3>
                    <p className="text-xl font-heading uppercase text-gray-500">{nextBelt}</p>
                </div>
            </div>

            <div className="relative w-full h-4 bg-zinc-800 rounded-full overflow-hidden">
                <div
                    className="absolute top-0 left-0 h-full transition-all duration-1000 ease-out"
                    style={{ width: `${progress}%`, backgroundColor: color }}
                />
            </div>

            <div className="flex justify-between mt-2 text-xs text-gray-500 uppercase tracking-widest">
                <span>0 Classes</span>
                <span>{progress}% towards promotion</span>
                <span>Requirement Met</span>
            </div>
        </div>
    );
}
