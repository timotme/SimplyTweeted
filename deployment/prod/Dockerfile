# Stage 1: Build the SvelteKit application and scheduler
FROM --platform=linux/amd64 node:22-bullseye-slim AS builder

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

# Build the shared-lib package first (since other packages depend on it)
WORKDIR /app/packages/shared-lib
RUN npm run build

# Build the app package
WORKDIR /app/packages/simply-tweeted-app
RUN npm run build

# Build the scheduler package
WORKDIR /app/packages/scheduler
RUN npm run build

# Stage 2: Production environment
FROM --platform=$TARGETPLATFORM node:22-bullseye-slim

# Create a non-root user and group (Debian syntax)
RUN groupadd -g 1001 nodejs && \
    useradd -r -u 1001 -g nodejs app

WORKDIR /app

# Copy workspace configuration
COPY package.json package-lock.json* ./
# Copy package.json files for all packages
COPY packages/simply-tweeted-app/package.json ./packages/simply-tweeted-app/
COPY packages/shared-lib/package.json ./packages/shared-lib/
COPY packages/scheduler/package.json ./packages/scheduler/

# Copy built shared-lib from builder stage
COPY --from=builder /app/packages/shared-lib/dist ./packages/shared-lib/dist
COPY --from=builder /app/packages/shared-lib/package.json ./packages/shared-lib/
# Copy built app from builder stage
COPY --from=builder /app/packages/simply-tweeted-app/build ./packages/simply-tweeted-app/build
# Copy built scheduler from builder stage
COPY --from=builder /app/packages/scheduler/dist ./packages/scheduler/dist

# Install production dependencies and concurrently
RUN npm ci --omit=dev && npm install -g concurrently

# Change ownership of the app directory to the non-root user
RUN chown -R app:nodejs /app

# Switch to non-root user
USER app

# Expose the port the app will run on
EXPOSE 3000

ENV NODE_ENV=production
ENV AUTH_TRUST_HOST=true

# Run both the frontend and scheduler using concurrently
CMD ["concurrently", "--names", "FRONTEND,SCHEDULER", "--prefix-colors", "blue,green", "node packages/simply-tweeted-app/build/index.js", "node packages/scheduler/dist/index.js"]