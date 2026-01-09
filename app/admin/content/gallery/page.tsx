import React from 'react';
import { prisma } from "@/app/lib/prisma";
import { Plus, Trash2, Star, Image as ImageIcon, Tag } from 'lucide-react';
import { deleteGalleryItem, toggleGalleryFeatured } from '@/app/lib/actions';
import { GalleryUploadForm } from '@/components/admin/GalleryUploadForm';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { FormOverlay } from '@/components/admin/FormOverlay';

export default async function GalleryManagementPage() {
    const session = await auth();
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SENSEI')) {
        redirect('/login');
    }

    const items = await prisma.galleryItem.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="p-8 space-y-12 max-w-7xl mx-auto min-h-screen relative">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-5xl font-heading font-black uppercase tracking-tighter text-white">Visual <span className="text-primary italic">Archives</span></h1>
                    <p className="text-zinc-500 mt-2 font-medium">Manage library imagery and featured gallery shots.</p>
                </div>
            </header>

            <div className="space-y-6">
                <h2 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-3">
                    <span className="h-px w-8 bg-zinc-800"></span>
                    Strategic Visuals
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {items.map((item) => (
                        <div key={item.id} className="relative aspect-square bg-zinc-900 border border-zinc-800 overflow-hidden group">
                            <img
                                src={item.url}
                                alt={item.caption || "Gallery item"}
                                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                            />

                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-black/80 px-2 py-1 flex items-center gap-2 border border-primary/20">
                                        <Tag size={10} /> {item.category || "General"}
                                    </span>
                                    <div className="flex gap-2">
                                        <form action={async () => {
                                            "use server";
                                            await toggleGalleryFeatured(item.id, !item.featured);
                                        }}>
                                            <button className={`p-2 rounded-sm transition-colors ${item.featured ? 'text-yellow-500 bg-yellow-500/10' : 'text-zinc-500 bg-black/50 hover:text-white'}`}>
                                                <Star size={16} fill={item.featured ? 'currentColor' : 'none'} />
                                            </button>
                                        </form>
                                        <form action={async () => {
                                            "use server";
                                            await deleteGalleryItem(item.id);
                                        }}>
                                            <button className="p-2 bg-black/50 text-zinc-500 hover:text-primary rounded-sm transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </form>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-white line-clamp-2">{item.caption}</p>
                                    <p className="text-[10px] text-zinc-400 uppercase font-black tracking-tighter">Archived: {new Date(item.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>

                            {item.featured && (
                                <div className="absolute top-2 right-2 p-1.5 bg-yellow-500 group-hover:hidden transition-all">
                                    <Star size={10} className="text-black" fill="black" />
                                </div>
                            )}
                        </div>
                    ))}

                    {items.length === 0 && (
                        <div className="col-span-full py-24 text-center border border-dashed border-zinc-800 text-zinc-600">
                            <ImageIcon size={48} className="mx-auto mb-4 opacity-20" />
                            <p className="italic font-medium">Archive is empty. Ready for strategic intel.</p>
                        </div>
                    )}
                </div>
            </div>

            <FormOverlay title="New Visual Intel" triggerLabel="Archive Intel">
                <GalleryUploadForm />
            </FormOverlay>
        </div>
    );
}
