import crypto from 'crypto';

export class EncryptionService {
  private static readonly ALGORITHM = 'aes-256-gcm';
  private static readonly KEY_LENGTH = 32;
  private static readonly IV_LENGTH = 12;

  private authSecret: string;

  constructor(secret: string) {
    if (!secret) {
      throw new Error("AUTH_SECRET is required for encryption module initialization");
    }
    this.authSecret = secret;
  }

  private getEncryptionKey(): Buffer {
    if (!this.authSecret) {
      // This case should ideally not be hit if the constructor ensures authSecret is set.
      // However, keeping it for robustness, or consider if this check is still needed.
      throw new Error("Encryption module not initialized. Call initEncryption(secret) first.");
    }
    // Create a key that's exactly KEY_LENGTH bytes by hashing the AUTH_SECRET
    return crypto.createHash('sha256').update(this.authSecret).digest().slice(0, EncryptionService.KEY_LENGTH);
  }

  /**
   * Encrypts a string using the AUTH_SECRET with AES-256-GCM
   */
  public encrypt(text: string): string {
    if (!text) return '';

    const key = this.getEncryptionKey();
    const iv = crypto.randomBytes(EncryptionService.IV_LENGTH);
    const cipher = crypto.createCipheriv(EncryptionService.ALGORITHM, key, iv);

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
  public decrypt(encryptedText: string): string {
    if (!encryptedText) return '';

    const key = this.getEncryptionKey();
    const parts = encryptedText.split(':');

    if (parts.length !== 3) {
      throw new Error('Invalid encrypted text format');
    }

    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    const authTag = Buffer.from(parts[2], 'hex');

    const decipher = crypto.createDecipheriv(EncryptionService.ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
} 