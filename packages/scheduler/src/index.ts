import { DatabaseClient } from 'shared-lib/backend';
import { Tweet } from 'shared-lib';
import { TokenManager } from './tokenManager.js';
import { MONGODB_URI, DB_ENCRYPTION_KEY, CRON_SCHEDULE } from './config.js';
import { TweetProcessor } from './tweetProcessor.js';
import { log } from './logger.js';
import cron from 'node-cron';

// Initialize database client
const dbClient = DatabaseClient.getInstance(MONGODB_URI, DB_ENCRYPTION_KEY);
// Initialize token manager
const tokenManager = new TokenManager(dbClient);
// Initialize TweetProcessor
const tweetProcessor = new TweetProcessor(dbClient, tokenManager);

async function processTweets() {
  log.info('Starting tweet processing...');
  try {
    // Step 1: Find all due tweets
    const dueTweets = await dbClient.findDueTweets();
    log.info(`Found ${dueTweets.length} tweets to process`, { tweetCount: dueTweets.length });
    
    if (dueTweets.length === 0) {
      return;
    }
    
    // Step 2: Group tweets by user
    const tweetsByUser: Record<string, Tweet[]> = {};
    dueTweets.forEach((tweet: Tweet) => {
      if (!tweetsByUser[tweet.userId]) {
        tweetsByUser[tweet.userId] = [];
      }
      tweetsByUser[tweet.userId].push(tweet);
    });
    
    // Step 3: Process tweets for each user
    for (const userId in tweetsByUser) {
      // Delegate processing to TweetProcessor
      await tweetProcessor.processUserTweets(userId, tweetsByUser[userId]);
    }
  } catch (error) {
    // Catch high-level errors (e.g., finding due tweets)
    log.error('Error in processTweets main loop:', { error });
  }
}

// Check for 'runOnce' argument
if (process.argv.includes('runOnce')) {
  processTweets().then(() => {
    log.info('Finished processing tweets once.');
    dbClient.close().then(() => process.exit(0));
  }).catch(error => {
    log.error('Error during single run:', { error });
    dbClient.close().then(() => process.exit(1));
  });
} else {
  // Schedule the cron job
  cron.schedule(CRON_SCHEDULE, () => {
    log.info(`Cron job triggered with schedule: ${CRON_SCHEDULE}`, { cronSchedule: CRON_SCHEDULE });
    processTweets();
  });
  log.info(`Scheduler started with cron schedule: ${CRON_SCHEDULE}`, { cronSchedule: CRON_SCHEDULE });
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  log.info('Shutting down scheduler...');
  await dbClient.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  log.info('Shutting down scheduler...');
  await dbClient.close();
  process.exit(0);
}); 