-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "authorId" TEXT;

-- AlterTable
ALTER TABLE "StudentProfile" ADD COLUMN     "bio" TEXT;

-- CreateTable
CREATE TABLE "GalleryItem" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "category" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GalleryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "studentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Achievement" ADD CONSTRAINT "Achievement_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
