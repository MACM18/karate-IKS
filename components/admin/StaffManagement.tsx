"use client";

import React, { useState } from 'react';
import {
    Shield,
    UserPlus,
    Trash2,
    Mail,
    Lock,
    User,
    AlertCircle,
    CheckCircle2,
    Loader2
} from 'lucide-react';
import { createSenseiAccount, deleteSenseiAccount } from '@/app/lib/actions';
import { motion, AnimatePresence } from 'framer-motion';

export default function StaffManagementPage({ staff }: { staff: any[] }) {
    const [isCreating, setIsCreating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        const formData = new FormData(e.currentTarget);
        try {
            await createSenseiAccount(formData);
            setMessage({ type: 'success', text: 'Sensei account activated successfully.' });
            setIsCreating(false);
            window.location.reload(); // Refresh to show new staff
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to create account.' });
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDelete(userId: string, name: string) {
        if (!confirm(`Are you sure you want to decommission Sensei ${name}?`)) return;

        try {
            await deleteSenseiAccount(userId);
            window.location.reload();
        } catch (error: any) {
            alert(error.message);
        }
    }

    return (
        <div className="p-8 space-y-12 max-w-5xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-heading font-black uppercase tracking-tighter text-white">Staff <span className="text-primary italic">Intelligence</span></h1>
                    <p className="text-zinc-500 mt-2 font-medium uppercase text-[10px] tracking-widest">Management of Dojo Leadership Personnel</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="bg-primary text-white px-6 py-3 text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-all flex items-center gap-2 shadow-[0_10px_20px_rgba(220,38,38,0.2)]"
                >
                    Recruit Sensei <UserPlus size={16} />
                </button>
            </header>

            {/* Creation Modal */}
            <AnimatePresence>
                {isCreating && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-zinc-900 border border-zinc-800 p-8 w-full max-w-md relative"
                        >
                            <h2 className="text-2xl font-heading font-black uppercase text-white mb-6 flex items-center gap-3">
                                <Shield className="text-primary" size={24} /> New Commission
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-[10px] uppercase font-black tracking-widest text-zinc-500 mb-2 font-bold">Full Personnel Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-primary transition-colors" size={18} />
                                        <input
                                            name="name"
                                            type="text"
                                            className="w-full bg-black border border-zinc-800 py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-primary transition-colors font-bold"
                                            placeholder="SENSEI NAME"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] uppercase font-black tracking-widest text-zinc-500 mb-2 font-bold">Secure Gateway Access (Email)</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-primary transition-colors" size={18} />
                                        <input
                                            name="email"
                                            type="email"
                                            className="w-full bg-black border border-zinc-800 py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-primary transition-colors font-bold"
                                            placeholder="EMAIL@KARATE-IKS.COM"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] uppercase font-black tracking-widest text-zinc-500 mb-2 font-bold">Primary Security Key</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-primary transition-colors" size={18} />
                                        <input
                                            name="password"
                                            type="password"
                                            className="w-full bg-black border border-zinc-800 py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-primary transition-colors font-bold"
                                            placeholder="••••••••"
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreating(false)}
                                        className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors border border-zinc-800"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-1 py-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? <Loader2 className="animate-spin" size={14} /> : 'Authorize'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Staff List */}
            <div className="bg-zinc-900 border border-zinc-800 overflow-hidden">
                <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500">Active Duty Roster</h3>
                    <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{staff.length} Authorized Personnel</div>
                </div>
                <div className="divide-y divide-zinc-800">
                    {staff.map((person) => (
                        <div key={person.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors group">
                            <div className="flex items-center gap-6">
                                <div className={`w-12 h-12 flex items-center justify-center rounded-sm ${person.role === 'ADMIN' ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-zinc-800 text-zinc-500'}`}>
                                    <Shield size={20} />
                                </div>
                                <div>
                                    <div className="text-lg font-heading font-black text-white group-hover:text-primary transition-colors leading-none uppercase tracking-tighter">
                                        {person.name}
                                    </div>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{person.email}</span>
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-sm uppercase tracking-tighter ${person.role === 'ADMIN' ? 'bg-primary/10 text-primary' : 'bg-zinc-800 text-zinc-500'}`}>
                                            {person.role}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(person.id, person.name)}
                                className="p-3 text-zinc-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-sm transition-all opacity-0 group-hover:opacity-100"
                                title="Decommission account"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {message && (
                <div className={`p-4 border ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-rose-500/10 border-rose-500/20 text-rose-500'} text-xs font-bold uppercase tracking-widest flex items-center gap-3`}>
                    {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    {message.text}
                </div>
            )}
        </div>
    );
}
