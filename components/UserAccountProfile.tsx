"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { User, LogOut, Shield, ChevronDown, Award, Calendar, FileText } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';

interface UserAccountProfileProps {
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
        role?: string;
    };
    rank?: {
        name: string;
        colorCode: string;
    } | null;
}

export function UserAccountProfile({ user, rank }: UserAccountProfileProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const isSensei = user.role === 'SENSEI' || user.role === 'ADMIN';

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 p-1.5 pr-4 bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 rounded-full transition-all group"
            >
                <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 overflow-hidden border border-zinc-700">
                        {user.image ? (
                            <img src={user.image} alt={user.name || ""} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-500">
                                <User size={16} />
                            </div>
                        )}
                    </div>
                    {rank && (
                        <div
                            className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-zinc-900 shadow-sm"
                            style={{ backgroundColor: rank.colorCode }}
                        />
                    )}
                </div>

                <div className="hidden lg:block text-left">
                    <div className="text-[10px] font-black uppercase tracking-widest text-white leading-none">
                        {user.name?.split(" ")[0]}
                    </div>
                    <div className="text-[8px] font-bold text-zinc-500 uppercase tracking-tighter mt-0.5">
                        {rank?.name || user.role}
                    </div>
                </div>

                <ChevronDown size={14} className={`text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-64 frosted-glass border border-zinc-800 shadow-2xl z-[100] overflow-hidden"
                    >
                        <div className="p-4 border-b border-zinc-800/50 bg-black/20">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg bg-zinc-900 overflow-hidden border border-zinc-800">
                                    {user.image ? (
                                        <img src={user.image} alt={user.name || ""} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-zinc-500">
                                            <Shield size={24} />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <div className="text-sm font-black uppercase tracking-tight text-white leading-none mb-1">
                                        {user.name}
                                    </div>
                                    <div className="text-[10px] text-zinc-500 font-medium truncate max-w-[140px]">
                                        {user.email}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-2">
                            {isSensei ? (
                                <Link
                                    href="/admin/dashboard"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 w-full p-3 text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-primary hover:bg-white/5 transition-colors"
                                >
                                    <Shield size={16} /> HQ Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href="/student/dashboard"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 w-full p-3 text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-primary hover:bg-white/5 transition-colors"
                                >
                                    <Award size={16} /> My Progression
                                </Link>
                            )}

                            {!isSensei && (
                                <>
                                    <Link
                                        href="/student/attendance"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 w-full p-3 text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-primary hover:bg-white/5 transition-colors"
                                    >
                                        <Calendar size={16} /> Attendance Log
                                    </Link>
                                    <Link
                                        href="/student/exams"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 w-full p-3 text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-primary hover:bg-white/5 transition-colors"
                                    >
                                        <FileText size={16} /> Grading Portal
                                    </Link>
                                </>
                            )}
                        </div>

                        <div className="p-2 border-t border-zinc-800/50">
                            <button
                                onClick={() => signOut()}
                                className="flex items-center gap-3 w-full p-3 text-xs font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500/10 transition-colors"
                            >
                                <LogOut size={16} /> Leave the Dojo
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

