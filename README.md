# Simply Tweeted

A clean, intuitive tweet scheduling platform that makes scheduling your X (Twitter) content effortless.



https://github.com/user-attachments/assets/a221680c-684f-41ae-99dd-5b5624675ab4



## Features

- **📅 Tweet Scheduling**: Plan your content in advance and let Simply Tweeted post it at the perfect time. **Support posting on communities**
- **🔐 Authentication**: OAuth integration with X (Twitter) for secure access
- **🔒 Token Security**: User tokens are encrypted and securely stored in the database
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices


## How to selfhost Simply Tweeted

Simply Tweeted can be easily self-hosted using Docker. You have two options for the database: use an existing MongoDB instance or self-host MongoDB alongside the application.

### Quick Start (Using External MongoDB)

**💡 Tip**: You can use [MongoDB](https://www.mongodb.com) which offers a free tier, perfect if you don't want to self-host MongoDB.

#### 1. Create X Developer Application

First, you'll need to create an X (Twitter) developer application to get your API credentials. Follow the detailed guide in the [Setting Up X (Twitter) Developer Application](#setting-up-x-twitter-developer-application) section below.

#### 2. Pull the Docker Image

```bash
docker pull ghcr.io/timotme/simplytweeted:latest
```

#### 3. Create Environment File

Create a `.env` file with your configuration:

```bash
# Authentication
AUTH_SECRET=your_auth_secret_key # Generate with `openssl rand -base64 64`
AUTH_URL=https://your-domain.com # Your public domain
AUTH_TRUST_HOST=true

# Database
DB_ENCRYPTION_KEY=your_encryption_key_for_tokens # Generate with `openssl rand -base64 64`
MONGODB_URI=mongodb://username:password@your-mongodb-host:27017/simplyTweeted

# Twitter API
AUTH_TWITTER_ID=your_twitter_client_id
AUTH_TWITTER_SECRET=your_twitter_client_secret

# Security
ALLOWED_TWITTER_ACCOUNTS=your_twitter_username,another_username # Comma-separated list

# Host Settings
ORIGIN=https://your-domain.com # Full URL as seen in browser
PORT=3000
```

#### 4. Run the Container

```bash
docker run -d \
  --name simply-tweeted \
  -p 3000:3000 \
  --env-file .env \
  ghcr.io/timotme/simplytweeted:latest
```

### Complete Self-Hosted Setup (Including MongoDB)

If you want to self-host MongoDB as well, use the provided Docker Compose configuration:

#### 1. Get the Docker Compose Files

```bash
# Download the docker-compose.yml and environment template
curl https://raw.githubusercontent.com/timotme/SimplyTweeted/main/deployment/prod/self-hosted/docker-compose.yml
```

#### 2. Create Environment File

Create a `.env.docker` file in the same directory:

```bash
# Authentication
AUTH_SECRET=your_auth_secret_key # Generate with `openssl rand -base64 32`
AUTH_URL=https://your-domain.com
AUTH_TRUST_HOST=true

# Database (for self-hosted MongoDB)
DB_ENCRYPTION_KEY=your_encryption_key_for_tokens # Generate with `openssl rand -base64 32`
MONGODB_URI=mongodb://root:example@mongo:27017/simplyTweeted

# Twitter API
AUTH_TWITTER_ID=your_twitter_client_id
AUTH_TWITTER_SECRET=your_twitter_client_secret

# Security
ALLOWED_TWITTER_ACCOUNTS=your_twitter_username,another_username

# Host Settings
ORIGIN=https://your-domain.com
PORT=3000
```

#### 3. Start the Services

```bash
docker-compose up -d
```

This will start both MongoDB and Simply Tweeted. The application will be available on port 3000, and MongoDB will be accessible on port 27018 (mapped from internal 27017).

### Important Notes

- **Twitter API Setup**: Make sure to configure your Twitter App's OAuth callback URL to match your domain
- **Security**: Use strong, randomly generated secrets for `AUTH_SECRET` and `DB_ENCRYPTION_KEY`
- **Firewall**: Only expose port 3000 to the internet; keep MongoDB port (27018) internal
- **Backup**: Regular database backups are recommended for production use
- **SSL**: Use a reverse proxy (like Nginx) with SSL certificates for production deployments

### Production Considerations

For production deployments, consider:
- Using a reverse proxy (Nginx/Traefik) with SSL termination
- Setting up automated backups for MongoDB

## Tech Stack

### Frontend
- **SvelteKit**: Modern web framework with SSR support
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **DaisyUI**: Beautiful component library

### Backend
- **Node.js** - Runtime environment
- **MongoDB** - Database for storing tweets and user data
- **Twitter API v2** - Official X (Twitter) API integration

### Infrastructure
- **Docker** - Containerized deployment
- **Node-cron** - Automated scheduling service

## Architecture

This is a monorepo containing three main packages:

- **`simply-tweeted-app`**: The main web application (SvelteKit)
- **`scheduler`**: Background service for posting scheduled tweets
- **`shared-lib`**: Shared TypeScript utilities and database models


## Getting Started


### Local Developement

**Requirements:**
- **Node.js 18+** - JavaScript runtime environment
- **npm** - Package manager
- **Docker** - For running MongoDB locally
- **X (Twitter) Developer Account** - Required for API access and OAuth integration

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/SimplyTweeted.git
cd SimplyTweeted
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Start MongoDB

```bash
cd deployment/dev
docker-compose up -d
```


#### 4. Environment Setup

Create the same environement file in the `scheduler` and `simply-tweeted-app` package:

**Create `.env`:**
```bash
# Authentication
AUTH_SECRET=your_auth_secret_key # Generate with `openssl rand -base64 32`
AUTH_URL=http://localhost:3000 # Base URL for authentication callbacks

# Database
DB_ENCRYPTION_KEY=your_encryption_key_for_tokens # Generate with `openssl rand -base64 32`
MONGODB_URI=mongodb://root:your_secure_password@localhost:27017/simplyTweeted

# Twitter API
AUTH_TWITTER_ID=your_twitter_client_id
AUTH_TWITTER_SECRET=your_twitter_client_secret

# Security
ALLOWED_TWITTER_ACCOUNTS=your_twitter_username,another_username # List of account allowed to access the scheduler separated by a comma

# Host setting
ORIGIN=http://localhost:3000 # Full URL as seen in the browser
PORT=3000 # Port on which the web app will be exposed
```


#### 5. Build Shared Library

```bash
npm run build --workspace=shared-lib
```

#### 6. Start Development Servers
This will run the front-end.
```bash
npm run dev --workspace=simply-tweeted-app
```
This will run the scheduler once
```bash
npm run dev runOnce  --workspace=tweet-poster-service
```

This will run the service concurently
```bash
npm run dev
```


The app will be available at:
- **Web App**: http://localhost:5173
- **Scheduler**: Runs in background


## Configuration

### Twitter API Setup

1. Create a Twitter Developer Account
2. Create a new App in the Twitter Developer Portal
3. Generate your API keys and tokens
4. Add the credentials to your environment file
5. Set up OAuth 2.0 with the correct callback URLs

### Database Schema

The application uses MongoDB with collections for:
- Users and authentication sessions
- Scheduled tweets
- Tweet history and analytics
- User preferences

## 🤝 Contributions Welcome!

We love contributions from the community! Whether you're fixing bugs, adding new features, improving documentation, or sharing ideas, your input helps make Simply Tweeted better for everyone.

**What we're looking for:**
- 🐛 Bug fixes and performance improvements
- ✨ New features and enhancements
- 📚 Documentation improvements
- 🎨 UI/UX enhancements
- 💡 Feature suggestions and feedback

**New to open source?** No problem! We welcome first-time contributors and are happy to help you get started!

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development

### Code Structure

```
packages/
├── simply-tweeted-app/     # Main web application
│   ├── src/routes/         # SvelteKit routes
│   ├── src/lib/           # Shared components and utilities
│   └── src/auth.ts        # Authentication configuration
├── scheduler/             # Tweet posting service
│   └── src/      # Main scheduler logic
└── shared-lib/            # Shared utilities and types
    ├── src/types/         # TypeScript type definitions
    └── src/database/      # Database models and utilities
```

## License

This project is licensed under the GPL-3.0-or-later License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/timotme/SimplyTweeted/issues) on GitHub.

---

Made with ❤️ by [Timothy] [https://x.com/timot_me]

## Setting Up X (Twitter) Developer Application

To use Simply Tweeted, you'll need to create an X (Twitter) developer application to get the required API credentials. Here's a step-by-step guide:

### 1. Apply for X Developer Access

1. **Visit the X Developer Portal**: Go to [developer.twitter.com](https://developer.x.com)
2. **Sign in**: Use your X (Twitter) account credentials
3. **Apply for Access**: Click "Apply" and select "Professional" use case
4. **Fill out the Application**: 
   - Describe your intended use (e.g., "Personal tweet scheduling application")
   - Explain how you'll use the Twitter API
   - Agree to the Developer Agreement and Policy

### 2. Create a New App

Once your developer account is approved:

1. **Navigate to the Developer Portal**: Go to your [developer dashboard](https://developer.x.com/en/portal/dashboard)
2. **Create a New Project**: Click "Create Project"
3. **Project Details**:
   - **Name**: Simply Tweeted (or your preferred name)
   - **Use Case**: Choose "Making a bot" or "Building tools for yourself"
   - **Environment**: Select "Development" for testing or "Production" for live use

### 3. Configure Your App

1. **App Settings**: Click on your newly created app
2. **App Permissions**: 
   - Set to **"Read and write"** (required for posting tweets)
   - Enable **"Request email address from users"** if you want email access
3. **Authentication Settings**:
   - **App Type**: Set to "Web App"
   - **Callback URLs**: Add your domain callback:
     ```
     https://your-domain.com/auth/callback/twitter
     ```
     For local development, also add:
     ```
     http://localhost:3000/auth/callback/twitter
     ```
   - **Website URL**: Add your application's URL (this is not important)

### 4. Generate OAuth 2.0 Credentials

Simply Tweeted uses OAuth 2.0 for authentication. You only need the OAuth 2.0 Client ID and Client Secret:

1. **User Authentication Settings**: In your app settings, click "Set up" in the OAuth 2.0 section
2. **OAuth 2.0 Settings**:
   - **App Type**: Select "Confidential client"
   - **Client ID**: This becomes your `AUTH_TWITTER_ID`
   - **Client Secret**: This becomes your `AUTH_TWITTER_SECRET`

**Note**: You don't need the older API Key and API Secret - Simply Tweeted only uses OAuth 2.0 credentials.

### Important Notes

- **Rate Limits**: Free tier has limited API calls per day/months. ~ 17 scheduled posts per 24h
- **Security**: Keep your API keys secure and never commit them to version control
- **Callback URLs**: Must exactly match your domain (including https/http)

### Common Issues

- **Callback URL Mismatch**: Ensure your `AUTH_URL` environment variable matches the callback URL in your X app
- **Permission Denied**: Verify your app has "Read and write" permissions
- **Invalid Credentials**: Double-check your `AUTH_TWITTER_ID` and `AUTH_TWITTER_SECRET`

For more detailed information, visit the [X API documentation](https://developer.twitter.com/en/docs).
