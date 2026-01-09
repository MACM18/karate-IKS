"use server";

import { uploadFile } from "@/app/lib/storage";

export async function createGalleryItem(formData: { url?: string; file?: File; caption?: string; category?: string; featured?: boolean }) {
    const session = await auth();
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SENSEI')) {
        throw new Error("Unauthorized");
    }

    let finalUrl = formData.url || "";

    // If a file is provided, try to upload it to S3
    if (formData.file) {
        const s3Url = await uploadFile(formData.file, "gallery");
        if (s3Url) finalUrl = s3Url;
    }

    if (!finalUrl) {
        throw new Error("No image visual provided (URL or File required)");
    }

    const item = await prisma.galleryItem.create({
        data: {
            url: finalUrl,
            caption: formData.caption,
            category: formData.category,
            featured: formData.featured || false,
        }
    });

    revalidatePath('/admin/content');
    revalidatePath('/gallery');
    revalidatePath('/news');
    return item;
}

export async function deleteGalleryItem(id: string) {
    const session = await auth();
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SENSEI')) {
        throw new Error("Unauthorized");
    }

    await prisma.galleryItem.delete({
        where: { id }
    });

    revalidatePath('/admin/content');
    revalidatePath('/news');
}

export async function createAchievement(formData: { title: string; description?: string; studentId: string; date?: Date }) {
    const session = await auth();
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SENSEI')) {
        throw new Error("Unauthorized");
    }

    const achievement = await prisma.achievement.create({
        data: {
            title: formData.title,
            description: formData.description,
            studentId: formData.studentId,
            date: formData.date || new Date(),
        }
    });

    revalidatePath('/admin/content');
    revalidatePath('/news');
    return achievement;
}

export async function createPost(formData: { title: string; content: string; category: string; imageUrl?: string; file?: File; published?: boolean }) {
    const session = await auth();
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SENSEI')) {
        throw new Error("Unauthorized");
    }

    let finalImageUrl = formData.imageUrl || null;

    // If a file is provided, try to upload it to S3
    if (formData.file) {
        const s3Url = await uploadFile(formData.file, "news");
        if (s3Url) finalImageUrl = s3Url;
    }

    const post = await prisma.post.create({
        data: {
            title: formData.title,
            content: formData.content,
            category: formData.category as any, // Enum mapping
            imageUrl: finalImageUrl,
            published: formData.published || false,
            authorId: session.user.id,
        }
    });

    revalidatePath('/admin/content');
    revalidatePath('/news');
    return post;
}
