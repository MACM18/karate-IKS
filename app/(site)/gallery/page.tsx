import { prisma } from "@/app/lib/prisma";
import GalleryContent from "./GalleryContent";

export const revalidate = 60;

export default async function GalleryPage() {
  const items = await (prisma as any).galleryItem.findMany({
    orderBy: { createdAt: "desc" },
  });

  const galleryItems = items.map((item: any) => ({
    url: item.url,
    caption: item.caption || "",
    category: item.category || "General",
    featured: item.featured,
  }));

  return <GalleryContent initialItems={galleryItems} />;
}
