# Tweet Poster Service

This service runs periodically to check for and post scheduled tweets to X (formerly Twitter).

## Features

- Automatically finds tweets scheduled for posting that are now due
- Groups tweets by user for efficient processing
- Validates and refreshes API tokens when needed
- Updates tweet status in the database after posting

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file with your configuration:
   ```
   MONGODB_URI=mongodb://localhost:27017
   ENCRYPTION_KEY=your_encryption_key_here
   SCHEDULER_INTERVAL_MINUTES=10

   # Twitter/X API credentials
   TWITTER_API_KEY=your_twitter_api_key
   TWITTER_API_SECRET=your_twitter_api_secret
   TWITTER_CLIENT_ID=your_twitter_client_id
   ```

3. Build the TypeScript code:
   ```
   npm run build
   ```

## Running the Service

To run the service:

```
npm start
```

For development:

```
npm run dev
```

## How It Works

1. The service checks the database for tweets with `status=scheduled` and a `scheduledDate` in the past
2. Groups tweets by user to minimize API calls
3. Validates the user's Twitter API tokens, refreshing them if needed
4. Posts each tweet to Twitter
5. Updates the tweet status in the database to either `posted` or `failed`

The service runs on the schedule defined by `SCHEDULER_INTERVAL_MINUTES` (default is 10 minutes). 