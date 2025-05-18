import dotenv from 'dotenv';

dotenv.config();

export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
export const DB_ENCRYPTION_KEY = process.env.DB_ENCRYPTION_KEY || '';
export const AUTH_TWITTER_ID = process.env.AUTH_TWITTER_ID || '';
export const AUTH_TWITTER_SECRET = process.env.AUTH_TWITTER_SECRET || '';
export const TWITTER_API_KEY = process.env.TWITTER_API_KEY || '';
export const TWITTER_API_SECRET = process.env.TWITTER_API_SECRET || ''; 
export const CRON_SCHEDULE = process.env.CRON_SCHEDULE || '* * * * *';