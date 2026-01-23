import React from "react";
import { prisma } from "@/app/lib/prisma";
import { PenSquare, Trash2, Globe, Lock, ImageIcon } from "lucide-react";
import { deletePost } from "@/app/lib/actions";
import { NewsForm } from "@/components/admin/NewsForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { FormOverlay } from "@/components/admin/FormOverlay";

export default async function NewsManagementPage() {
  const session = await auth();
  if (
    !session ||
    (session.user.role !== "ADMIN" && session.user.role !== "SENSEI")
  ) {
    redirect("/login");
  }

  let posts: any[] = [];
  try {
    posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: { author: true },
    });
  } catch (err: any) {
    if (err?.code === "P2021") {
      console.warn("Prisma P2021 during admin posts fetch; using empty posts.");
      posts = [];
    } else {
      throw err;
    }
  }

  return (
    <div className='p-8 space-y-12 max-w-7xl mx-auto min-h-screen relative'>
      <header className='flex flex-col md:flex-row md:items-end justify-between gap-6'>
        <div>
          <h1 className='text-5xl font-heading font-black uppercase tracking-tighter text-white'>
            News <span className='text-primary italic'>Management</span>
          </h1>
          <p className='text-zinc-500 mt-2 font-medium'>
            Broadcast updates and dojo news to your students.
          </p>
        </div>
      </header>

      <div className='space-y-6'>
        <h2 className='text-sm font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-3'>
          <span className='h-px w-8 bg-zinc-800'></span>
          Active Archives
        </h2>

        <div className='space-y-4'>
          {posts.map((post) => (
            <div
              key={post.id}
              className='bg-zinc-900 border border-zinc-800 p-6 flex flex-col md:flex-row items-start justify-between gap-6 group hover:border-zinc-700 transition-colors'
            >
              <div className='flex flex-col md:flex-row gap-6'>
                {post.imageUrl && (
                  <div className='w-full md:w-48 aspect-video md:aspect-square bg-black border border-zinc-800 flex-shrink-0 overflow-hidden'>
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className='w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity'
                    />
                  </div>
                )}
                {!post.imageUrl && (
                  <div className='w-full md:w-24 aspect-video md:aspect-square bg-black border border-zinc-800 flex items-center justify-center flex-shrink-0 text-zinc-800'>
                    <ImageIcon size={32} />
                  </div>
                )}
                <div className='space-y-2 flex-1'>
                  <div className='flex items-center gap-3'>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-sm uppercase tracking-tighter ${
                        post.published
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-zinc-800 text-zinc-500"
                      }`}
                    >
                      {post.published ? (
                        <Globe size={10} className='inline mr-1' />
                      ) : (
                        <Lock size={10} className='inline mr-1' />
                      )}
                      {post.published ? "Public" : "Draft"}
                    </span>
                    <span className='text-[10px] text-zinc-600 font-black uppercase tracking-widest'>
                      {post.category}
                    </span>
                  </div>
                  <h3 className='text-2xl font-heading font-black text-white group-hover:text-primary transition-colors'>
                    {post.title}
                  </h3>
                  <p className='text-sm text-zinc-500 line-clamp-3 leading-relaxed max-w-3xl'>
                    {post.content}
                  </p>
                  <div className='text-[10px] text-zinc-600 font-medium uppercase tracking-widest pt-4'>
                    By {post.author?.name || "Sensei"} •{" "}
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className='flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity self-end md:self-start'>
                <button className='p-2 text-zinc-500 hover:text-white transition-colors'>
                  <PenSquare size={18} />
                </button>
                <form
                  action={async () => {
                    "use server";
                    await deletePost(post.id);
                  }}
                >
                  <button className='p-2 text-zinc-500 hover:text-primary transition-colors'>
                    <Trash2 size={18} />
                  </button>
                </form>
              </div>
            </div>
          ))}

          {posts.length === 0 && (
            <div className='py-24 text-center border border-dashed border-zinc-800 text-zinc-600'>
              <ImageIcon size={48} className='mx-auto mb-4 opacity-20' />
              <p className='italic font-medium'>
                No intelligence reports forged yet.
              </p>
            </div>
          )}
        </div>
      </div>

      <FormOverlay title='Forge Intelligence' triggerLabel='Broadcast News'>
        <NewsForm />
      </FormOverlay>
    </div>
  );
}
