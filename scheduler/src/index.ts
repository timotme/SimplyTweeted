import { DatabaseClient } from 'shared-lib/backend';
import { Tweet } from 'shared-lib';
import { TokenManager } from './tokenManager.js';
import { MONGODB_URI, DB_ENCRYPTION_KEY, CRON_SCHEDULE } from './config.js';
import { TweetProcessor } from './tweetProcessor.js';
import cron from 'node-cron';

// Initialize database client
const dbClient = DatabaseClient.getInstance(MONGODB_URI, DB_ENCRYPTION_KEY);
// Initialize token manager
const tokenManager = new TokenManager(dbClient);
// Initialize TweetProcessor
const tweetProcessor = new TweetProcessor(dbClient, tokenManager);

async function processTweets() {
  console.log('Starting tweet processing...');
  try {
    // Step 1: Find all due tweets
    const dueTweets = await dbClient.findDueTweets();
    console.log(`Found ${dueTweets.length} tweets to process`);
    
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
    console.error('Error in processTweets main loop:', error);
  }
}

// Check for 'runOnce' argument
if (process.argv.includes('runOnce')) {
  processTweets().then(() => {
    console.log('Finished processing tweets once.');
    dbClient.close().then(() => process.exit(0));
  }).catch(error => {
    console.error('Error during single run:', error);
    dbClient.close().then(() => process.exit(1));
  });
} else {
  // Schedule the cron job
  cron.schedule(CRON_SCHEDULE, () => {
    console.log(`Cron job triggered with schedule: ${CRON_SCHEDULE}`);
    processTweets();
  });
  console.log(`Scheduler started with cron schedule: ${CRON_SCHEDULE}`);
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down scheduler...');
  await dbClient.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down scheduler...');
  await dbClient.close();
  process.exit(0);
}); 