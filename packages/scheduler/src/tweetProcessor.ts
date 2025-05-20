import { DatabaseClient } from 'shared-lib/backend';
import { TweetStatus, Tweet, UserAccount } from 'shared-lib';
import { TokenManager } from './tokenManager.js';
import { TwitterApi } from 'twitter-api-v2';

export class TweetProcessor {
  private dbClient: DatabaseClient;
  private tokenManager: TokenManager;

  constructor(dbClient: DatabaseClient, tokenManager: TokenManager) {
    this.dbClient = dbClient;
    this.tokenManager = tokenManager;
  }

  private async markTweetsAsFailed(tweets: Tweet[], reason: string, userId?: string) {
    const forUser = userId ? ` for user ${userId}` : '';
    console.error(`Marking ${tweets.length} tweets as FAILED${forUser}. Reason: ${reason}`);
    for (const tweet of tweets) {
      try {
        await this.dbClient.updateTweetStatus(tweet.id!, TweetStatus.FAILED);
      } catch (dbError) {
        console.error(`Error updating status for tweet ${tweet.id} to FAILED:`, dbError);
      }
    }
  }

  async processUserTweets(userId: string, tweets: Tweet[]): Promise<void> {
    console.log(`Processing ${tweets.length} tweets for user ${userId}`);
    try {
      const userAccounts = await this.dbClient.getUserAccounts(userId);
      if (userAccounts.length === 0) {
        await this.markTweetsAsFailed(tweets, `No accounts found for user ${userId}`, userId);
        return;
      }

      const twitterAccount = userAccounts.find((account: UserAccount) => account.provider === 'twitter');
      if (!twitterAccount) {
        await this.markTweetsAsFailed(tweets, `No Twitter account found for user ${userId}`, userId);
        return;
      }

      const twitterV2Client: TwitterApi = this.tokenManager.getTwitterApiClient(twitterAccount as UserAccount);

      for (const tweet of tweets) {
        try {
          console.log(`Attempting to post tweet ${tweet.id} for user ${userId}`);
          await twitterV2Client.v2.tweet(tweet.content);
          await this.dbClient.updateTweetStatus(tweet.id!, TweetStatus.POSTED);
          console.log(`Successfully posted tweet ${tweet.id}`);
        } catch (error) {
          console.error(`Error posting tweet ${tweet.id} for user ${userId}:`, error);
          await this.markTweetsAsFailed([tweet], `API error during posting for tweet ${tweet.id}`, userId);
        }
      }
    } catch (error) {
      // Catch errors related to fetching user accounts or initializing the Twitter client
      const errorMessage = error instanceof Error ? error.message : String(error);
      await this.markTweetsAsFailed(tweets, `Failed to process batch for user ${userId}: ${errorMessage}`, userId);
    }
  }
} 