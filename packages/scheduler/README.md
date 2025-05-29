# Tweet Poster Service

This service runs periodically to check for and post scheduled tweets to X (formerly Twitter). It's built with TypeScript and uses a cron-based scheduler with automatic token refresh capabilities.

## Features

- **Automatic Scheduling**: Uses cron jobs to periodically check for due tweets
- **Batch Processing**: Groups tweets by user for efficient processing
- **Token Management**: Validates and automatically refreshes Twitter API tokens when needed
- **Error Handling**: Comprehensive error handling with detailed logging
- **Database Integration**: Uses the same MongoDB database as simply-tweeted-app to manage tweet status and user accounts
- **Development Tools**: Supports single-run mode for testing and debugging

## Architecture

The service is organized into modular components:

- `index.ts` - Main entry point with cron scheduling and graceful shutdown
- `config.ts` - Environment configuration management
- `logger.ts` - Structured logging with Pino (development-friendly output)
- `tokenManager.ts` - Twitter API token management with auto-refresh
- `tweetProcessor.ts` - Core tweet processing and posting logic

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with your configuration:
   ```env
   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017
   DB_ENCRYPTION_KEY=your_encryption_key_here
   
   # Cron Schedule (default: every minute)
   CRON_SCHEDULE=* * * * *
   
   # Twitter/X API credentials for OAuth 2.0
   AUTH_TWITTER_ID=your_twitter_client_id
   AUTH_TWITTER_SECRET=your_twitter_client_secret
   TWITTER_API_KEY=your_twitter_api_key
   TWITTER_API_SECRET=your_twitter_api_secret
   
   # Environment (optional, defaults to development)
   NODE_ENV=production
   ```

3. Build the TypeScript code:
   ```bash
   npm run build
   ```

## Running the Service

### Production Mode
```bash
npm start
```

### Development Mode
```bash
npm run dev
```

### Single Run (Testing)
```bash
npm run dev:once
```

### Debug Mode
```bash
npm run dev:debug
```

## How It Works

1. **Cron Scheduler**: The service runs on a configurable cron schedule (default: every minute)
2. **Tweet Discovery**: Finds tweets with `status=scheduled` and `scheduledDate` in the past
3. **User Grouping**: Groups tweets by user to minimize API calls and token refreshes
4. **Account Validation**: For each user, validates their Twitter account and token
5. **Token Refresh**: Automatically refreshes expired tokens using the refresh token
6. **Tweet Posting**: Posts each tweet to Twitter using the v2 API
7. **Status Updates**: Updates tweet status in the database to either `posted` or `failed`

## Token Management

The service uses Twitter's OAuth 2.0 with automatic token refresh and secure token handling:
- **Token Decryption**: Safely decrypts stored user tokens from the database before use
- **Automatic Refresh**: Access tokens are automatically refreshed when expired
- **Secure Storage**: Refresh tokens are stored encrypted in the shared MongoDB database
- **Database Updates**: Token updates are logged and saved back to the database
- **Error Recovery**: Failed token refreshes are logged for debugging

## Logging

The service uses structured logging with Pino:
- **Development**: Pretty-printed, colorized output with timestamps
- **Production**: Structured JSON logs for analysis
- **Log Levels**: Debug, info, warn, error, and fatal
- **Contextual Data**: Includes user IDs, tweet IDs, and error details

## Error Handling

- **Database Errors**: Graceful handling of MongoDB connection issues
- **API Errors**: Twitter API errors are caught and logged
- **Token Errors**: Automatic retry with token refresh
- **Batch Failures**: Individual tweet failures don't stop the entire batch
- **Graceful Shutdown**: Handles SIGINT and SIGTERM signals

## Dependencies

## Database

The scheduler service connects to the same MongoDB database used by the main simply-tweeted-app:
- **Shared Database**: Uses the same database instance and collections as the web application
- **Encrypted Data**: User tokens and sensitive data are stored with encryption
- **Status Tracking**: Tweet statuses are updated in real-time as they are processed
- **User Accounts**: Retrieves user authentication data including encrypted Twitter tokens 