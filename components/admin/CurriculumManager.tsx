"use client";

import { useState } from "react";
import { CurriculumItem, CurriculumCategory } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Plus,
    ArrowLeft,
    Pencil,
    Trash2,
    Video,
    X,
    Loader2,
    List,
    Target,
    Shield,
    Check,
} from "lucide-react";
import Link from "next/link";
import {
    createCurriculumItem,
    updateCurriculumItem,
    deleteCurriculumItem,
} from "@/app/lib/actions";
import { AnimatePresence, motion } from "framer-motion";

const categoryIcons = {
    KATA: "🥋",
    TECHNIQUE: "👊",
    KUMITE: "🤼",
    PHYSICAL: "💪",
    KNOWLEDGE: "📚",
};

interface CurriculumManagerProps {
    rank: {
        id: string;
        name: string;
        colorCode: string;
        curriculumItems: CurriculumItem[];
    };
}

export default function CurriculumManager({ rank }: CurriculumManagerProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<CurriculumItem | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        category: "KATA" as CurriculumCategory,
        itemName: "",
        description: "",
        videoUrl: "",
        isRequired: true,
        order: 0,
    });

    const openAddModal = () => {
        setEditingItem(null);
        setFormData({
            category: "KATA",
            itemName: "",
            description: "",
            videoUrl: "",
            isRequired: true,
            order: rank.curriculumItems.length + 1,
        });
        setIsModalOpen(true);
    };

    const openEditModal = (item: CurriculumItem) => {
        setEditingItem(item);
        setFormData({
            category: item.category,
            itemName: item.itemName,
            description: item.description || "",
            videoUrl: item.videoUrl || "",
            isRequired: item.isRequired,
            order: item.order,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const data = new FormData();
            data.append("rankId", rank.id);
            data.append("category", formData.category);
            data.append("itemName", formData.itemName);
            data.append("description", formData.description);
            data.append("videoUrl", formData.videoUrl);
            data.append("isRequired", String(formData.isRequired));
            data.append("order", String(formData.order));

            if (editingItem) {
                await updateCurriculumItem(editingItem.id, data);
            } else {
                await createCurriculumItem(data);
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
            alert("Failed to save item");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this requirement?")) return;
        try {
            await deleteCurriculumItem(id, rank.id);
        } catch (error) {
            console.error(error);
            alert("Failed to delete item");
        }
    };

    // Group items
    const itemsByCategory = rank.curriculumItems.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {} as Record<string, CurriculumItem[]>);

    const categories: CurriculumCategory[] = [
        "KATA",
        "TECHNIQUE",
        "KUMITE",
        "PHYSICAL",
        "KNOWLEDGE",
    ];

    return (
        <div className='p-8 space-y-12 animate-in fade-in duration-500'>
            {/* Header */}
            <div className='flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-zinc-800'>
                <div className='flex items-center gap-6'>
                    <Link href='/admin/curriculum'>
                        <Button
                            variant='outline'
                            size='icon'
                            className='rounded-none h-12 w-12 border-zinc-800 bg-zinc-900 hover:bg-zinc-800 hover:text-white hover:border-zinc-700'
                        >
                            <ArrowLeft className='h-5 w-5' />
                        </Button>
                    </Link>
                    <div>
                        <div className='flex items-center gap-3 mb-2'>
                            <div
                                className='w-4 h-4 rounded-full border border-white/20'
                                style={{ backgroundColor: rank.colorCode }}
                            />
                            <span className='text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500'>
                                Rank Configuration
                            </span>
                        </div>
                        <h1 className='text-4xl md:text-5xl font-heading font-black uppercase tracking-tighter text-white'>
                            {rank.name}
                        </h1>
                    </div>
                </div>

                <button
                    onClick={openAddModal}
                    className='px-6 py-4 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-700 transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] flex items-center gap-3'
                >
                    <Plus className='h-4 w-4' /> Add Requirement
                </button>
            </div>

            {/* Content */}
            <div className='grid gap-12 max-w-5xl'>
                {categories.map((category) => {
                    const items = itemsByCategory[category] || [];
                    if (items.length === 0) return null;

                    return (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={category}
                            className='space-y-6'
                        >
                            <div className='flex items-center gap-4'>
                                <div className='w-12 h-12 bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xl'>
                                    {categoryIcons[category]}
                                </div>
                                <div>
                                    <h2 className='text-2xl font-heading font-black uppercase tracking-wide text-white'>
                                        {category}
                                    </h2>
                                    <p className='text-[10px] text-zinc-500 font-bold uppercase tracking-widest'>
                                        {items.length} Requirements
                                    </p>
                                </div>
                            </div>

                            <div className='grid gap-4'>
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        className='group relative bg-zinc-900/40 border border-zinc-800 p-6 hover:border-primary/50 transition-all hover:bg-zinc-900/80'
                                    >
                                        <div className='absolute top-0 left-0 w-1 h-full bg-zinc-800 group-hover:bg-primary transition-colors' />

                                        <div className='flex items-start gap-6'>
                                            <div className='hidden md:flex flex-col items-center gap-2 pt-1'>
                                                <div className='text-2xl font-black text-zinc-700 group-hover:text-primary/50 transition-colors'>
                                                    {String(item.order).padStart(2, '0')}
                                                </div>
                                            </div>

                                            <div className='flex-1 min-w-0'>
                                                <div className='flex items-start justify-between gap-4'>
                                                    <div className='space-y-2'>
                                                        <h3 className='text-xl font-bold uppercase text-white group-hover:text-primary transition-colors'>
                                                            {item.itemName}
                                                        </h3>
                                                        {item.description && (
                                                            <p className='text-sm text-zinc-400 font-medium leading-relaxed max-w-2xl'>
                                                                {item.description}
                                                            </p>
                                                        )}

                                                        <div className='flex flex-wrap gap-2 mt-4'>
                                                            {!item.isRequired && (
                                                                <span className='text-[10px] font-black uppercase tracking-wider bg-zinc-800 text-zinc-400 px-2 py-1'>
                                                                    Optional
                                                                </span>
                                                            )}
                                                            {item.isRequired && (
                                                                <span className='text-[10px] font-black uppercase tracking-wider bg-primary/10 text-primary px-2 py-1 flex items-center gap-1'>
                                                                    <Shield size={10} /> Mandatory
                                                                </span>
                                                            )}
                                                            {item.videoUrl && (
                                                                <a
                                                                    href={item.videoUrl}
                                                                    target='_blank'
                                                                    rel='noopener noreferrer'
                                                                    className='text-[10px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-400 px-2 py-1 hover:bg-blue-500/20 transition-colors flex items-center gap-1'
                                                                >
                                                                    <Video size={10} /> Video Ready
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className='flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                                                        <button
                                                            onClick={() => openEditModal(item)}
                                                            className='p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all'
                                                        >
                                                            <Pencil className='h-4 w-4' />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(item.id)}
                                                            className='p-2 text-zinc-500 hover:text-red-500 hover:bg-zinc-800 transition-all'
                                                        >
                                                            <Trash2 className='h-4 w-4' />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    );
                })}

                {rank.curriculumItems.length === 0 && (
                    <div className='text-center py-32 border border-dashed border-zinc-800 bg-zinc-900/20'>
                        <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-900 mb-6'>
                            <List className='text-zinc-700' size={32} />
                        </div>
                        <h3 className='text-xl font-heading font-black uppercase text-zinc-500 tracking-widest mb-2'>
                            Sector Empty
                        </h3>
                        <p className='text-zinc-600 font-medium'>
                            Initialize curriculum protocols for this rank.
                        </p>
                    </div>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md'>
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className='bg-zinc-950 border border-zinc-800 w-full max-w-lg shadow-2xl overflow-hidden'
                        >
                            <div className='p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50'>
                                <div className="flex items-center gap-3">
                                    <Target className="text-primary" size={20} />
                                    <h3 className='font-heading font-black uppercase tracking-wider text-xl text-white'>
                                        {editingItem ? "Edit Protocol" : "New Protocol"}
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className='p-2 hover:bg-zinc-800 text-zinc-500 hover:text-white transition-colors'
                                >
                                    <X className='h-5 w-5' />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className='p-8 space-y-6'>
                                <div className='grid grid-cols-2 gap-6'>
                                    <div className='space-y-2'>
                                        <label className='text-[10px] font-black uppercase tracking-widest text-zinc-500'>
                                            Category
                                        </label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    category: e.target.value as CurriculumCategory,
                                                })
                                            }
                                            className='w-full bg-black border border-zinc-800 rounded-none p-3 text-xs font-bold text-white focus:border-primary focus:outline-none uppercase'
                                        >
                                            {categories.map((c) => (
                                                <option key={c} value={c}>
                                                    {c}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className='space-y-2'>
                                        <label className='text-[10px] font-black uppercase tracking-widest text-zinc-500'>
                                            Sequence ID
                                        </label>
                                        <input
                                            type='number'
                                            value={formData.order}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    order: parseInt(e.target.value),
                                                })
                                            }
                                            className='w-full bg-black border border-zinc-800 rounded-none p-3 text-xs font-bold text-white focus:border-primary focus:outline-none'
                                        />
                                    </div>
                                </div>

                                <div className='space-y-2'>
                                    <label className='text-[10px] font-black uppercase tracking-widest text-zinc-500'>
                                        Protocol Name
                                    </label>
                                    <input
                                        type='text'
                                        required
                                        value={formData.itemName}
                                        onChange={(e) =>
                                            setFormData({ ...formData, itemName: e.target.value })
                                        }
                                        placeholder='HEIAN SHODAN'
                                        className='w-full bg-black border border-zinc-800 rounded-none p-3 text-sm font-bold text-white focus:border-primary focus:outline-none uppercase placeholder:text-zinc-700'
                                    />
                                </div>

                                <div className='space-y-2'>
                                    <label className='text-[10px] font-black uppercase tracking-widest text-zinc-500'>
                                        Briefing
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({ ...formData, description: e.target.value })
                                        }
                                        rows={3}
                                        placeholder='Technical details and requirements...'
                                        className='w-full bg-black border border-zinc-800 rounded-none p-3 text-sm font-medium text-white focus:border-primary focus:outline-none resize-none placeholder:text-zinc-700'
                                    />
                                </div>

                                <div className='space-y-2'>
                                    <label className='text-[10px] font-black uppercase tracking-widest text-zinc-500'>
                                        Intel Link (Video)
                                    </label>
                                    <input
                                        type='url'
                                        value={formData.videoUrl}
                                        onChange={(e) =>
                                            setFormData({ ...formData, videoUrl: e.target.value })
                                        }
                                        placeholder='HTTPS://...'
                                        className='w-full bg-black border border-zinc-800 rounded-none p-3 text-xs font-bold text-white focus:border-primary focus:outline-none placeholder:text-zinc-700 uppercase'
                                    />
                                </div>

                                <div className='flex items-center gap-3 pt-2'>
                                    <div className="relative flex items-center">
                                        <input
                                            type='checkbox'
                                            id='isRequired'
                                            checked={formData.isRequired}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    isRequired: e.target.checked,
                                                })
                                            }
                                            className='peer h-5 w-5 cursor-pointer appearance-none border border-zinc-700 bg-black checked:border-primary checked:bg-primary transition-all'
                                        />
                                        <Check className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" size={14} />
                                    </div>
                                    <label
                                        htmlFor='isRequired'
                                        className='text-xs font-bold text-white uppercase tracking-wider select-none cursor-pointer'
                                    >
                                        Mandatory Protocol
                                    </label>
                                </div>

                                <div className='flex justify-end gap-4 pt-6 border-t border-zinc-800 mt-4'>
                                    <button
                                        type='button'
                                        onClick={() => setIsModalOpen(false)}
                                        className='px-6 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors'
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type='submit'
                                        disabled={isSubmitting}
                                        className='px-8 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-colors flex items-center gap-2'
                                    >
                                        {isSubmitting && (
                                            <Loader2 className='h-3 w-3 animate-spin' />
                                        )}
                                        {editingItem ? "Update Protocol" : "Initialize"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
