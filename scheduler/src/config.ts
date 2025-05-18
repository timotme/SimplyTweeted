import dotenv from 'dotenv';

dotenv.config();

export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
export const SCHEDULER_INTERVAL_MINUTES = parseInt(process.env.SCHEDULER_INTERVAL_MINUTES || '10', 10);
export const AUTH_TWITTER_ID = process.env.TWITTER_CLIENT_ID || '';
export const AUTH_TWITTER_SECRET = process.env.TWITTER_CLIENT_SECRET || '';
export const TWITTER_API_KEY = process.env.TWITTER_API_KEY || '';
export const TWITTER_API_SECRET = process.env.TWITTER_API_SECRET || ''; 