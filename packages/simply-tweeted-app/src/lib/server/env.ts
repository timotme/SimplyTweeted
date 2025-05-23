import { env as privateEnv } from '$env/dynamic/private';

export const AUTH_SECRET = privateEnv.AUTH_SECRET || '';
export const DB_ENCRYPTION_KEY = privateEnv.DB_ENCRYPTION_KEY || '';
export const AUTH_TWITTER_ID = privateEnv.AUTH_TWITTER_ID || '';
export const AUTH_TWITTER_SECRET = privateEnv.AUTH_TWITTER_SECRET || '';
export const ALLOWED_TWITTER_ACCOUNTS = privateEnv.ALLOWED_TWITTER_ACCOUNTS || '';
export const MONGODB_URI = privateEnv.MONGODB_URI || '';
export const AUTH_TRUST_HOST = privateEnv.AUTH_TRUST_HOST || 'true'; 