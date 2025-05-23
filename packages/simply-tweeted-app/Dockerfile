# Stage 1: Build the SvelteKit application
FROM node:22-alpine AS builder

WORKDIR /app

# Copy root package.json and workspace config
COPY package.json package-lock.json* ./
# Copy package.json files from all workspace packages
COPY packages/simply-tweeted-app/package.json ./packages/simply-tweeted-app/
COPY packages/shared-lib/package.json ./packages/shared-lib/
COPY packages/scheduler/package.json ./packages/scheduler/

# Install all dependencies (including dev)
RUN npm install

# Copy all source files
COPY . .

# Build the app package
WORKDIR /app/packages/simply-tweeted-app
RUN npm run build

# Stage 2: Production environment
FROM node:22-alpine

WORKDIR /app

# Copy workspace configuration
COPY package.json package-lock.json* ./
# Copy package.json files for all packages
COPY packages/simply-tweeted-app/package.json ./packages/simply-tweeted-app/
COPY packages/shared-lib/package.json ./packages/shared-lib/
COPY packages/scheduler/package.json ./packages/scheduler/

# Copy built app from builder stage
COPY --from=builder /app/packages/simply-tweeted-app/build ./packages/simply-tweeted-app/build

# Install production dependencies only
RUN npm ci --omit=dev

# Expose the port the app will run on
EXPOSE 3000

# Environment variables will be passed at runtime
# ENV AUTH_SECRET=your_auth_secret_value
# ENV DB_ENCRYPTION_KEY=your_db_encryption_key_value
# ENV AUTH_TWITTER_ID=your_auth_twitter_id_value
# ENV AUTH_TWITTER_SECRET=your_auth_twitter_secret_value
# ENV ALLOWED_TWITTER_ACCOUNTS=your_allowed_twitter_accounts_value
# ENV MONGODB_URI=your_mongodb_uri_value

ENV NODE_ENV=production
ENV AUTH_TRUST_HOST=true

WORKDIR /app/packages/simply-tweeted-app
CMD ["node", "build/index.js"] 