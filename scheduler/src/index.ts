import { DatabaseClient } from 'shared-lib/backend';
import { Tweet } from 'shared-lib';
import { TokenManager } from './tokenManager.js';
import { MONGODB_URI, SCHEDULER_INTERVAL_MINUTES } from './config.js';
import { TweetProcessor } from './tweetProcessor.js';

// Initialize database client
const dbClient = DatabaseClient.getInstance(MONGODB_URI);
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

// Run scheduler immediately on startup
processTweets();

// Set interval to run scheduler
setInterval(processTweets, SCHEDULER_INTERVAL_MINUTES * 60 * 1000);

console.log(`Scheduler started. Running every ${SCHEDULER_INTERVAL_MINUTES} minutes.`);

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