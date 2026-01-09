import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = process.env.S3_ACCESS_KEY_ID ? new S3Client({
    region: process.env.S3_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
    endpoint: process.env.S3_ENDPOINT, // Support for S3-compatible storage
    forcePathStyle: !!process.env.S3_ENDPOINT,
}) : null;

/**
 * Uploads a file to S3 and returns the public URL.
 * If S3 is not configured, returns null to signal fallback to the provided URL (if any).
 */
export async function uploadFile(file: File, folder: string = "uploads"): Promise<string | null> {
    if (!s3Client) {
        console.warn("S3 Storage not configured. Skipping upload.");
        return null;
    }

    const bucketName = process.env.S3_BUCKET_NAME;
    if (!bucketName) {
        console.error("S3_BUCKET_NAME is missing.");
        return null;
    }

    const fileExtension = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    try {
        await s3Client.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: fileName,
            Body: buffer,
            ContentType: file.type,
            // ACL: 'public-read', // Uncomment if bucket is not public by default
        }));

        // Construct the public URL
        // If using custom endpoint (like Cloudflare R2 or DigitalOcean), the URL might differ
        const baseUrl = process.env.S3_PUBLIC_URL || `https://${bucketName}.s3.${process.env.S3_REGION || "us-east-1"}.amazonaws.com`;
        return `${baseUrl}/${fileName}`;
    } catch (error) {
        console.error("S3 Upload Error:", error);
        return null;
    }
}
