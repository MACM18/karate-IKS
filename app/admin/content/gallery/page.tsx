import React from "react";
import { prisma } from "@/app/lib/prisma";
import {
  Plus,
  Trash2,
  Star,
  Image as ImageIcon,
  Tag,
  Folder,
} from "lucide-react";
import { deleteGalleryItem, toggleGalleryFeatured } from "@/app/lib/actions";
import { GalleryUploadForm } from "@/components/admin/GalleryUploadForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { FormOverlay } from "@/components/admin/FormOverlay";

export default async function GalleryManagementPage() {
  const session = await auth();
  if (
    !session ||
    (session.user.role !== "ADMIN" && session.user.role !== "SENSEI")
  ) {
    redirect("/login");
  }

  const items = await prisma.galleryItem.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Group items by category (folder)
  const categories = Array.from(
    new Set(items.map((item) => item.category || "Uncategorized"))
  );
  const groupedItems = items.reduce((acc, item) => {
    const cat = item.category || "Uncategorized";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  return (
    <div className='p-8 space-y-12 max-w-full mx-auto min-h-screen relative pb-32'>
      <header className='flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-zinc-900'>
        <div>
          <h1 className='text-5xl font-heading font-black uppercase tracking-tighter text-white'>
            Visual <span className='text-primary italic'>Gallery</span>
          </h1>
          <p className='text-zinc-500 mt-2 font-medium'>
            Manage library imagery, create albums, and organize visual assets.
          </p>
        </div>
        <FormOverlay title='New Visual Intel' triggerLabel='Upload to Gallery'>
          <GalleryUploadForm />
        </FormOverlay>
      </header>

      {categories.length === 0 ? (
        <div className='py-24 text-center border-2 border-dashed border-zinc-900 rounded-2xl text-zinc-700 bg-zinc-950/50'>
          <ImageIcon size={64} className='mx-auto mb-6 opacity-20' />
          <p className='italic font-medium text-lg'>Archive is empty.</p>
          <p className='text-sm mt-2 opacity-60'>
            Upload your first visual intel to start a category.
          </p>
        </div>
      ) : (
        <div className='space-y-16'>
          {categories.sort().map((category) => (
            <div key={category} className='space-y-6'>
              <div className='flex items-center gap-4'>
                <div className='p-3 bg-zinc-900 rounded-lg text-primary'>
                  <Folder size={24} />
                </div>
                <div>
                  <h2 className='text-2xl font-black uppercase tracking-tight text-white'>
                    {category}
                  </h2>
                  <p className='text-xs font-bold text-zinc-500 uppercase tracking-widest'>
                    {groupedItems[category].length} Assets
                  </p>
                </div>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
                {groupedItems[category].map((item) => (
                  <div
                    key={item.id}
                    className='group relative aspect-[4/3] bg-zinc-900 border border-zinc-900 rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500'
                  >
                    <img
                      src={item.url}
                      alt={item.title || item.caption || "Gallery item"}
                      className='w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700'
                    />

                    <div className='absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity' />

                    <div className='absolute inset-0 p-4 flex flex-col justify-between translate-y-2 group-hover:translate-y-0 transition-transform duration-300'>
                      <div className='flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity delay-100'>
                        <form
                          action={async () => {
                            "use server";
                            await toggleGalleryFeatured(
                              item.id,
                              !item.featured
                            );
                          }}
                        >
                          <button
                            className={`p-2 rounded-lg backdrop-blur-md border border-white/10 transition-colors ${
                              item.featured
                                ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/50"
                                : "bg-black/50 text-white hover:bg-white hover:text-black"
                            }`}
                          >
                            <Star
                              size={14}
                              fill={item.featured ? "currentColor" : "none"}
                            />
                          </button>
                        </form>
                        <form
                          action={async () => {
                            "use server";
                            await deleteGalleryItem(item.id);
                          }}
                        >
                          <button className='p-2 bg-black/50 text-white hover:bg-red-500 hover:border-red-500 border border-white/10 rounded-lg backdrop-blur-md transition-colors'>
                            <Trash2 size={14} />
                          </button>
                        </form>
                      </div>

                      <div>
                        <h3 className='text-sm font-bold text-white leading-tight mb-1 drop-shadow-md'>
                          {item.title}
                        </h3>
                        {item.caption && (
                          <p className='text-[10px] text-zinc-400 line-clamp-2 font-medium leading-relaxed'>
                            {item.caption}
                          </p>
                        )}
                      </div>
                    </div>

                    {item.featured && (
                      <div className='absolute top-3 left-3 px-2 py-1 bg-yellow-500/90 backdrop-blur-sm rounded text-[8px] font-black uppercase tracking-widest text-black shadow-lg z-10'>
                        Featured
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
