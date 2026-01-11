"use server";

import { prisma } from "@/app/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { uploadFile, deleteFile } from "@/app/lib/storage";
import { encrypt } from "@/app/lib/encryption";
import bcrypt from "bcryptjs";

export async function createGalleryItem(formData: FormData) {
  const session = await auth();
  if (
    !session ||
    (session.user.role !== "ADMIN" && session.user.role !== "SENSEI")
  ) {
    throw new Error("Unauthorized");
  }

  const url = formData.get("url") as string;
  const file = formData.get("file") as File;
  const title = formData.get("title") as string;
  const caption = formData.get("caption") as string;
  const category = formData.get("category") as string;
  const featured = formData.get("featured") === "true";

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
      title: title || "Untitled",
      caption: caption,
      category: category,
      featured: featured,
    },
  });

  revalidatePath("/admin/content");
  revalidatePath("/gallery");
  revalidatePath("/news");
  return item;
}

export async function createPost(formData: FormData) {
  const session = await auth();
  if (
    !session ||
    (session.user.role !== "ADMIN" && session.user.role !== "SENSEI")
  ) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const category = formData.get("category") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const file = formData.get("file") as File;
  const published = formData.get("published") === "true";

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
    },
  });

  revalidatePath("/admin/content");
  revalidatePath("/news");
  return post;
}

export async function createAchievement(data: {
  title: string;
  studentId: string;
  description?: string;
  date?: string;
}) {
  const session = await auth();
  if (
    !session ||
    (session.user.role !== "ADMIN" && session.user.role !== "SENSEI")
  ) {
    throw new Error("Unauthorized");
  }

  const achievement = await prisma.achievement.create({
    data: {
      title: data.title,
      studentId: data.studentId,
      description: data.description || "",
      date: data.date ? new Date(data.date) : new Date(),
    },
  });

  revalidatePath("/admin/students");
  revalidatePath("/student/dashboard");
  return achievement;
}

export async function deleteAchievement(id: string) {
  const session = await auth();
  if (
    !session ||
    (session.user.role !== "SENSEI" && session.user.role !== "ADMIN")
  ) {
    throw new Error("Unauthorized");
  }

  await prisma.achievement.delete({ where: { id } });
  revalidatePath("/student/dashboard");
}

// --- CMS Update/Delete Actions ---

export async function updatePost(id: string, formData: FormData) {
  const session = await auth();
  if (
    !session ||
    (session.user.role !== "SENSEI" && session.user.role !== "ADMIN")
  ) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const category = formData.get("category") as any;
  const published = formData.get("published") === "true";
  const imageUrl = formData.get("imageUrl") as string;
  const file = formData.get("file") as File;

  let finalImageUrl = imageUrl || null;
  if (file && file.size > 0) {
    const s3Url = await uploadFile(file, "news");
    if (s3Url) finalImageUrl = s3Url;
  }

  await prisma.post.update({
    where: { id },
    data: { title, content, category, published, imageUrl: finalImageUrl },
  });

  revalidatePath("/");
  revalidatePath("/news");
  revalidatePath("/admin/content");
}

export async function deletePost(id: string) {
  const session = await auth();
  if (
    !session ||
    (session.user.role !== "SENSEI" && session.user.role !== "ADMIN")
  ) {
    throw new Error("Unauthorized");
  }

  await prisma.post.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/news");
}

export async function deleteGalleryItem(id: string) {
  const session = await auth();
  if (
    !session ||
    (session.user.role !== "SENSEI" && session.user.role !== "ADMIN")
  ) {
    throw new Error("Unauthorized");
  }

  await prisma.galleryItem.delete({ where: { id } });
  revalidatePath("/gallery");
  revalidatePath("/admin/content");
}

export async function toggleGalleryFeatured(id: string, featured: boolean) {
  const session = await auth();
  if (
    !session ||
    (session.user.role !== "SENSEI" && session.user.role !== "ADMIN")
  ) {
    throw new Error("Unauthorized");
  }

  await prisma.galleryItem.update({
    where: { id },
    data: { featured },
  });

  revalidatePath("/");
  revalidatePath("/gallery");
}

export async function createExamTemplate(formData: FormData) {
  const session = await auth();
  if (
    !session ||
    (session.user.role !== "ADMIN" && session.user.role !== "SENSEI")
  ) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const type = formData.get("type") as any; // ExamType
  const fieldsJson = formData.get("fields") as string;
  const folderName = (formData.get("folderName") as string) || "exams";
  const openDateStr = formData.get("openDate") as string;
  const deadlineStr = formData.get("deadline") as string;

  const fields = JSON.parse(fieldsJson);

  const template = await prisma.examTemplate.create({
    data: {
      title,
      description,
      type,
      fields,
      folderName,
      openDate: new Date(openDateStr),
      deadline: deadlineStr ? new Date(deadlineStr) : null,
    },
  });

  revalidatePath("/admin/exams");
  return template;
}

export async function deleteExamTemplate(id: string) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.examTemplate.delete({
    where: { id },
  });

  revalidatePath("/admin/exams");
}

export async function submitExamApplication(formData: FormData) {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const templateId = formData.get("templateId") as string;
  const template = await prisma.examTemplate.findUnique({
    where: { id: templateId },
  });

  if (!template) throw new Error("Template not found");

  const fields = template.fields as any[];
  const submissionData: Record<string, any> = {};

  for (const field of fields) {
    if (field.type === "file") {
      const file = formData.get(field.name) as File;
      if (file && file.size > 0) {
        // Upload to S3 with specific folder
        const s3Url = await uploadFile(
          file,
          `${template.folderName}/${session.user.id}`
        );
        submissionData[field.name] = s3Url;
      }
    } else {
      submissionData[field.name] = formData.get(field.name);
    }
  }

  const studentProfile = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!studentProfile) throw new Error("Student profile not found");

  const application = await prisma.examApplication.create({
    data: {
      studentId: studentProfile.id,
      templateId: template.id,
      submissionData,
    },
  });

  revalidatePath("/student/dashboard");
  return application;
}

export async function updateApplicationStatus(
  applicationId: string,
  status: "APPROVED" | "REJECTED" | "REVIEWING"
) {
  const session = await auth();
  if (
    !session ||
    (session.user.role !== "ADMIN" && session.user.role !== "SENSEI")
  ) {
    throw new Error("Unauthorized");
  }

  const application = await prisma.examApplication.update({
    where: { id: applicationId },
    data: { status },
    include: { student: true, template: true },
  });

  if (status === "APPROVED") {
    // If it's a grading exam, we might want to automatically promote the student
    // This is a simplified logic: find the current rank and move to next
    const currentRank = await prisma.rank.findUnique({
      where: { id: application.student.currentRankId || "" },
    });

    const nextRank = await prisma.rank.findFirst({
      where: { order: { gt: currentRank?.order || -1 } },
      orderBy: { order: "asc" },
    });

    if (nextRank) {
      await prisma.studentProfile.update({
        where: { id: application.student.id },
        data: { currentRankId: nextRank.id },
      });

      await prisma.studentPromotion.create({
        data: {
          studentId: application.student.id,
          rankId: nextRank.id,
          notes: `Promoted via ${application.template.title}`,
        },
      });
    }
  }

  revalidatePath("/admin/exams");
  revalidatePath("/student/dashboard");
  return application;
}

// --- Program Actions ---

export async function createProgram(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN")
    throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const ageGroup = formData.get("ageGroup") as string;
  const description = formData.get("description") as string;
  const benefitsString = formData.get("benefits") as string;
  const benefits = benefitsString
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s);
  const color = formData.get("color") as string;
  const icon = formData.get("icon") as string;
  const featured = formData.get("featured") === "true";

  await prisma.program.create({
    data: {
      title,
      ageGroup,
      description,
      benefits,
      color,
      icon,
      featured,
    },
  });

  revalidatePath("/programs");
  revalidatePath("/admin/content/programs");
}

export async function updateProgram(id: string, formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN")
    throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const ageGroup = formData.get("ageGroup") as string;
  const description = formData.get("description") as string;
  const benefitsString = formData.get("benefits") as string;
  const benefits = benefitsString
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s);
  const color = formData.get("color") as string;
  const icon = formData.get("icon") as string;
  const featured = formData.get("featured") === "true";

  await prisma.program.update({
    where: { id },
    data: {
      title,
      ageGroup,
      description,
      benefits,
      color,
      icon,
      featured,
    },
  });

  revalidatePath("/programs");
  revalidatePath("/admin/content/programs");
}

export async function deleteProgram(id: string) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN")
    throw new Error("Unauthorized");

  await prisma.program.delete({ where: { id } });

  revalidatePath("/programs");
  revalidatePath("/admin/content/programs");
}

export async function markSelfAttendance(classType: string) {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  // Default to "Adults" if the class type passed is generic or invalid for strict schema,
  // although schema is relaxed now, it helps data consistency.
  // Map "General Training" to "Adults" or keep as is since schema allows string.
  const finalClassType =
    classType === "General Training" ? "Adults" : classType;

  const studentProfile = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
  });

  // ... rest of function

  if (!studentProfile) throw new Error("Student profile not found");

  // Check if already checked in today for this class type to prevent duplicates
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existing = await prisma.attendance.findFirst({
    where: {
      studentId: studentProfile.id,
      classType,
      date: {
        gte: today,
      },
    },
  });

  if (existing) {
    throw new Error("Already checked in for this class today.");
  }

  await prisma.attendance.create({
    data: {
      studentId: studentProfile.id,
      classType,
      date: new Date(),
    },
  });

  revalidatePath("/student/dashboard");
}

export async function updateStudentProfile(formData: FormData) {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const bio = formData.get("bio") as string;
  const phone = formData.get("phone") as string;
  const emergencyContact = formData.get("emergencyContact") as string;
  const file = formData.get("image") as File;

  let finalImageUrl = session.user.image;

  if (file && file.size > 0) {
    const s3Url = await uploadFile(file, `profiles/${session.user.id}`);
    if (s3Url) {
      // Delete old image if it exists and isn't null
      if (session.user.image) {
        await deleteFile(session.user.image);
      }
      finalImageUrl = s3Url;
    }
  }

  // Encrypt sensitive PII before saving
  const encryptedPhone = phone ? encrypt(phone) : null;
  const encryptedEmergency = emergencyContact
    ? encrypt(emergencyContact)
    : null;

  // Update StudentProfile
  await prisma.studentProfile.update({
    where: { userId: session.user.id },
    data: {
      bio,
      phone: encryptedPhone,
      emergencyContact: encryptedEmergency,
    },
  });

  // Update User image if changed
  if (finalImageUrl !== session.user.image) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: finalImageUrl },
    });
  }

  revalidatePath("/student/dashboard");
}

export async function createSenseiAccount(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: hashedPassword,
      role: "SENSEI",
    },
  });

  revalidatePath("/admin/staff");
  return user;
}

export async function deleteSenseiAccount(userId: string) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  // Don't allow deleting yourself
  if (session.user.id === userId) {
    throw new Error("Cannot delete your own account");
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  revalidatePath("/admin/staff");
}

export async function toggleStudentActiveStatus(
  studentId: string,
  isActive: boolean
) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.studentProfile.update({
    where: { id: studentId },
    data: { isActive },
  });

  revalidatePath("/admin/students");
}

export async function updateStudentClass(studentId: string, classId: string) {
  const session = await auth();
  if (
    !session ||
    (session.user.role !== "ADMIN" && session.user.role !== "SENSEI")
  ) {
    throw new Error("Unauthorized");
  }

  await prisma.studentProfile.update({
    where: { id: studentId },
    data: { classId: classId || null },
  });

  revalidatePath("/admin/students");
}

// authenticate function removed - using client-side signIn in login page

export async function promoteStudents(studentIds: string[]) {
  const session = await auth();
  if (
    !session ||
    (session.user.role !== "ADMIN" && session.user.role !== "SENSEI")
  ) {
    throw new Error("Unauthorized");
  }

  const allRanks = await prisma.rank.findMany({ orderBy: { order: "asc" } });

  for (const id of studentIds) {
    await prisma.$transaction(async (tx) => {
      const student = await tx.studentProfile.findUnique({
        where: { id },
        include: { currentRank: true },
      });

      if (!student) return;

      const currentOrder = student.currentRank?.order ?? -1;
      const nextRank = allRanks.find((r) => r.order === currentOrder + 1);

      if (!nextRank) return;

      // Update student rank
      await tx.studentProfile.update({
        where: { id },
        data: { currentRankId: nextRank.id },
      });

      // Create promotion history
      await tx.studentPromotion.create({
        data: {
          studentId: id,
          rankId: nextRank.id,
          notes: `Promoted from ${student.currentRank?.name || "White"} to ${nextRank.name
            }`,
        },
      });
    });
  }

  revalidatePath("/admin/promotions");
}

export async function adminUpdateStudentProfile(
  studentId: string,
  data: { name: string; admissionNumber: string; email: string }
) {
  const session = await auth();
  if (
    !session ||
    (session.user.role !== "ADMIN" && session.user.role !== "SENSEI")
  ) {
    throw new Error("Unauthorized");
  }

  const student = await prisma.studentProfile.findUnique({
    where: { id: studentId },
    include: { user: true },
  });

  if (!student) throw new Error("Student not found");

  await prisma.$transaction([
    prisma.user.update({
      where: { id: student.userId },
      data: { name: data.name, email: data.email },
    }),
    prisma.studentProfile.update({
      where: { id: studentId },
      data: { admissionNumber: data.admissionNumber },
    }),
  ]);

  revalidatePath("/admin/students");
}

export async function updateStudentPassword(
  studentId: string,
  password: string
) {
  const session = await auth();
  if (
    !session ||
    (session.user.role !== "ADMIN" && session.user.role !== "SENSEI")
  ) {
    throw new Error("Unauthorized");
  }

  const student = await prisma.studentProfile.findUnique({
    where: { id: studentId },
  });

  if (!student) throw new Error("Student not found");

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: student.userId },
    data: { passwordHash },
  });

  revalidatePath("/admin/students");
}

export async function assignStudentClass(studentId: string, classId: string) {
  const session = await auth();
  if (
    !session ||
    (session.user.role !== "ADMIN" && session.user.role !== "SENSEI")
  ) {
    throw new Error("Unauthorized");
  }

  await prisma.studentProfile.update({
    where: { id: studentId },
    data: { classId: classId === "none" ? null : classId },
  });

  revalidatePath("/admin/students");
}

// --- Curriculum Actions ---

export async function createCurriculumItem(formData: FormData) {
  const session = await auth();
  if (
    !session ||
    (session.user.role !== "ADMIN" && session.user.role !== "SENSEI")
  ) {
    throw new Error("Unauthorized");
  }

  const rankId = formData.get("rankId") as string;
  const category = formData.get("category") as any;
  const itemName = formData.get("itemName") as string;
  const description = formData.get("description") as string;
  const videoUrl = formData.get("videoUrl") as string;
  const isRequired = formData.get("isRequired") === "true";
  const order = parseInt(formData.get("order") as string) || 0;

  await prisma.curriculumItem.create({
    data: {
      rankId,
      category,
      itemName,
      description,
      videoUrl: videoUrl || null,
      isRequired,
      order,
    },
  });

  revalidatePath(`/admin/curriculum/${rankId}`);
}

export async function updateCurriculumItem(id: string, formData: FormData) {
  const session = await auth();
  if (
    !session ||
    (session.user.role !== "ADMIN" && session.user.role !== "SENSEI")
  ) {
    throw new Error("Unauthorized");
  }

  const rankId = formData.get("rankId") as string;
  const category = formData.get("category") as any;
  const itemName = formData.get("itemName") as string;
  const description = formData.get("description") as string;
  const videoUrl = formData.get("videoUrl") as string;
  const isRequired = formData.get("isRequired") === "true";
  const order = parseInt(formData.get("order") as string) || 0;

  await prisma.curriculumItem.update({
    where: { id },
    data: {
      category,
      itemName,
      description,
      videoUrl: videoUrl || null,
      isRequired,
      order,
    },
  });

  if (rankId) {
    revalidatePath(`/admin/curriculum/${rankId}`);
  }
}

export async function deleteCurriculumItem(id: string, rankId: string) {
  const session = await auth();
  if (
    !session ||
    (session.user.role !== "ADMIN" && session.user.role !== "SENSEI")
  ) {
    throw new Error("Unauthorized");
  }

  await prisma.curriculumItem.delete({
    where: { id },
  });

  revalidatePath(`/admin/curriculum/${rankId}`);
}

export async function updateStudentRank(studentId: string, rankId: string) {
  const session = await auth();
  if (
    !session ||
    (session.user.role !== "ADMIN" && session.user.role !== "SENSEI")
  ) {
    throw new Error("Unauthorized");
  }

  await prisma.studentProfile.update({
    where: { id: studentId },
    data: { currentRankId: rankId },
  });

  // Log promotion history (manual adjustment)
  await prisma.studentPromotion.create({
    data: {
      studentId: studentId,
      rankId: rankId,
      notes: "Manual rank adjustment by Sensei",
    },
  });

  revalidatePath("/admin/students");
}

export async function createStudentManually(prevState: any, formData: FormData) {
  const session = await auth();
  if (
    !session ||
    (session.user.role !== "ADMIN" && session.user.role !== "SENSEI")
  ) {
    return { error: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "Missing fields" };
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: "STUDENT",
      },
    });

    const year = new Date().getFullYear();
    const count = await prisma.studentProfile.count({
      where: {
        admissionNumber: {
          startsWith: `KS-${year}`,
        },
      },
    });
    const admissionNumber = `KS-${year}-${(count + 1)
      .toString()
      .padStart(3, "0")}`;

    const rank = await prisma.rank.findFirst({ orderBy: { order: "asc" } });

    await prisma.studentProfile.create({
      data: {
        userId: user.id,
        admissionNumber,
        currentRankId: rank?.id,
        dateOfBirth: new Date(),
      },
    });

    revalidatePath("/admin/students");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Failed to create student. Email might be in use." };
  }
}
