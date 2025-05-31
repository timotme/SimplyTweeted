# Simply Tweeted

A clean, intuitive tweet scheduling platform that makes managing your X (Twitter) content effortless.


## Features

- **📅 Tweet Scheduling**: Plan your content in advance and let Simply Tweeted post it at the perfect time
- **🔐 Authentication**: OAuth integration with X (Twitter) for secure access
- **🔒 Token Security**: User tokens are encrypted and securely stored in the database
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices

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

Made with ❤️ for the X community 