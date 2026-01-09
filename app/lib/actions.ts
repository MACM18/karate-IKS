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

export async function createExamTemplate(formData: FormData) {
    const session = await auth();
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SENSEI')) {
        throw new Error("Unauthorized");
    }

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const type = formData.get('type') as any; // ExamType
    const fieldsJson = formData.get('fields') as string;
    const folderName = formData.get('folderName') as string || "exams";

    const fields = JSON.parse(fieldsJson);

    const template = await prisma.examTemplate.create({
        data: {
            title,
            description,
            type,
            fields,
            folderName,
        }
    });

    revalidatePath('/admin/exams');
    return template;
}

export async function deleteExamTemplate(id: string) {
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN') {
        throw new Error("Unauthorized");
    }

    await prisma.examTemplate.delete({
        where: { id }
    });

    revalidatePath('/admin/exams');
}

export async function submitExamApplication(formData: FormData) {
    const session = await auth();
    if (!session || !session.user) {
        throw new Error("Unauthorized");
    }

    const templateId = formData.get('templateId') as string;
    const template = await prisma.examTemplate.findUnique({
        where: { id: templateId }
    });

    if (!template) throw new Error("Template not found");

    const fields = template.fields as any[];
    const submissionData: Record<string, any> = {};

    for (const field of fields) {
        if (field.type === 'file') {
            const file = formData.get(field.name) as File;
            if (file && file.size > 0) {
                // Upload to S3 with specific folder
                const s3Url = await uploadFile(file, `${template.folderName}/${session.user.id}`);
                submissionData[field.name] = s3Url;
            }
        } else {
            submissionData[field.name] = formData.get(field.name);
        }
    }

    const studentProfile = await prisma.studentProfile.findUnique({
        where: { userId: session.user.id }
    });

    if (!studentProfile) throw new Error("Student profile not found");

    const application = await prisma.examApplication.create({
        data: {
            studentId: studentProfile.id,
            templateId: template.id,
            submissionData,
        }
    });

    revalidatePath('/student/dashboard');
    return application;
}

export async function updateApplicationStatus(applicationId: string, status: 'APPROVED' | 'REJECTED' | 'REVIEWING') {
    const session = await auth();
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SENSEI')) {
        throw new Error("Unauthorized");
    }

    const application = await prisma.examApplication.update({
        where: { id: applicationId },
        data: { status },
        include: { student: true, template: true }
    });

    if (status === 'APPROVED') {
        // If it's a grading exam, we might want to automatically promote the student
        // This is a simplified logic: find the current rank and move to next
        const currentRank = await prisma.rank.findUnique({
            where: { id: application.student.currentRankId || "" }
        });

        const nextRank = await prisma.rank.findFirst({
            where: { order: { gt: currentRank?.order || -1 } },
            orderBy: { order: 'asc' }
        });

        if (nextRank) {
            await prisma.studentProfile.update({
                where: { id: application.student.id },
                data: { currentRankId: nextRank.id }
            });

            await prisma.studentPromotion.create({
                data: {
                    studentId: application.student.id,
                    rankId: nextRank.id,
                    notes: `Promoted via ${application.template.title}`
                }
            });
        }
    }

    revalidatePath('/admin/exams');
    revalidatePath('/student/dashboard');
    return application;
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
