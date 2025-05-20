import { MONGODB_URI, AUTH_SECRET, DB_ENCRYPTION_KEY } from '$env/static/private';
import { DatabaseClient } from 'shared-lib/backend';

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not set in environment variables for Svelte app');
}
if (!DB_ENCRYPTION_KEY) {
  throw new Error('DB_ENCRYPTION_KEY is not set in environment variables for Svelte app');
}

export const dbClient = DatabaseClient.getInstance(MONGODB_URI, DB_ENCRYPTION_KEY); 