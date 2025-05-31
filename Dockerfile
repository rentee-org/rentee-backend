# Build stage
FROM node:20-alpine AS builder

# Install build dependencies
RUN apk add --no-cache python3 make g++ dumb-init

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install all dependencies with optimizations
RUN --mount=type=cache,target=/root/.yarn \
    yarn install --frozen-lockfile --network-timeout 100000 && \
    yarn cache clean

# Copy source code
COPY . .

# Build the application
RUN yarn build && \
    # Remove source files after build
    rm -rf src && \
    rm -rf test

# Production dependencies stage
FROM node:20-alpine AS deps

WORKDIR /app

# Install build dependencies for bcrypt
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package.json yarn.lock ./

# Install production dependencies and optimize
RUN --mount=type=cache,target=/root/.yarn \
    yarn install --production --frozen-lockfile --network-timeout 100000 && \
    yarn cache clean && \
    # Remove unnecessary files
    find node_modules -name "*.md" -delete && \
    find node_modules -name "*.txt" -delete && \
    find node_modules -name "LICENSE*" -delete && \
    find node_modules -name "CHANGELOG*" -delete && \
    find node_modules -name "*.map" -delete && \
    find node_modules -name "*.d.ts" -delete && \
    find node_modules -name ".DS_Store" -delete && \
    # Remove test and doc directories
    find node_modules -type d -name "__tests__" -exec rm -rf {} + 2>/dev/null || true && \
    find node_modules -type d -name "test" -exec rm -rf {} + 2>/dev/null || true && \
    find node_modules -type d -name "tests" -exec rm -rf {} + 2>/dev/null || true && \
    find node_modules -type d -name "docs" -exec rm -rf {} + 2>/dev/null || true

# Final production stage
FROM node:20-alpine

# Install production dependencies
RUN apk add --no-cache dumb-init

WORKDIR /app

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
# COPY --from=builder /app/.env.production ./

# Copy optimized production dependencies
COPY --from=deps /app/node_modules ./node_modules

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV Railway_DB_URL=postgresql://postgres:fkEJLjGIsNlRJaQFQyBaGMAKJGxbkJLl@switchyard.proxy.rlwy.net:21182/railway

# Expose port
EXPOSE ${PORT}

# Use dumb-init as entrypoint
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Start the application
CMD ["node", "dist/main"]