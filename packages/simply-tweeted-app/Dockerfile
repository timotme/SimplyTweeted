# Stage 1: Build the SvelteKit application
FROM node:22-alpine AS builder

WORKDIR /app

# Environment variables needed for the build process (if any)
# SvelteKit typically uses .env files or variables prefixed with PUBLIC_ or VITE_
# For variables needed by the client, ensure they are exposed correctly
# e.g., ENV PUBLIC_MY_VAR=$MY_BUILD_ARG_VAR
# For this example, we assume environment variables are mostly for runtime

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build # This uses vite build, which is correct

# Stage 2: Production environment
FROM node:22-alpine

WORKDIR /app

# Copy built app from builder stage
# adapter-node typically outputs to 'build' directory
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json* ./package-lock.json*

# Install only production dependencies
RUN npm ci --omit=dev

# Expose the port the app will run on (default for SvelteKit node apps is often 3000)
# You might need to configure this in your SvelteKit app or pass PORT env var
EXPOSE 3000

# Environment variables (will be passed at `docker run` time)
# These are examples, your app will read them from the environment
# ENV AUTH_SECRET=your_auth_secret_value
# ENV DB_ENCRYPTION_KEY=your_db_encryption_key_value
# ENV AUTH_TWITTER_ID=your_auth_twitter_id_value
# ENV AUTH_TWITTER_SECRET=your_auth_twitter_secret_value
# ENV ALLOWED_TWITTER_ACCOUNTS=your_allowed_twitter_accounts_value
# ENV MONGODB_URI=your_mongodb_uri_value

CMD ["node", "build/index.js"] 