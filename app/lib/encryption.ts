import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // Standard for GCM
const AUTH_TAG_LENGTH = 16;

/**
 * Encrypts a string using AES-256-GCM.
 * The output is in the format: iv:authTag:encryptedContent
 */
export function encrypt(text: string): string {
    if (!text) return text;
    if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
        throw new Error('ENCRYPTION_KEY must be a 32-character string in .env');
    }

    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag().toString('hex');

    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

/**
 * Decrypts a string encrypted with the logic above.
 */
export function decrypt(encryptedText: string): string {
    if (!encryptedText || !encryptedText.includes(':')) return encryptedText;
    if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
        throw new Error('ENCRYPTION_KEY must be a 32-character string in .env');
    }

    const [ivHex, authTagHex, contentHex] = encryptedText.split(':');

    if (!ivHex || !authTagHex || !contentHex) {
        return encryptedText; // Fallback or throw error
    }

    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);

    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(contentHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

