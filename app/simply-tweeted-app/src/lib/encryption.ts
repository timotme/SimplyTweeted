import { AUTH_SECRET } from '$env/static/private';
import crypto from 'crypto';

// Use AES-256-GCM for encryption (more secure than CBC)
const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 12; // 12 bytes is recommended for GCM
const AUTH_TAG_LENGTH = 16; // 16 bytes for GCM auth tag

// Create a key from AUTH_SECRET
function getEncryptionKey(): Buffer {
  // Create a key that's exactly KEY_LENGTH bytes by hashing the AUTH_SECRET
  return crypto.createHash('sha256').update(AUTH_SECRET).digest().slice(0, KEY_LENGTH);
}

/**
 * Encrypts a string using the AUTH_SECRET with AES-256-GCM
 */
export function encrypt(text: string): string {
  if (!text) return '';
  
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  // Get the authentication tag
  const authTag = cipher.getAuthTag();
  
  // Return IV, encrypted data, and auth tag as a hex string
  return iv.toString('hex') + ':' + encrypted + ':' + authTag.toString('hex');
}

/**
 * Decrypts a string that was encrypted with the encrypt function
 */
export function decrypt(encryptedText: string): string {
  if (!encryptedText) return '';
  
  const key = getEncryptionKey();
  const parts = encryptedText.split(':');
  
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted text format');
  }
  
  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = parts[1];
  const authTag = Buffer.from(parts[2], 'hex');
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
} 