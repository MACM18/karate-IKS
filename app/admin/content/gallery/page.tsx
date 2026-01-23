import React from "react";
import { prisma } from "@/app/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { GalleryManagement } from "@/components/admin/GalleryManagement";

export default async function GalleryManagementPage() {
  const session = await auth();
  if (
    !session ||
    (session.user.role !== "ADMIN" && session.user.role !== "SENSEI")
  ) {
    redirect("/login");
  }

  let items: any[] = [];
  try {
    items = await prisma.galleryItem.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (err: any) {
    if (err?.code === "P2021") {
      console.warn(
        "Prisma P2021 during admin gallery fetch; using empty items.",
      );
      items = [];
    } else {
      throw err;
    }
  }

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
      </header>

      <GalleryManagement items={items} />
    </div>
  );
}
