# Build stage
FROM node:20-alpine AS builder

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

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

# Copy package files
COPY package.json yarn.lock ./

# Install production dependencies and optimize
RUN --mount=type=cache,target=/root/.yarn \
    yarn install --production --frozen-lockfile --network-timeout 100000 && \
    yarn cache clean && \
    # Remove unnecessary files from node_modules
    find node_modules -name "*.md" -delete && \
    find node_modules -name "*.txt" -delete && \
    find node_modules -name "LICENSE*" -delete && \
    find node_modules -name "CHANGELOG*" -delete && \
    find node_modules -name "*.map" -delete && \
    find node_modules -name "*.d.ts" -delete && \
    find node_modules -name ".DS_Store" -delete && \
    # Remove test directories
    find node_modules -name "__tests__" -type d -exec rm -rf {} + 2>/dev/null || true && \
    find node_modules -name "test" -type d -exec rm -rf {} + 2>/dev/null || true && \
    find node_modules -name "tests" -type d -exec rm -rf {} + 2>/dev/null || true && \
    find node_modules -name "spec" -type d -exec rm -rf {} + 2>/dev/null || true && \
    find node_modules -name "coverage" -type d -exec rm -rf {} + 2>/dev/null || true && \
    # Remove documentation directories
    find node_modules -name "docs" -type d -exec rm -rf {} + 2>/dev/null || true && \
    find node_modules -name "doc" -type d -exec rm -rf {} + 2>/dev/null || true && \
    find node_modules -name "website" -type d -exec rm -rf {} + 2>/dev/null || true && \
    find node_modules -name "example" -type d -exec rm -rf {} + 2>/dev/null || true && \
    find node_modules -name "examples" -type d -exec rm -rf {} + 2>/dev/null || true && \
    # Remove build tools and unnecessary binaries
    rm -rf node_modules/.bin || true

# Final production stage - Distroless for minimal size
FROM gcr.io/distroless/nodejs20-debian12

WORKDIR /app

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

# Copy optimized production dependencies
COPY --from=deps /app/node_modules ./node_modules

# Expose app port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production

# Start the app (no shell available in distroless)
CMD ["dist/main"]