"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Calendar, Trophy, Zap } from "lucide-react";

interface ProgressionStatsProps {
  attendance: {
    current: number;
    required: number;
    total: number;
  };
  streak: number;
  achievements: number;
  beltColor: string;
}

export function ProgressionStats({
  attendance,
  streak,
  achievements,
  beltColor,
}: ProgressionStatsProps) {
  const attendancePercentage = Math.min(
    Math.round((attendance.current / attendance.required) * 100),
    100
  );

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
      {/* Attendance Progress */}
      <div className='bg-zinc-900/50 border border-zinc-800 p-6 hover:border-zinc-700 transition-all group'>
        <div className='flex justify-between items-start mb-4'>
          <div className='p-2 bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors'>
            <Calendar className='text-blue-500' size={20} />
          </div>
          <div className='text-[10px] font-black uppercase tracking-widest text-zinc-500'>
            Attendance
          </div>
        </div>
        <div className='flex items-end gap-2 mb-2'>
          <span className='text-3xl font-black text-white'>
            {attendance.current}
          </span>
          <span className='text-sm font-bold text-zinc-500 pb-1'>
            / {attendance.required} classes
          </span>
        </div>
        <div className='w-full h-1.5 bg-zinc-800 overflow-hidden'>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${attendancePercentage}%` }}
            className='h-full bg-blue-500'
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        <div className='text-[10px] font-bold text-zinc-500 mt-2 uppercase tracking-tight'>
          {attendancePercentage}% of requirement met
        </div>
      </div>

      {/* Streak */}
      <div className='bg-zinc-900/50 border border-zinc-800 p-6 hover:border-zinc-700 transition-all group'>
        <div className='flex justify-between items-start mb-4'>
          <div className='p-2 bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors'>
            <Zap className='text-orange-500' size={20} />
          </div>
          <div className='text-[10px] font-black uppercase tracking-widest text-zinc-500'>
            Current Streak
          </div>
        </div>
        <div className='flex items-end gap-2 mb-1'>
          <span className='text-3xl font-black text-white'>{streak}</span>
          <span className='text-sm font-bold text-zinc-500 pb-1'>days</span>
        </div>
        <div className='text-[10px] font-bold text-orange-500 mt-2 uppercase tracking-tight animate-pulse'>
          Keep the fire burning 🔥
        </div>
      </div>

      {/* Achievements */}
      <div className='bg-zinc-900/50 border border-zinc-800 p-6 hover:border-zinc-700 transition-all group'>
        <div className='flex justify-between items-start mb-4'>
          <div className='p-2 bg-amber-500/10 group-hover:bg-amber-500/20 transition-colors'>
            <Trophy className='text-amber-500' size={20} />
          </div>
          <div className='text-[10px] font-black uppercase tracking-widest text-zinc-500'>
            Honors
          </div>
        </div>
        <div className='flex items-end gap-2 mb-1'>
          <span className='text-3xl font-black text-white'>{achievements}</span>
          <span className='text-sm font-bold text-zinc-500 pb-1'>bestowed</span>
        </div>
        <div className='text-[10px] font-bold text-zinc-500 mt-2 uppercase tracking-tight'>
          Total honors achieved
        </div>
      </div>

      {/* Path Power Rank */}
      <div
        className='bg-zinc-900/50 border-2 p-6 hover:scale-[1.02] transition-all group cursor-default'
        style={{ borderColor: beltColor + "40" }}
      >
        <div className='flex justify-between items-start mb-4'>
          <div className='p-2' style={{ backgroundColor: beltColor + "20" }}>
            <TrendingUp style={{ color: beltColor }} size={20} />
          </div>
          <div className='text-[10px] font-black uppercase tracking-widest text-zinc-500'>
            Next Phase
          </div>
        </div>
        <div className='flex items-end gap-2 mb-1'>
          <span className='text-2xl font-black text-white uppercase tracking-tighter'>
            Rising
          </span>
        </div>
        <div
          className='text-[10px] font-black mt-2 uppercase tracking-[0.2em]'
          style={{ color: beltColor }}
        >
          Seeking perfection
        </div>
      </div>
    </div>
  );
}
