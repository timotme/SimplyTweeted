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
TWITTER_CLIENT_ID="your-twitter-client-id"
TWITTER_CLIENT_SECRET="your-twitter-client-secret"
```

4. To get Twitter (X) API credentials:
   - Go to the [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
   - Create a new project and app
   - Set up OAuth 2.0 with the following redirect URI:
     ```
     http://localhost:5173/api/auth/callback/twitter
     ```
   - Save your Client ID and Client Secret for the .env file

5. Run the development server:
```bash
npm run dev
```

## Features

- X (Twitter) OAuth authentication
- Tweet scheduling
- Dashboard for managing scheduled tweets
