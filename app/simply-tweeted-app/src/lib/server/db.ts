import { DatabaseClient, initEncryption } from 'shared-lib/backend';
import { MONGODB_URI, AUTH_SECRET } from '$env/static/private';

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not set in environment variables for Svelte app');
}
if (!AUTH_SECRET) {
  throw new Error('AUTH_SECRET is not set in environment variables for Svelte app');
}

initEncryption(AUTH_SECRET);
export const dbClient = DatabaseClient.getInstance(MONGODB_URI); 