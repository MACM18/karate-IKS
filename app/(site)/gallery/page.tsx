import { prisma } from "@/app/lib/prisma";
import GalleryContent from "./GalleryContent";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function GalleryPage() {
  let items: any[] = [];
  try {
    items = await (prisma as any).galleryItem.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (err: any) {
    if (err?.code === "P2021") {
      console.warn(
        "Prisma P2021 during gallery fetch; returning empty gallery.",
      );
      items = [];
    } else {
      throw err;
    }
  }

  const galleryItems = items.map((item: any) => ({
    id: item.id,
    url: item.url,
    title: item.title,
    caption: item.caption || "",
    category: item.category || "General",
    featured: item.featured,
  }));

  return <GalleryContent initialItems={galleryItems} />;
}
