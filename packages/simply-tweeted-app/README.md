# Simply Tweeted App

A tweet scheduling application built with SvelteKit.

## Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
# Auth
AUTH_SECRET="your-auth-secret" # Generate with `openssl rand -base64 32`
AUTH_TRUST_HOST="true" # Set to true for local development
AUTH_TWITTER_ID="your-twitter-client-id"
AUTH_TWITTER_SECRET="your-twitter-client-secret"

# Database
MONGODB_URI="your-mongodb-connection-string"
DB_ENCRYPTION_KEY="your-db-encryption-key" # Generate with `openssl rand -base64 32`

# Security
ALLOWED_TWITTER_ACCOUNTS="username1,username2" # Comma-separated list of allowed Twitter usernames
```

4. To get Twitter (X) API credentials:
   - Go to the [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
   - Create a new project and app
   - Set up OAuth 2.0 with the following redirect URI:
     ```
     http://localhost:5173/api/auth/callback/twitter
     ```
   - Save your Client ID and Client Secret for the .env file as AUTH_TWITTER_ID and AUTH_TWITTER_SECRET

5. Set up MongoDB:
   - Create a MongoDB database (locally or using MongoDB Atlas)
   - Copy the connection string to the MONGODB_URI environment variable

6. Run the development server:
```bash
npm run dev
```

## Features

- X (Twitter) OAuth authentication
- Tweet scheduling
- Dashboard for managing scheduled tweets
- MongoDB database for data persistence
- Access control via allowed Twitter accounts
