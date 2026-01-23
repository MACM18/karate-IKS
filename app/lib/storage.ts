import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const s3Client = process.env.S3_ACCESS_KEY_ID ? new S3Client({
    region: process.env.S3_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
    endpoint: process.env.S3_ENDPOINT,
    forcePathStyle: !!process.env.S3_ENDPOINT,
}) : null;

/**
 * Uploads a file to S3 or Local Storage and returns the public URL.
 */
export async function uploadFile(file: File, folder: string = "uploads"): Promise<string | null> {
    const fileExtension = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;

    // Fallback to Local Storage if S3 is not configured
    if (!s3Client) {
        console.warn("S3 Storage not configured. Using local storage (public/uploads).");
        try {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // Ensure directory exists
            const publicPath = path.join(process.cwd(), "public", "uploads", folder);
            await mkdir(publicPath, { recursive: true });

            // Write file
            const filePath = path.join(process.cwd(), "public", "uploads", fileName);
            await writeFile(filePath, buffer);

            return `/uploads/${fileName}`;
        } catch (error) {
            console.error("Local Upload Error:", error);
            return null;
        }
    }

    const bucketName = process.env.S3_BUCKET_NAME;
    if (!bucketName) {
        console.error("S3_BUCKET_NAME is missing.");
        return null;
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    try {
        await s3Client.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: fileName,
            Body: buffer,
            ContentType: file.type,
        }));

        const baseUrl = process.env.S3_PUBLIC_URL || `https://${bucketName}.s3.${process.env.S3_REGION || "us-east-1"}.amazonaws.com`;
        return `${baseUrl}/${fileName}`;
    } catch (error) {
        console.error("S3 Upload Error:", error);
        return null;
    }
}

/**
 * Deletes a file from S3 given its full URL.
 */
export async function deleteFile(fileUrl: string): Promise<boolean> {
    if (!s3Client || !fileUrl) return false;

    const bucketName = process.env.S3_BUCKET_NAME;
    if (!bucketName) return false;

    try {
        // Extract Key from URL
        // Assuming URL format: https://[bucket].s3.[region].amazonaws.com/[key] or similar
        // We need to parse the URL to get the path
        const url = new URL(fileUrl);
        // The pathname includes the leading slash, so we slice it off
        const key = url.pathname.substring(1);

        await s3Client.send(new DeleteObjectCommand({
            Bucket: bucketName,
            Key: key,
        }));

        return true;
    } catch (error) {
        console.error("S3 Delete Error:", error);
        return false;
    }
}
