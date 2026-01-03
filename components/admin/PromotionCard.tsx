"use client";

import React from "react";
import { ArrowRight, CheckCircle } from "lucide-react";

interface PromotionCardProps {
    name: string;
    currentRank: string;
    nextRank: string;
    isSelected: boolean;
    onToggle: () => void;
}

export function PromotionCard({ name, currentRank, nextRank, isSelected, onToggle }: PromotionCardProps) {
    return (
        <div
            onClick={onToggle}
            className={`relative p-6 border rounded-lg cursor-pointer transition-all duration-300 group select-none
        ${isSelected
                    ? 'bg-action/10 border-action ring-1 ring-action'
                    : 'bg-zinc-950 border-zinc-900 hover:border-zinc-700 hover:bg-zinc-900'
                }`}
        >
            {isSelected && (
                <div className="absolute top-4 right-4 text-action animate-in zoom-in spin-in-90 duration-300">
                    <CheckCircle size={24} fill="currentColor" className="text-white" />
                </div>
            )}

            <div className="mb-4">
                <h3 className="font-bold text-lg text-white">{name}</h3>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex-1 p-3 bg-zinc-900 rounded border border-zinc-800 text-center opacity-70 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs uppercase text-zinc-500 block mb-1">From</span>
                    <span className="text-sm font-bold uppercase text-zinc-300">{currentRank}</span>
                </div>

                <ArrowRight className="text-zinc-600" size={20} />

                <div className={`flex-1 p-3 bg-zinc-900 rounded border text-center transition-colors
            ${isSelected ? 'border-action bg-action text-white' : 'border-zinc-800 text-zinc-500'}
        `}>
                    <span className={`text-xs uppercase block mb-1 ${isSelected ? 'text-white/70' : 'text-zinc-500'}`}>To</span>
                    <span className={`text-sm font-bold uppercase ${isSelected ? 'text-white' : 'text-zinc-300'}`}>{nextRank}</span>
                </div>
            </div>
        </div>
    );
}
