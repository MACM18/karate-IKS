"use server";

import { prisma } from "@/app/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { uploadFile } from "@/app/lib/storage";

export async function createGalleryItem(formData: FormData) {
    const session = await auth();
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SENSEI')) {
        throw new Error("Unauthorized");
    }

    const url = formData.get('url') as string;
    const file = formData.get('file') as File;
    const caption = formData.get('caption') as string;
    const category = formData.get('category') as string;
    const featured = formData.get('featured') === 'true';

    let finalUrl = url || "";

    // If a file is provided, try to upload it to S3
    if (file && file.size > 0) {
        const s3Url = await uploadFile(file, "gallery");
        if (s3Url) finalUrl = s3Url;
    }

    if (!finalUrl) {
        throw new Error("No image visual provided (URL or File required)");
    }

    const item = await prisma.galleryItem.create({
        data: {
            url: finalUrl,
            caption: caption,
            category: category,
            featured: featured,
        }
    });

    revalidatePath('/admin/content');
    revalidatePath('/gallery');
    revalidatePath('/news');
    return item;
}

export async function createPost(formData: FormData) {
    const session = await auth();
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SENSEI')) {
        throw new Error("Unauthorized");
    }

    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const category = formData.get('category') as string;
    const imageUrl = formData.get('imageUrl') as string;
    const file = formData.get('file') as File;
    const published = formData.get('published') === 'true';

    let finalImageUrl = imageUrl || null;

    // If a file is provided, try to upload it to S3
    if (file && file.size > 0) {
        const s3Url = await uploadFile(file, "news");
        if (s3Url) finalImageUrl = s3Url;
    }

    const post = await prisma.post.create({
        data: {
            title: title,
            content: content,
            category: category as any, // Enum mapping
            imageUrl: finalImageUrl,
            published: published,
            authorId: session.user.id,
        }
    });

    revalidatePath('/admin/content');
    revalidatePath('/news');
    return post;
}

export async function createAchievement(data: { title: string; studentId: string; description?: string }) {
    const session = await auth();
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SENSEI')) {
        throw new Error("Unauthorized");
    }

    const achievement = await prisma.achievement.create({
        data: {
            title: data.title,
            studentId: data.studentId,
            description: data.description || "",
        }
    });

    revalidatePath('/admin/students');
    revalidatePath('/student/dashboard');
    return achievement;
}

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        const { signIn } = await import("@/auth");
        await signIn('credentials', formData);
    } catch (error: any) {
        if (error.type === 'CredentialsSignin') {
            return 'Invalid credentials.';
        }
        throw error;
    }
}
