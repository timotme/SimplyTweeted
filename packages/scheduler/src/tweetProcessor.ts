import { DatabaseClient } from 'shared-lib/backend';
import { TweetStatus, Tweet, UserAccount, getCommunityId } from 'shared-lib';
import { TokenManager } from './tokenManager.js';
import { TwitterApi } from 'twitter-api-v2';
import { log } from './logger.js';

export class TweetProcessor {
  private dbClient: DatabaseClient;
  private tokenManager: TokenManager;

  constructor(dbClient: DatabaseClient, tokenManager: TokenManager) {
    this.dbClient = dbClient;
    this.tokenManager = tokenManager;
  }

  private async markTweetsAsFailed(tweets: Tweet[], reason: string, userId?: string) {
    const forUser = userId ? ` for user ${userId}` : '';
    log.error(`Marking ${tweets.length} tweets as FAILED${forUser}. Reason: ${reason}`, { 
      tweetCount: tweets.length,
      userId,
      reason 
    });
    for (const tweet of tweets) {
      try {
        await this.dbClient.updateTweetStatus(tweet.id!, TweetStatus.FAILED);
      } catch (dbError) {
        log.error(`Error updating status for tweet ${tweet.id} to FAILED:`, { 
          tweetId: tweet.id,
          error: dbError 
        });
      }
    }
  }

  async processUserTweets(userId: string, tweets: Tweet[]): Promise<void> {
    log.info(`Processing ${tweets.length} tweets for user ${userId}`, { 
      userId,
      tweetCount: tweets.length 
    });
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
          log.info(`Attempting to post tweet ${tweet.id} for user ${userId}`, { 
            tweetId: tweet.id,
            userId,
            community: tweet.community 
          });
          
          const communityId = getCommunityId(tweet.community);
          
          const tweetOptions: any = {
            text: tweet.content
          };
          
          // Validate community mapping if community is specified
          if (tweet.community && tweet.community.trim() !== '') {
            if (!communityId) {
              throw new Error(`No community mapping found for: ${tweet.community}`);
            }
            tweetOptions.community_id = communityId;
          }
          
          // Post the tweet with appropriate options
          await twitterV2Client.v2.tweet(tweetOptions);
          await this.dbClient.updateTweetStatus(tweet.id!, TweetStatus.POSTED);
          log.info(`Successfully posted tweet ${tweet.id}`, { 
            tweetId: tweet.id,
            userId,
            community: tweet.community,
            communityId: communityId || 'none'
          });
        } catch (error) {
          log.error(`Error posting tweet ${tweet.id} for user ${userId}:`, { 
            tweetId: tweet.id,
            userId,
            error 
          });
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