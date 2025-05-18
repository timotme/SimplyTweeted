import { MongoClient, ObjectId } from 'mongodb';
import type { Tweet, UserAccount } from '../types/types'; 
import { TweetStatus } from '../types/types'; 
import { EncryptionService } from './encryption';

const DB_NAME = 'simplyTweeted';

class DatabaseClient {
  private static instance: DatabaseClient;
  private client: MongoClient;
  private connected = false;
  private mongoDbUri: string;
  private encryptionService: EncryptionService;

  private constructor(mongoDbUri: string, authSecret: string) {
    this.mongoDbUri = mongoDbUri;
    this.client = new MongoClient(this.mongoDbUri);
    if (!authSecret) {
        throw new Error("Auth Secret is required for DatabaseClient initialization");
    }
    this.encryptionService = new EncryptionService(authSecret);
  }

  public static getInstance(mongoDbUri?: string, authSecret?: string): DatabaseClient {
    if (!DatabaseClient.instance) {
      if (!mongoDbUri) {
        throw new Error("MongoDB URI is required for the first instantiation of DatabaseClient");
      }
      if (!authSecret) {
        throw new Error("Auth Secret is required for the first instantiation of DatabaseClient");
      }
      DatabaseClient.instance = new DatabaseClient(mongoDbUri, authSecret);
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

  async getTweets(
    userId: string, 
    page: number, 
    limit: number, 
    status: TweetStatus | TweetStatus[] = TweetStatus.SCHEDULED,
    sortDirection: 1 | -1 = 1 // 1 for ascending (default for scheduled), -1 for descending (for history)
  ) {
    const db = await this.connect();
    const skip = (page - 1) * limit;
    
    const query = { 
      userId,
      status: Array.isArray(status) ? { $in: status } : status
    };
    
    const tweetsFromDb = await db.collection('tweets')
      .find(query)
      .sort({ scheduledDate: sortDirection })
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
  
  // Legacy method for backward compatibility
  async getScheduledTweets(userId: string, page: number, limit: number) {
    return this.getTweets(userId, page, limit, TweetStatus.SCHEDULED, 1);
  }
  
  // Legacy method for backward compatibility
  async getHistoryTweets(userId: string, page: number, limit: number) {
    return this.getTweets(userId, page, limit, [TweetStatus.POSTED, TweetStatus.FAILED], -1);
  }
  
  async countTweets(userId: string, status: TweetStatus | TweetStatus[] = TweetStatus.SCHEDULED) {
    const db = await this.connect();
    const query = {
      userId,
      status: Array.isArray(status) ? { $in: status } : status
    };
    return db.collection('tweets').countDocuments(query);
  }
  
  // Legacy method for backward compatibility
  async countScheduledTweets(userId: string) {
    return this.countTweets(userId, TweetStatus.SCHEDULED);
  }
  
  // Legacy method for backward compatibility
  async countHistoryTweets(userId: string) {
    return this.countTweets(userId, [TweetStatus.POSTED, TweetStatus.FAILED]);
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

  // Create or update a user account
  async saveUserAccount(userAccount: UserAccount): Promise<string> {
    const db = await this.connect();
    
    // Encrypt sensitive data
    const encryptedAccount = {
      ...userAccount,
      access_token: this.encryptionService.encrypt(userAccount.access_token),
      refresh_token: this.encryptionService.encrypt(userAccount.refresh_token),
      updatedAt: new Date()
    };
    
    // Check if user account already exists
    const existingAccount = await db.collection('accounts').findOne({
      userId: userAccount.userId,
      provider: userAccount.provider
    });
    
    if (existingAccount) {
      // Update existing account
      await db.collection('accounts').updateOne(
        { _id: existingAccount._id },
        { $set: encryptedAccount }
      );
      return existingAccount._id.toString();
    } else {
      // Insert new account with creation time
      const result = await db.collection('accounts').insertOne({
        ...encryptedAccount,
        createdAt: new Date()
      });
      return result.insertedId.toString();
    }
  }

  // Get user account with decrypted tokens
  async getUserAccount(userId: string, provider: string): Promise<UserAccount | null> {
    const db = await this.connect();
    
    const account = await db.collection('accounts').findOne({
      userId,
      provider
    });
    
    if (!account) return null;
    
    // Decrypt sensitive data and remove MongoDB _id
    const { _id, ...accountData } = account;
    return {
      ...accountData,
      access_token: this.encryptionService.decrypt(account.access_token),
      refresh_token: this.encryptionService.decrypt(account.refresh_token)
    } as UserAccount;
  }

  // Get all user accounts for a user
  async getUserAccounts(userId: string): Promise<UserAccount[]> {
    const db = await this.connect();
    
    const accounts = await db.collection('accounts').find({
      userId
    }).toArray();
    
    // Decrypt sensitive data for all accounts
    return accounts.map(account => {
      const { _id, ...accountData } = account;
      return {
        ...accountData,
        access_token: this.encryptionService.decrypt(account.access_token),
        refresh_token: this.encryptionService.decrypt(account.refresh_token)
      } as UserAccount;
    });
  }

  // Find all tweets that are scheduled and due to be posted
  async findDueTweets(): Promise<Tweet[]> {
    const db = await this.connect();
    const now = new Date();
    
    const tweets = await db.collection('tweets').find({
      status: TweetStatus.SCHEDULED,
      scheduledDate: { $lte: now }
    }).toArray();
    
    return tweets.map(tweet => ({
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

  // Update the status of a tweet
  async updateTweetStatus(tweetId: string, status: TweetStatus): Promise<void> {
    const db = await this.connect();
    await db.collection('tweets').updateOne(
      { _id: new ObjectId(tweetId) },
      { 
        $set: { 
          status,
          updatedAt: new Date()
        } 
      }
    );
  }
}

export { DatabaseClient };