import { TwitterApi, IParsedOAuth2TokenResult } from 'twitter-api-v2';
import { TwitterApiAutoTokenRefresher } from '@twitter-api-v2/plugin-token-refresher';
import { UserAccount } from 'shared-lib';
import { DatabaseClient } from 'shared-lib/backend';
import { AUTH_TWITTER_ID, AUTH_TWITTER_SECRET } from './config.js';
import { log } from './logger.js';

export class TokenManager {
  private dbClient: DatabaseClient;

  constructor(dbClient: DatabaseClient) {
    this.dbClient = dbClient;
  }

  /**
   * Creates a Twitter API client with automatic token refreshing.
   * The UserAccount object will be updated in the database whenever the token is refreshed.
   */
  public getTwitterApiClient(account: UserAccount): TwitterApi {
    const autoRefresherPlugin = new TwitterApiAutoTokenRefresher({
      refreshToken: account.refresh_token,
      refreshCredentials: {
        clientId: AUTH_TWITTER_ID,
        clientSecret: AUTH_TWITTER_SECRET,
      },
      onTokenUpdate: async (token: IParsedOAuth2TokenResult) => {
        log.info(`Token updated for user ${account.userId}. New access token: ${token.accessToken}`, { 
          userId: account.userId, 
          accessToken: token.accessToken?.substring(0, 10) + '...' // Log only first 10 chars for security
        });
        
        // Calculate expires_at. token.expiresIn is in seconds.
        const newExpiresAt = token.expiresIn ? Math.floor(Date.now() / 1000) + token.expiresIn : account.expires_at;

        const updatedAccount: UserAccount = {
          ...account,
          access_token: token.accessToken,
          refresh_token: token.refreshToken || account.refresh_token, // Keep old if new one is not provided
          expires_at: newExpiresAt,
          expires_in: token.expiresIn, 
          updatedAt: new Date(),
        };
        try {
          await this.dbClient.saveUserAccount(updatedAccount);
          log.info(`Successfully saved updated token for user ${account.userId}`, { userId: account.userId });
        } catch (error) {
          log.error(`Error saving updated token for user ${account.userId}:`, { userId: account.userId, error });
        }
      },
      onTokenRefreshError: (error) => {
        log.error(`Error refreshing token for user ${account.userId} via plugin:`, { userId: account.userId, error });
      },
    });

    return new TwitterApi(account.access_token, { plugins: [autoRefresherPlugin] });
  }
} 