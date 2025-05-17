import { MongoClient, ObjectId } from 'mongodb';
import type { Tweet } from './types';
import { MONGODB_URI } from '$env/static/private';

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

  async getScheduledTweets(userId: string, page: number, limit: number) {
    const db = await this.connect();
    const skip = (page - 1) * limit;
    
    const query = { userId, status: 'scheduled' };
    
    const tweetsFromDb = await db.collection('tweets')
      .find(query)
      .sort({ scheduledDate: 1 })
      .skip(skip)
      .limit(limit)
      .toArray();
      
    return tweetsFromDb.map(tweet => ({
      id: tweet._id.toString(),
      userId: tweet.userId,
      content: tweet.content,
      scheduledDate: new Date(tweet.scheduledDate),
      community: tweet.community,
      status: tweet.status,
      createdAt: new Date(tweet.createdAt),
      updatedAt: tweet.updatedAt ? new Date(tweet.updatedAt) : undefined
    }));
  }
  
  async countScheduledTweets(userId: string) {
    const db = await this.connect();
    return db.collection('tweets').countDocuments({ 
      userId, 
      status: 'scheduled' 
    });
  }
  
  async deleteTweet(tweetId: string, userId: string) {
    const db = await this.connect();
    try {
      const objectId = new ObjectId(tweetId);
      const result = await db.collection('tweets').deleteOne({
        _id: objectId,
        userId: userId
      });
      
      return {
        success: result.deletedCount > 0,
        deletedCount: result.deletedCount
      };
    } catch (error) {
      console.error('Error deleting tweet:', error);
      throw error;
    }
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