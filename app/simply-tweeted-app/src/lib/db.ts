import { MongoClient } from 'mongodb';
import type { Tweet } from './types';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'simplyTweeted';

class DatabaseClient {
  private static instance: DatabaseClient;
  private client: MongoClient;
  private connected = false;

  private constructor() {
    this.client = new MongoClient(MONGODB_URI);
  }

  public static getInstance(): DatabaseClient {
    if (!DatabaseClient.instance) {
      DatabaseClient.instance = new DatabaseClient();
    }
    return DatabaseClient.instance;
  }

  async connect() {
    if (!this.connected) {
      await this.client.connect();
      this.connected = true;
      console.log('Connected to MongoDB');
    }
    return this.client.db(DB_NAME);
  }

  async saveTweet(tweet: Tweet) {
    const db = await this.connect();
    const result = await db.collection('tweets').insertOne(tweet);
    return result.insertedId;
  }

  async getTweetsByUserId(userId: string) {
    const db = await this.connect();
    return db.collection('tweets').find({ userId }).toArray();
  }

  async close() {
    if (this.connected) {
      await this.client.close();
      this.connected = false;
      console.log('Disconnected from MongoDB');
    }
  }
}

export const dbClient = DatabaseClient.getInstance(); 